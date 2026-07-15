/**
 * database.js
 * Shared database query execution, flattening, and redaction utilities.
 */

/**
 * Flattens a Catalyst ZCQL result row.
 * Catalyst ZCQL query responses format rows grouped by table name:
 * e.g., { CaseMaster: { ROWID: '1', fir_number: '0001/2026' }, District: { district_name: 'Mysuru' } }
 * This flattens it into: { ROWID: '1', fir_number: '0001/2026', district_name: 'Mysuru' }
 * 
 * If keys overlap, the later tables overwrite the earlier ones, except if they have empty values.
 * 
 * @param {object} row - Raw ZCQL result row
 * @returns {object} Flattened row
 */
function flattenRow(row) {
  if (!row) return {};
  const flattened = {};
  for (const tableKey of Object.keys(row)) {
    if (row[tableKey] && typeof row[tableKey] === 'object' && !Array.isArray(row[tableKey])) {
      for (const colKey of Object.keys(row[tableKey])) {
        // If the key doesn't exist yet or is null/undefined, set it
        if (flattened[colKey] === undefined || flattened[colKey] === null) {
          flattened[colKey] = row[tableKey][colKey];
        } else if (row[tableKey][colKey] !== undefined && row[tableKey][colKey] !== null) {
          // If both exist, keep the existing one unless it's an ID overlap, in which case prefix or ignore
          // Typically we prefer the parent table's ROWID if there is an ambiguity, but here we just assign.
          flattened[`${tableKey}_${colKey}`] = row[tableKey][colKey];
          // Also set the raw key if not already set by a primary table
          if (flattened[colKey] === undefined) {
            flattened[colKey] = row[tableKey][colKey];
          }
        }
      }
    } else {
      flattened[tableKey] = row[tableKey];
    }
  }
  return flattened;
}

/**
 * Flattens an array of ZCQL result rows.
 * 
 * @param {Array<object>} rows - Raw ZCQL result rows
 * @returns {Array<object>} Flattened rows
 */
function flattenResults(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map(flattenRow);
}

/**
 * Executes a ZCQL query using the Catalyst App instance and returns flattened rows.
 * 
 * @param {object} app - Catalyst App instance
 * @param {string} query - ZCQL query string
 * @returns {Promise<Array<object>>} Flattened rows
 */
async function executeQuery(app, query) {
  try {
    const zcql = app.zcql();
    const rawResult = await zcql.executeZCQLQuery(query);
    return flattenResults(rawResult);
  } catch (err) {
    console.error('ZCQL query execution error:', err.message);
    console.error('Query was:', query);
    throw err;
  }
}

/**
 * Redacts sensitive fields for the 'viewer' role.
 * 
 * Viewer role is not allowed to view complainant or victim PII (like phone numbers, specific addresses, full names).
 * 
 * @param {Array<object>|object} data - Data rows or single object
 * @param {string} role - User role (e.g. viewer, investigator, analyst, admin)
 * @returns {Array<object>|object} Redacted data
 */
function redactPII(data, role) {
  if (role !== 'viewer') {
    return data;
  }

  const sensitiveFields = ['phone', 'address', 'name', 'alias_name', 'place_of_occurrence', 'summary_of_facts'];

  const redactObj = (obj) => {
    if (!obj) return obj;
    const redacted = { ...obj };
    
    // Redact standard sensitive fields
    for (const field of sensitiveFields) {
      if (redacted[field] !== undefined) {
        if (field === 'phone') {
          redacted[field] = '**********';
        } else if (field === 'name' || field === 'alias_name') {
          redacted[field] = redacted[field] ? redacted[field].charAt(0) + '***' : '***';
        } else {
          redacted[field] = '[REDACTED FOR SECURITY]';
        }
      }
    }

    // Handle nested arrays (e.g. victims, complainants in a case bundle)
    if (redacted.victims && Array.isArray(redacted.victims)) {
      redacted.victims = redacted.victims.map(v => redactObj(v));
    }
    if (redacted.complainants && Array.isArray(redacted.complainants)) {
      redacted.complainants = redacted.complainants.map(c => redactObj(c));
    }
    if (redacted.accused && Array.isArray(redacted.accused)) {
      redacted.accused = redacted.accused.map(a => redactObj(a));
    }
    return redacted;
  };

  if (Array.isArray(data)) {
    return data.map(redactObj);
  }
  return redactObj(data);
}

module.exports = {
  flattenRow,
  flattenResults,
  executeQuery,
  redactPII
};
