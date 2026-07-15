/**
 * slot-extractor.js
 * Extracts structured parameters (slots) from natural language queries deterministically.
 * Supports districts, acts, sections, case IDs (FIR numbers), case categories, and date ranges.
 */

// List of known districts from seed data
const DISTRICTS = [
  'Bengaluru Urban', 'Mysuru', 'Mangaluru', 'Hubli-Dharwad', 
  'Belagavi', 'Kalaburagi', 'Tumkur', 'Shimoga'
];

// List of known categories from seed data
const CATEGORIES = [
  'Murder', 'Theft', 'Robbery', 'Burglary', 'Cybercrime', 'Assault', 'Rape', 'Kidnapping'
];

/**
 * Extracts parameters from query text.
 * 
 * @param {string} text - User query text
 * @returns {object} Extracted slots
 */
function extractSlots(text) {
  if (!text || typeof text !== 'string') {
    return {};
  }

  const query = text.toLowerCase();
  const slots = {};

  // 1. Extract District
  for (const district of DISTRICTS) {
    if (query.includes(district.toLowerCase())) {
      slots.district = district;
      break;
    }
  }

  // 2. Extract Case Category
  for (const category of CATEGORIES) {
    if (query.includes(category.toLowerCase())) {
      slots.category = category;
      break;
    }
  }

  // Special category alias mappings
  if (!slots.category) {
    if (query.includes('cyber') || query.includes('online scam') || query.includes('social media')) {
      slots.category = 'Cybercrime';
    } else if (query.includes('steal') || query.includes('rob') || query.includes('robbed')) {
      slots.category = 'Robbery';
    } else if (query.includes('killed') || query.includes('homicide')) {
      slots.category = 'Murder';
    }
  }

  // 3. Extract Case ID (FIR Number)
  // Standard format: e.g. "0001/2026" or "0012/2024"
  const firMatch = text.match(/\b\d{1,4}\/\d{4}\b/);
  if (firMatch) {
    slots.firNumber = firMatch[0];
  }

  // 4. Extract Act & Section
  // E.g., "Section 379", "sec 302", "IPC 379"
  const sectionMatch = text.match(/(?:section|sec|u\/s|under section)\s*(\d+[A-Za-z]?)/i);
  if (sectionMatch) {
    slots.section = sectionMatch[1];
  } else {
    // Look for isolated numbers that are likely section numbers
    const isolatedNumberMatch = text.match(/\b(302|379|392|420|324|354|376|498A)\b/i);
    if (isolatedNumberMatch) {
      slots.section = isolatedNumberMatch[0];
    }
  }

  if (query.includes('ipc') || query.includes('indian penal code')) {
    slots.act = 'IPC 1860';
  } else if (query.includes('it act') || query.includes('information technology')) {
    slots.act = 'Information Technology Act';
  } else if (query.includes('karnataka police act') || query.includes('kpa')) {
    slots.act = 'Karnataka Police Act';
  }

  // 5. Extract Date Range (incident date filters)
  const now = new Date();
  
  if (query.includes('last week') || query.includes('past week')) {
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - 7);
    slots.dateRange = { from: fromDate.toISOString(), to: now.toISOString(), label: 'last week' };
  } else if (query.includes('last month') || query.includes('past month')) {
    const fromDate = new Date();
    fromDate.setMonth(now.getMonth() - 1);
    slots.dateRange = { from: fromDate.toISOString(), to: now.toISOString(), label: 'last month' };
  } else if (query.includes('last year') || query.includes('past year')) {
    const fromDate = new Date();
    fromDate.setFullYear(now.getFullYear() - 1);
    slots.dateRange = { from: fromDate.toISOString(), to: now.toISOString(), label: 'last year' };
  } else if (query.includes('today')) {
    const fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);
    slots.dateRange = { from: fromDate.toISOString(), to: now.toISOString(), label: 'today' };
  } else {
    // Look for specific years
    const yearMatch = text.match(/\b(202[0-9])\b/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1], 10);
      const fromDate = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
      const toDate = new Date(Date.UTC(year, 11, 31, 23, 59, 59));
      slots.dateRange = { from: fromDate.toISOString(), to: toDate.toISOString(), label: `year ${year}` };
    }
  }

  return slots;
}

module.exports = {
  extractSlots
};
