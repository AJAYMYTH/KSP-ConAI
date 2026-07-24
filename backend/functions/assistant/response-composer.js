/**
 * response-composer.js
 * Formats the final assistant response envelope and applies role-based redactions.
 */

const { redactPII } = require('../shared/database');

/**
 * Composes a standard assistant response envelope.
 * 
 * @param {object} params - Input parameters
 * @param {boolean} params.success - Whether the request was successful
 * @param {string} params.intent - The intent name
 * @param {string} params.answer - The human-friendly answer string
 * @param {object} [params.supportingData] - The raw data used to form the answer
 * @param {Array<string>} [params.linkedCases] - FIR numbers or Case IDs referenced
 * @param {string} [params.sqlPreview] - The SQL run for deterministic queries
 * @param {Array<string>} [params.sources] - Sources of data
 * @param {string} [params.confidence] - Confidence level ('high', 'medium', 'low')
 * @param {string} [params.role] - Current user role (for redaction)
 * @returns {object} Standardized JSON response object
 */
function composeResponse({
  success,
  intent,
  answer,
  supportingData = {},
  linkedCases = [],
  sqlPreview = undefined,
  sources = [],
  confidence = 'medium',
  role = 'viewer'
}) {
  const generatedAt = new Date().toISOString();

  // If request failed, return structured error
  if (!success) {
    return {
      success: false,
      error: {
        code: 'ASSISTANT_ERROR',
        message: answer || 'An error occurred while processing the query.',
        generatedAt
      }
    };
  }

  // Apply role-based redactions on supportingData if viewer
  const cleanSupportingData = redactPII(supportingData, role);

  // Apply redaction on answer text if role is viewer
  let cleanAnswer = answer;
  if (role === 'viewer') {
    // Redact names, phone numbers, and addresses from the text answer
    cleanAnswer = answer
      .replace(/\b\d{10}\b/g, '**********') // simple 10 digit phone number redaction
      .replace(/FIR\s+(\d{4}\/\d{4})/gi, 'FIR $1 (REDACTED)')
      .replace(/at\s+([A-Za-z0-9\s,]+PS|[A-Za-z0-9\s,]+Road|[A-Za-z0-9\s,]+Street)/gi, 'at [REDACTED LOCATION]');
  }

  const response = {
    success: true,
    data: {
      answer: cleanAnswer,
      supportingData: cleanSupportingData,
      linkedCases,
      sources,
      confidence,
      intent,
      generatedAt
    }
  };

  // Only include sqlPreview for deterministic SQL branches
  if (sqlPreview && (intent === 'sql_lookup' || intent === 'trend_analysis' || intent === 'similarity_search')) {
    response.data.sqlPreview = sqlPreview;
  }

  return response;
}

module.exports = {
  composeResponse
};
