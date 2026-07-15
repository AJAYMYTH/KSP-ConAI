/**
 * case-summary.js
 * Skill module to fetch a full case bundle and generate a grounded summary.
 * Uses QuickML prediction endpoint when configured; otherwise falls back to a structured template.
 */

const { executeQuery } = require('../../shared/database');

/**
 * Fetches the complete case bundle by FIR number.
 * 
 * @param {string} firNumber - The FIR number (e.g. '0001/2026')
 * @param {object} app - Catalyst App instance
 * @returns {Promise<object|null>} Complete case details bundle
 */
async function fetchCaseBundle(firNumber, app) {
  try {
    // 1. Fetch CaseMaster detail
    const caseMasterQuery = `SELECT ROWID, fir_number, crime_registered_date, incident_from_date, incident_to_date, place_of_occurrence, summary_of_facts, fir_status FROM CaseMaster WHERE fir_number = '${firNumber}' LIMIT 1`;
    const caseMasters = await executeQuery(app, caseMasterQuery);
    
    if (caseMasters.length === 0) {
      return null;
    }
    
    const caseInfo = caseMasters[0];
    const caseId = caseInfo.ROWID;

    // 2. Fetch children in parallel
    const complainantsQuery = `SELECT name, age, gender, phone, address FROM ComplainantDetails WHERE case_id = ${caseId}`;
    const victimsQuery = `SELECT name, age, gender, injury_type FROM Victim WHERE case_id = ${caseId}`;
    const accusedQuery = `SELECT name, alias_name, age, gender, status FROM Accused WHERE case_id = ${caseId}`;
    const actsSectionsQuery = `SELECT Act.act_name, Section.section_number, Section.section_description FROM ActSectionAssociation JOIN Act ON ActSectionAssociation.act_id = Act.ROWID JOIN Section ON ActSectionAssociation.section_id = Section.ROWID WHERE ActSectionAssociation.case_id = ${caseId}`;

    const [complainants, victims, accused, actsSections] = await Promise.all([
      executeQuery(app, complainantsQuery),
      executeQuery(app, victimsQuery),
      executeQuery(app, accusedQuery),
      executeQuery(app, actsSectionsQuery)
    ]);

    return {
      caseMaster: caseInfo,
      complainants,
      victims,
      accused,
      actsSections
    };
  } catch (err) {
    console.error('[CaseSummary] Error assembling case bundle:', err.message);
    throw err;
  }
}

/**
 * Runs the Case Summary skill.
 * 
 * @param {object} slots - Extracted slots containing firNumber
 * @param {object} app - Catalyst App instance
 * @returns {Promise<object>} Summary result
 */
async function executeCaseSummary(slots, app) {
  if (!slots.firNumber) {
    return {
      success: false,
      answer: 'Please provide a valid case or FIR number (e.g. 0001/2026) to summarize.',
      confidence: 'low'
    };
  }

  try {
    const bundle = await fetchCaseBundle(slots.firNumber, app);
    if (!bundle) {
      return {
        success: false,
        answer: `Case with FIR number ${slots.firNumber} was not found in the database.`,
        confidence: 'high'
      };
    }

    const { caseMaster, complainants, victims, accused, actsSections } = bundle;
    let summaryText = '';

    // --- Tier 1: Try QuickML Summarizer if key exists ---
    const endpointKey = process.env.QUICKML_SUMMARIZER_KEY;
    if (endpointKey && app) {
      try {
        console.log('[CaseSummary] Generating summary using QuickML...');
        const quickML = app.quickML();
        
        const prompt = `
        System: You are an AI assistant for the Karnataka State Police.
        Summarize the following case details in a formal, professional tone. 
        Follow these rules strictly:
        1. Base your summary ONLY on the provided Context.
        2. Do NOT invent names, dates, charges, or outcomes.
        3. Do NOT make guilt determinations.
        4. If complainant or victim details are missing, explicitly state "Complainant/victim details are not on file."
        5. Maintain a concise but complete narrative structure.

        Context:
        ${JSON.stringify(bundle, null, 2)}
        `;

        const response = await quickML.predict(endpointKey, { prompt });
        if (response && response.success && response.data && response.data.summary) {
          summaryText = response.data.summary;
        } else if (response && response.success && response.data && response.data.text) {
          summaryText = response.data.text;
        }
      } catch (err) {
        console.error('[CaseSummary] QuickML summary generation failed, falling back to template:', err.message);
      }
    }

    // --- Tier 2: Template-based fallback summary ---
    if (!summaryText) {
      console.log('[CaseSummary] Generating template-based case summary...');
      const dateStr = caseMaster.crime_registered_date 
        ? new Date(caseMaster.crime_registered_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) 
        : 'N/A';
      
      const actsList = actsSections.length > 0 
        ? actsSections.map(as => `${as.act_name} Sec ${as.section_number}`).join(', ') 
        : 'Sections not recorded';

      const accusedNames = accused.length > 0
        ? accused.map(a => `${a.name}${a.alias_name ? ` @ ${a.alias_name}` : ''} (${a.status})`).join(', ')
        : 'Unidentified/Unknown';

      const complainantNames = complainants.length > 0
        ? complainants.map(c => c.name).join(', ')
        : 'Not recorded';

      const victimNames = victims.length > 0
        ? victims.map(v => `${v.name} (${v.injury_type || 'uninjured'})`).join(', ')
        : 'Not recorded';

      summaryText = `**Case Overview (FIR ${caseMaster.fir_number})**
- **Date Registered:** ${dateStr}
- **Place of Occurrence:** ${caseMaster.place_of_occurrence || 'Not specified'}
- **Applicable Laws:** ${actsList}
- **Complainant(s):** ${complainantNames}
- **Victim(s):** ${victimNames}
- **Accused Person(s):** ${accusedNames}
- **FIR Status:** ${caseMaster.fir_status || 'Under Review'}

**Summary of Facts:**
${caseMaster.summary_of_facts || 'No fact summary listed in CaseMaster.'}`;
      
      if (complainants.length === 0) {
        summaryText += '\n\n*Note: Complainant details are not on file.*';
      }
      if (victims.length === 0) {
        summaryText += '\n*Note: Victim details are not on file.*';
      }
    }

    return {
      success: true,
      answer: summaryText,
      supportingData: bundle,
      linkedCases: [caseMaster.fir_number],
      sources: ['CaseMaster', 'ComplainantDetails', 'Victim', 'Accused', 'ActSectionAssociation'],
      confidence: 'high'
    };
  } catch (err) {
    console.error('[CaseSummary] Error executing summary skill:', err.message);
    return {
      success: false,
      answer: `Failed to compile summary for case ${slots.firNumber}.`,
      supportingData: { error: err.message },
      sources: ['CaseMaster'],
      confidence: 'low'
    };
  }
}

module.exports = {
  executeCaseSummary,
  fetchCaseBundle
};
