const catalyst = require('zcatalyst-sdk-node');

function getCatalystApp(req) {
  if (req) {
    return catalyst.initialize(req);
  }
  return catalyst.initialize();
}

function escapeString(val) {
  if (val === undefined || val === null) {
    return '';
  }
  if (typeof val !== 'string') {
    return String(val);
  }
  return val.replace(/'/g, "\\'");
}

async function executeQuery(req, queryStr) {
  const app = getCatalystApp(req);
  const zcql = app.zcql();
  return await zcql.executeZCQLQuery(queryStr);
}

module.exports = {
  getCatalystApp,
  escapeString,
  executeQuery
};
