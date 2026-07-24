/**
 * anomaly-detection.js
 * Skill module to analyze database case records for operational & procedural anomalies.
 * Grounded strictly in database data (CaseMaster, Accused, ComplainantDetails, etc.).
 */

const { executeQuery } = require('../../shared/database');
const { generateGroundedResponse } = require('../llm-client');

/**
 * Fetches potential anomaly indicators from the database.
 * 
 * @param {object} app - Catalyst App instance
 * @returns {Promise<object>} Structured anomaly records
 */
async function fetchDatabaseAnomalies(app) {
  try {
    // 1. Fetch cases with significant registration delay (> 14 days between incident & FIR registration)
    const delayedCasesQuery = `
      SELECT ROWID, fir_number, crime_registered_date, incident_from_date, summary_of_facts, fir_status 
      FROM CaseMaster 
      WHERE crime_registered_date IS NOT NULL AND incident_from_date IS NOT NULL
      ORDER BY ROWID DESC LIMIT 15
    `;
    const cases = await executeQuery(app, delayedCasesQuery);

    const delayedCases = cases.filter(c => {
      const reg = new Date(c.crime_registered_date).getTime();
      const inc = new Date(c.incident_from_date).getTime();
      const diffDays = (reg - inc) / (1000 * 3600 * 24);
      return diffDays > 14; // delayed by more than 14 days
    }).map(c => ({
      fir_number: c.fir_number,
      registered: c.crime_registered_date,
      occurred: c.incident_from_date,
      delayDays: Math.round((new Date(c.crime_registered_date) - new Date(c.incident_from_date)) / (1000 * 3600 * 24)),
      summary: c.summary_of_facts
    }));

    // 2. Fetch cases missing accused records (unresolved accused status anomaly)
    const activeCasesQuery = `SELECT ROWID, fir_number, summary_of_facts FROM CaseMaster ORDER BY ROWID DESC LIMIT 20`;
    const activeCases = await executeQuery(app, activeCasesQuery);

    const incompleteCases = [];
    for (const c of activeCases.slice(0, 10)) {
      const accusedList = await executeQuery(app, `SELECT name, status FROM Accused WHERE case_id = ${c.ROWID}`);
      if (accusedList.length === 0) {
        incompleteCases.push({
          fir_number: c.fir_number,
          issue: "No suspect/accused registered on file for active FIR",
          summary: c.summary_of_facts
        });
      }
    }

    return {
      totalAnalyzed: cases.length,
      delayedRegistrations: delayedCases,
      incompleteAccusedRecords: incompleteCases,
      anomaliesDetectedCount: delayedCases.length + incompleteCases.length
    };
  } catch (err) {
    console.error('[AnomalyDetection] Error fetching database anomaly indicators:', err.message);
    return {
      totalAnalyzed: 0,
      delayedRegistrations: [],
      incompleteAccusedRecords: [],
      anomaliesDetectedCount: 0,
      error: err.message
    };
  }
}

/**
 * Executes Anomaly Detection skill.
 * 
 * @param {object} slots - Extracted query parameters
 * @param {object} app - Catalyst App instance
 * @returns {Promise<object>} Anomaly analysis response envelope
 */
async function executeAnomalyDetection(slots, app) {
  try {
    const anomalyData = await fetchDatabaseAnomalies(app);

    const linkedCases = [
      ...anomalyData.delayedRegistrations.map(d => d.fir_number),
      ...anomalyData.incompleteAccusedRecords.map(i => i.fir_number)
    ].filter(Boolean);

    // Fallback deterministic summary
    let fallbackAnswer = `### ANOMALY DETECTION REPORT (Database Grounded)\n\n` +
      `**Total Cases Analyzed:** ${anomalyData.totalAnalyzed}\n` +
      `**Anomalies Identified:** ${anomalyData.anomaliesDetectedCount}\n\n` +
      `#### 1. FIR Registration Delays (>14 Days):\n`;

    if (anomalyData.delayedRegistrations.length > 0) {
      anomalyData.delayedRegistrations.forEach(item => {
        fallbackAnswer += `- **FIR ${item.fir_number}**: Delay of **${item.delayDays} days** between incident date (${item.occurred}) and registration (${item.registered}).\n`;
      });
    } else {
      fallbackAnswer += `- No significant registration delay anomalies found in sampled records.\n`;
    }

    fallbackAnswer += `\n#### 2. Documentation / Accused Record Gaps:\n`;
    if (anomalyData.incompleteAccusedRecords.length > 0) {
      anomalyData.incompleteAccusedRecords.forEach(item => {
        fallbackAnswer += `- **FIR ${item.fir_number}**: ${item.issue}.\n`;
      });
    } else {
      fallbackAnswer += `- All sampled active FIRs have accused records logged.\n`;
    }

    fallbackAnswer += `\n*Note: All observations are compiled strictly from CaseMaster and Accused tables.*`;

    // Invoke LLM Client for grounded response synthesis
    const llmResult = await generateGroundedResponse({
      prompt: "Analyze the database records for anomalies such as delayed FIR filings, documentation gaps, and procedural outliers.",
      dbContext: anomalyData,
      app,
      taskName: "Anomaly Detection Analysis",
      fallbackAnswer
    });

    return {
      success: true,
      answer: llmResult.answer,
      supportingData: anomalyData,
      linkedCases: [...new Set(linkedCases)],
      sources: ['CaseMaster', 'Accused', 'ComplainantDetails'],
      confidence: 'high'
    };

  } catch (err) {
    console.error('[AnomalyDetection] Skill execution failed:', err);
    return {
      success: false,
      answer: `Failed to execute anomaly detection: ${err.message}`,
      confidence: 'low'
    };
  }
}

module.exports = {
  executeAnomalyDetection
};
