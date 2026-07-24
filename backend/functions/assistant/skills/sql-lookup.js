/**
 * sql-lookup.js
 * Skill module to execute safe, deterministic SQL queries against the crime database.
 * Uses slot-extractor outputs, maps them to vw_case_summary, and generates the response.
 */

const { executeQuery } = require('../../shared/database');

// Lists for strict parameter validation
const SAFE_DISTRICTS = [
  'Bengaluru Urban', 'Mysuru', 'Mangaluru', 'Hubli-Dharwad', 
  'Belagavi', 'Kalaburagi', 'Tumkur', 'Shimoga'
];

const SAFE_CATEGORIES = [
  'Murder', 'Theft', 'Robbery', 'Burglary', 'Cybercrime', 'Assault', 'Rape', 'Kidnapping'
];

/**
 * Runs the SQL Lookup skill.
 * 
 * @param {object} slots - Extracted slots from slot-extractor
 * @param {object} app - Catalyst App instance
 * @param {string} role - Current user role (for access control/redaction)
 * @returns {Promise<object>} Skill execution result
 */
async function executeSqlLookup(slots, app, role) {
  const selectFields = 'ROWID, fir_number, crime_registered_date, place_of_occurrence, summary_of_facts, district_name, category_name, status_name';
  let query = `SELECT ${selectFields} FROM vw_case_summary`;
  let countQuery = 'SELECT COUNT(ROWID) FROM vw_case_summary';
  const conditions = [];

  // 1. Validate and apply District filter
  if (slots.district) {
    if (SAFE_DISTRICTS.includes(slots.district)) {
      conditions.push(`district_name = '${slots.district}'`);
    } else {
      console.warn(`[SqlLookup] Rejected unsafe or unlisted district: ${slots.district}`);
    }
  }

  // 2. Validate and apply Category filter
  if (slots.category) {
    if (SAFE_CATEGORIES.includes(slots.category)) {
      conditions.push(`category_name = '${slots.category}'`);
    } else {
      console.warn(`[SqlLookup] Rejected unsafe or unlisted category: ${slots.category}`);
    }
  }

  // 3. Validate and apply Section filter (e.g. IPC sections)
  // Since ActSectionAssociation is a separate table, we can query it via a subquery or join.
  // ZCQL supports subqueries: e.g. "ROWID IN (SELECT case_id FROM ActSectionAssociation JOIN Section ON ...)"
  // But to keep it simple and highly performant in ZCQL, we check if section matches a clean pattern.
  if (slots.section) {
    const cleanSection = slots.section.replace(/[^0-9A-Za-z]/g, ''); // alphanumeric only
    conditions.push(`ROWID IN (SELECT case_id FROM ActSectionAssociation WHERE section_id IN (SELECT ROWID FROM Section WHERE section_number = '${cleanSection}'))`);
  }

  // 4. Validate and apply FIR Number filter
  if (slots.firNumber) {
    const cleanFir = slots.firNumber.replace(/[^0-9/]/g, ''); // digits and slashes only
    conditions.push(`fir_number = '${cleanFir}'`);
  }

  // 5. Apply Date range filter
  if (slots.dateRange && slots.dateRange.from && slots.dateRange.to) {
    // ISO date strings are inherently safe from injection
    const cleanFrom = new Date(slots.dateRange.from).toISOString();
    const cleanTo = new Date(slots.dateRange.to).toISOString();
    conditions.push(`crime_registered_date >= '${cleanFrom}'`);
    conditions.push(`crime_registered_date <= '${cleanTo}'`);
  }

  // Append conditions to queries
  if (conditions.length > 0) {
    const whereClause = ' WHERE ' + conditions.join(' AND ');
    query += whereClause;
    countQuery += whereClause;
  }

  // Enforce ordering and pagination limit (max 10 rows for assistant quick response)
  query += ' ORDER BY crime_registered_date DESC LIMIT 10';

  console.log(`[SqlLookup] Executing: ${query}`);

  try {
    // Execute both the count and the paginated list in parallel
    const [countResult, listResult] = await Promise.all([
      executeQuery(app, countQuery),
      executeQuery(app, query)
    ]);

    const totalCount = countResult[0] && (countResult[0].ROWID || countResult[0].count || countResult[0].ROWID_count) 
      ? parseInt(countResult[0].ROWID || countResult[0].count || countResult[0].ROWID_count, 10) 
      : 0;

    // Build human readable answer
    let answer = '';
    const categoryStr = slots.category ? ` ${slots.category.toLowerCase()}` : ' crime';
    const districtStr = slots.district ? ` in ${slots.district}` : '';
    const dateStr = slots.dateRange ? ` during the ${slots.dateRange.label}` : '';
    const sectionStr = slots.section ? ` under section ${slots.section}` : '';

    if (totalCount === 0) {
      answer = `No${categoryStr} cases found${districtStr}${sectionStr}${dateStr}.`;
    } else if (totalCount === 1) {
      const match = listResult[0];
      answer = `Found 1${categoryStr} case${districtStr}${sectionStr}${dateStr}: FIR ${match.fir_number} (${match.status_name}) at ${match.place_of_occurrence}.`;
    } else {
      answer = `Found ${totalCount}${categoryStr} cases${districtStr}${sectionStr}${dateStr}. Here are the most recent ones:`;
    }

    const linkedCases = listResult.map(c => c.fir_number || c.ROWID);

    return {
      success: true,
      answer,
      supportingData: {
        total: totalCount,
        items: listResult
      },
      linkedCases,
      sqlPreview: query,
      sources: ['vw_case_summary', 'ActSectionAssociation', 'Section'],
      confidence: 'high' // Deterministic calculation
    };
  } catch (err) {
    console.error('[SqlLookup] Error executing ZCQL lookup:', err.message);
    return {
      success: false,
      answer: 'Failed to look up crime data due to a database query error.',
      supportingData: { error: err.message },
      sqlPreview: query,
      sources: ['vw_case_summary'],
      confidence: 'low'
    };
  }
}

module.exports = {
  executeSqlLookup
};
