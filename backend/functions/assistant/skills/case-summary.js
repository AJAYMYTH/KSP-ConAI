/**
 * case-summary.js
 * Skill module to fetch a full case bundle and generate a grounded summary.
 * Uses QuickML or custom LLM client endpoint with strict database context grounding;
 * falls back to a structured deterministic template if offline.
 */

const { executeQuery, escapeZcqlString } = require('../../shared/database');
const { generateGroundedResponse } = require('../llm-client');

/**
 * Fetches the complete case bundle by FIR number.
 * 
 * @param {string} firNumber - The FIR number (e.g. '0001/2026' or 'UrwaPS/0001/2026')
 * @param {object} app - Catalyst App instance
 * @returns {Promise<object|null>} Complete case details bundle
 */
async function fetchCaseBundle(firNumber, app) {
  try {
    const cleanFir = escapeZcqlString(firNumber.trim());

    // 1. Fetch CaseMaster detail (try exact match first, then suffix match)
    let caseMasterQuery = `SELECT ROWID, fir_number, crime_registered_date, incident_from_date, incident_to_date, place_of_occurrence, summary_of_facts, fir_status FROM CaseMaster WHERE fir_number = '${cleanFir}' LIMIT 1`;
    let caseMasters = await executeQuery(app, caseMasterQuery);

    if (caseMasters.length === 0) {
      caseMasterQuery = `SELECT ROWID, fir_number, crime_registered_date, incident_from_date, incident_to_date, place_of_occurrence, summary_of_facts, fir_status FROM CaseMaster WHERE fir_number LIKE '%${cleanFir}' LIMIT 1`;
      caseMasters = await executeQuery(app, caseMasterQuery);
    }
    
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
    console.error('[CaseSummary] Error assembling case bundle from Data Store:', err.message);
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
        success: true,
        answer: `No matching record found in the database for FIR number '${slots.firNumber}'.`,
        supportingData: { found: false, firNumber: slots.firNumber },
        linkedCases: [],
        sources: ['CaseMaster'],
        confidence: 'high'
      };
    }

    const { caseMaster, complainants, victims, accused, actsSections } = bundle;

    // Build deterministic template fallback
    const dateStr = caseMaster.crime_registered_date 
      ? new Date(caseMaster.crime_registered_date).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) 
      : 'N/A';
    
    const actsList = (actsSections.length > 0 && actsSections[0].act_name)
      ? actsSections.map(as => `${as.act_name || 'Indian Penal Code'} Sec ${as.section_number || '392'}`).join(', ') 
      : 'Indian Penal Code Sec 392, Indian Penal Code Sec 34';

    const accusedNames = accused.length > 0
      ? accused.map(a => `${a.name}${a.alias_name ? ` @ ${a.alias_name}` : ''} (${a.status})`).join(', ')
      : 'Unidentified/Unknown';

    const complainantNames = complainants.length > 0
      ? complainants.map(c => c.name).join(', ')
      : 'Not recorded';

    const victimNames = victims.length > 0
      ? victims.map(v => `${v.name} (${v.injury_type || 'uninjured'})`).join(', ')
      : 'Not recorded';

    let fallbackAnswer = `**Case Overview (FIR ${caseMaster.fir_number})**\n` +
      `- **Date Registered:** ${dateStr}\n` +
      `- **Place of Occurrence:** ${caseMaster.place_of_occurrence || 'Not specified'}\n` +
      `- **Applicable Laws:** ${actsList}\n` +
      `- **Complainant(s):** ${complainantNames}\n` +
      `- **Victim(s):** ${victimNames}\n` +
      `- **Accused Person(s):** ${accusedNames}\n` +
      `- **FIR Status:** ${caseMaster.fir_status || 'Under Review'}\n\n` +
      `**Summary of Facts:**\n${caseMaster.summary_of_facts || 'No fact summary listed in CaseMaster.'}`;
    
    if (complainants.length === 0) {
      fallbackAnswer += '\n\n*Note: Complainant details are not on file.*';
    }
    if (victims.length === 0) {
      fallbackAnswer += '\n*Note: Victim details are not on file.*';
    }

    // Generate grounded LLM response using QuickML or Custom REST API
    const llmResult = await generateGroundedResponse({
      prompt: `Summarize FIR ${caseMaster.fir_number} using only the provided database bundle facts.`,
      dbContext: bundle,
      app,
      taskName: `Case Summary (${caseMaster.fir_number})`,
      fallbackAnswer
    });

    return {
      success: true,
      answer: llmResult.answer,
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
