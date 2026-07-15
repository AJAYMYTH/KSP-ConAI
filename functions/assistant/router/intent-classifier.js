/**
 * intent-classifier.js
 * Implements two-tier intent classification:
 * - Tier 1: Rule-based regex and keyword matching (instant, no cost).
 * - Tier 2: QuickML endpoint prediction (ML model fallback) with graceful fallback.
 */

const { intents } = require('./intent-table');

/**
 * Classifies the intent of a user's natural language query.
 * 
 * @param {string} text - User query text
 * @param {object} app - Catalyst App instance
 * @returns {Promise<{ intent: string, confidence: string }>} Classified intent and confidence level
 */
async function classifyIntent(text, app) {
  if (!text || typeof text !== 'string') {
    return { intent: 'clarify', confidence: 'low' };
  }

  const query = text.trim();

  // --- Tier 1: Lexical match (rules & keywords) ---
  for (const [intentName, config] of Object.entries(intents)) {
    // Check regex rules
    for (const rule of config.rules) {
      if (rule.test(query)) {
        console.log(`[IntentClassifier] Tier 1 match found: ${intentName} via regex ${rule}`);
        return { intent: intentName, confidence: 'high' };
      }
    }

    // Check keyword presence
    let keywordHits = 0;
    for (const keyword of config.keywords) {
      if (query.toLowerCase().includes(keyword)) {
        keywordHits++;
      }
    }
    
    // If we get multiple keyword hits, classify with medium confidence
    if (keywordHits >= 2) {
      console.log(`[IntentClassifier] Tier 1 match found: ${intentName} via keywords (hits: ${keywordHits})`);
      return { intent: intentName, confidence: 'medium' };
    }
  }

  // --- Tier 2: QuickML Fallback ---
  const endpointKey = process.env.QUICKML_INTENT_CLASSIFIER_KEY;
  if (endpointKey && app) {
    try {
      console.log('[IntentClassifier] Tier 1 match inconclusive. Invoking Tier 2 QuickML...');
      const quickML = app.quickML();
      const response = await quickML.predict(endpointKey, { text: query });
      
      // Assume the QuickML response contains predicted class and confidence
      // E.g., response = { success: true, data: { class: 'sql_lookup', score: 0.85 } }
      if (response && response.success && response.data) {
        const predictedIntent = response.data.class;
        const score = response.data.score || 0.0;
        
        if (intents[predictedIntent] && score > 0.5) {
          const confidence = score > 0.8 ? 'high' : 'medium';
          console.log(`[IntentClassifier] Tier 2 match found: ${predictedIntent} (score: ${score})`);
          return { intent: predictedIntent, confidence };
        }
      }
    } catch (err) {
      console.error('[IntentClassifier] QuickML Tier 2 classification failed:', err.message);
    }
  } else {
    console.log('[IntentClassifier] QuickML endpoint key not configured. Skipping Tier 2.');
  }

  // --- Heuristic Fallback if Tier 1 and Tier 2 both yield no result ---
  // Look for case IDs (e.g. "0001/2026" or "KA-...") and "summarize"
  const hasCaseIdPattern = /\b\d{4}\/\d{4}\b|\b[A-Za-z]{2}-\d{2}-\d{4}-\d+\b/i.test(query);
  if (hasCaseIdPattern) {
    if (query.toLowerCase().includes('similar') || query.toLowerCase().includes('match')) {
      return { intent: 'similarity_search', confidence: 'medium' };
    }
    return { intent: 'case_summary', confidence: 'medium' };
  }

  // Check for common SQL triggers
  if (/\b(district|station|year|category|fir)\b/i.test(query)) {
    return { intent: 'sql_lookup', confidence: 'low' };
  }

  console.log('[IntentClassifier] No matching intent found. Falling back to clarify.');
  return { intent: 'clarify', confidence: 'low' };
}

module.exports = {
  classifyIntent
};
