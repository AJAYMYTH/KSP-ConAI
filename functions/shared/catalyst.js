const catalyst = require('zcatalyst-sdk-node');

function getCatalystApp(req) {
  if (req) {
    return catalyst.initialize(req);
  }
  // Fallback for local seeding or CLI scripts
  if (process.env.CATALYST_PROJECT_ID && process.env.CATALYST_PROJECT_KEY) {
    return catalyst.initialize({
      project_id: process.env.CATALYST_PROJECT_ID,
      project_key: process.env.CATALYST_PROJECT_KEY,
      environment: process.env.CATALYST_ENVIRONMENT || 'development'
    });
  }
  return catalyst.initialize();
}

function flattenResults(results) {
  if (!results || !Array.isArray(results)) return [];
  return results.map(row => {
    const keys = Object.keys(row);
    if (keys.length === 1) {
      const tableData = row[keys[0]];
      // If tableData is a primitive or doesn't exist, return it
      if (typeof tableData !== 'object' || tableData === null) return tableData;
      return { ROWID: tableData.ROWID, ...tableData };
    }
    const merged = {};
    keys.forEach(k => {
      if (row[k] && typeof row[k] === 'object') {
        // Namespace or merge: we will merge but preserve prefix or keep keys
        // For simple joins, we merge fields directly.
        Object.assign(merged, row[k]);
      }
    });
    return merged;
  });
}

module.exports = {
  getCatalystApp,
  catalyst,
  flattenResults
};

