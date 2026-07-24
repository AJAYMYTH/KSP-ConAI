/**
 * guardrails.js
 * Domain Boundary Guardrail module for KSP Crime Intelligence Copilot.
 * Ensures the assistant ONLY handles police intelligence, case management,
 * FIR inquiries, crime trends, anomaly detection, fraud detection, and acts/sections.
 * Strictly rejects off-topic queries (e.g., quotes, poetry, jokes, generic programming, recipes).
 */

// List of allowed domain keywords/patterns
const ALLOWED_DOMAIN_PATTERNS = [
  /fir/i, /case/i, /crime/i, /police/i, /accused/i, /suspect/i, /victim/i, /complainant/i,
  /anomaly/i, /anomalies/i, /fraud/i, /phishing/i, /cybercrime/i, /scam/i, /theft/i, /robbery/i,
  /murder/i, /assault/i, /ipc/i, /bns/i, /section/i, /act/i, /chargesheet/i, /arrest/i,
  /bengaluru/i, /mysuru/i, /hubballi/i, /mangaluru/i, /karnataka/i, /station/i, /district/i,
  /trend/i, /hotspot/i, /summary/i, /summarize/i, /investigation/i, /modus operandi/i, /mo\b/i
];

// List of explicitly blocked off-topic keywords/patterns
const BLOCKED_OFFTOPIC_PATTERNS = [
  /\bwrite (a )?(quote|poem|story|song|essay|letter|joke|code|script|blog|email)\b/i,
  /\btell me a (joke|story|quote|riddle|fact)\b/i,
  /\brecipe\b/i, /\bcook\b/i, /\bweather\b/i, /\bmovie\b/i, /\bsport\b/i, /\bcricket\b/i,
  /\bwho (is|was) (the president|prime minister|actor|actress|singer)\b/i,
  /\bhow to (code|build a app|make money|lose weight)\b/i,
  /\bquantum\b/i, /\bhoroscope\b/i, /\bmeaning of life\b/i
];

const REFUSAL_MESSAGE = 
  "Access Restricted: The KSP Copilot is strictly designed for police case inquiries, FIR analysis, anomaly detection, fraud detection, and database-grounded crime intelligence.\n\n" +
  "Off-topic requests (such as writing quotes, poems, recipes, creative writing, or general trivia) are not supported.";

/**
 * Checks whether a user query falls within the allowed police intelligence domain.
 * 
 * @param {string} text - Raw user input query string
 * @returns {{ allowed: boolean, refusalMessage?: string, reason?: string }}
 */
function checkDomainBoundary(text) {
  if (!text || typeof text !== 'string') {
    return { allowed: false, refusalMessage: "Invalid input query.", reason: "empty_query" };
  }

  const query = text.trim();

  // 1. Explicit Off-Topic Check
  for (const pattern of BLOCKED_OFFTOPIC_PATTERNS) {
    if (pattern.test(query)) {
      console.warn(`[Guardrails] Out-of-domain query blocked via rule: ${pattern}`);
      return {
        allowed: false,
        refusalMessage: REFUSAL_MESSAGE,
        reason: 'explicit_offtopic'
      };
    }
  }

  // 2. Allowed Domain Match Check
  const hasDomainKeyword = ALLOWED_DOMAIN_PATTERNS.some(pattern => pattern.test(query));
  
  // If query is short or generic without any police domain keyword, check intent relevance
  if (!hasDomainKeyword) {
    // Check if query looks like an FIR number (e.g. 0001/2026 or KA-2026-01) or standard database lookup
    const isFirNumber = /\b\d{4}\/\d{4}\b|\b[A-Za-z]{2}-\d{2}-\d{4}-\d+\b/i.test(query);
    const isCountLookup = /\b(how many|list|count|show|number of|total)\b/i.test(query);

    if (!isFirNumber && !isCountLookup) {
      console.warn(`[Guardrails] Query lacks police/case domain context: "${query}"`);
      return {
        allowed: false,
        refusalMessage: REFUSAL_MESSAGE,
        reason: 'no_domain_keywords'
      };
    }
  }

  return { allowed: true };
}

module.exports = {
  checkDomainBoundary,
  REFUSAL_MESSAGE
};
