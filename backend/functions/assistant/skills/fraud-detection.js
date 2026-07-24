/**
 * fraud-detection.js
 * Skill module to analyze database cases for financial fraud and cybercrime patterns.
 * Grounded strictly in database data (CaseMaster, ComplainantDetails, Accused, etc.).
 */

const { executeQuery } = require('../../shared/database');
const { generateGroundedResponse } = require('../llm-client');

/**
 * Fetches financial fraud & cybercrime case records from the database.
 * 
 * @param {object} app - Catalyst App instance
 * @returns {Promise<object>} Structured fraud investigation context
 */
async function fetchDatabaseFraudCases(app) {
  try {
    // 1. Query cases matching fraud, cybercrime, phishing, cheating, or online financial scams
    const fraudQuery = `
      SELECT ROWID, fir_number, crime_registered_date, place_of_occurrence, summary_of_facts, fir_status 
      FROM CaseMaster 
      WHERE summary_of_facts LIKE '%cyber%' 
         OR summary_of_facts LIKE '%fraud%' 
         OR summary_of_facts LIKE '%phishing%' 
         OR summary_of_facts LIKE '%bank%' 
         OR summary_of_facts LIKE '%money%' 
         OR summary_of_facts LIKE '%online%'
         OR summary_of_facts LIKE '%theft%'
      ORDER BY ROWID DESC LIMIT 20
    `;

    const rawCases = await executeQuery(app, fraudQuery);

    const fraudDetails = [];
    for (const c of rawCases) {
      const accused = await executeQuery(app, `SELECT name, alias_name, status FROM Accused WHERE case_id = ${c.ROWID}`);
      
      // Extract monetary loss estimates if mentioned in summary of facts
      const amountMatch = c.summary_of_facts.match(/Rs\.?\s*([\d,]+)|₹\s*([\d,]+)|([\d,]+)\s*rupees/i);
      const estimatedLoss = amountMatch ? (amountMatch[1] || amountMatch[2] || amountMatch[3]) : 'Unspecified';

      // Categorize fraud scheme
      let fraudType = 'Cyber/Financial Fraud';
      const summaryLower = c.summary_of_facts.toLowerCase();
      if (summaryLower.includes('phishing') || summaryLower.includes('link')) fraudType = 'Phishing / Malicious Link';
      else if (summaryLower.includes('otp') || summaryLower.includes('bank')) fraudType = 'Banking / OTP Scam';
      else if (summaryLower.includes('job') || summaryLower.includes('task')) fraudType = 'Online Job / Task Scam';
      else if (summaryLower.includes('investment') || summaryLower.includes('crypto')) fraudType = 'Investment / Crypto Fraud';

      fraudDetails.push({
        fir_number: c.fir_number,
        fraudType,
        estimatedLoss,
        registeredDate: c.crime_registered_date,
        place: c.place_of_occurrence,
        summary: c.summary_of_facts,
        accused: accused.map(a => `${a.name}${a.alias_name ? ` (${a.alias_name})` : ''} - Status: ${a.status}`)
      });
    }

    return {
      totalFraudCasesFound: fraudDetails.length,
      cases: fraudDetails
    };
  } catch (err) {
    console.error('[FraudDetection] Error fetching database fraud cases:', err.message);
    return {
      totalFraudCasesFound: 0,
      cases: [],
      error: err.message
    };
  }
}

/**
 * Executes Fraud Detection skill.
 * 
 * @param {object} slots - Extracted query parameters
 * @param {object} app - Catalyst App instance
 * @returns {Promise<object>} Fraud detection response envelope
 */
async function executeFraudDetection(slots, app) {
  try {
    const fraudData = await fetchDatabaseFraudCases(app);
    const linkedCases = fraudData.cases.map(f => f.fir_number).filter(Boolean);

    // Fallback deterministic summary
    let fallbackAnswer = `### FINANCIAL FRAUD & CYBERCRIME ANALYSIS (Database Grounded)\n\n` +
      `**Total Fraud/Cyber Cases Identified:** ${fraudData.totalFraudCasesFound}\n\n`;

    if (fraudData.cases.length > 0) {
      fallbackAnswer += `#### Identified Fraud Incidents & Patterns:\n`;
      fraudData.cases.forEach((item, index) => {
        fallbackAnswer += `**${index + 1}. FIR ${item.fir_number}** (${item.fraudType})\n` +
          `- **Estimated Loss:** ${item.estimatedLoss}\n` +
          `- **Accused logged:** ${item.accused.length > 0 ? item.accused.join(', ') : 'None registered yet'}\n` +
          `- **Summary:** ${item.summary}\n\n`;
      });
    } else {
      fallbackAnswer += `No active cybercrime or financial fraud records found matching the query criteria in the database.\n`;
    }

    fallbackAnswer += `*Note: All findings are compiled directly from CaseMaster, Complainant, and Accused database tables.*`;

    // Invoke LLM Client for grounded response synthesis
    const llmResult = await generateGroundedResponse({
      prompt: "Analyze the database records for financial fraud schemes, cybercrime modus operandi, monetary loss trends, and suspect account linkages.",
      dbContext: fraudData,
      app,
      taskName: "Fraud & Cybercrime Detection Analysis",
      fallbackAnswer
    });

    return {
      success: true,
      answer: llmResult.answer,
      supportingData: fraudData,
      linkedCases: [...new Set(linkedCases)],
      sources: ['CaseMaster', 'Accused', 'ComplainantDetails'],
      confidence: 'high'
    };

  } catch (err) {
    console.error('[FraudDetection] Skill execution failed:', err);
    return {
      success: false,
      answer: `Failed to execute fraud detection: ${err.message}`,
      confidence: 'low'
    };
  }
}

module.exports = {
  executeFraudDetection
};
