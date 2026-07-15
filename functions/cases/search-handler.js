const { getCatalystApp, flattenResults } = require('../shared/catalyst');
const { sendSuccess, sendError } = require('../shared/response');

async function searchCases(req, res) {
  try {
    const app = getCatalystApp(req);
    const query = req.query || {};

    // 1. Pagination parameters
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const offset = (page - 1) * limit;

    // 2. Filter criteria building
    const conditions = [];

    // Whitelist and safely sanitize/escape inputs to prevent SQL Injection in ZCQL
    if (query.district_id) {
      const distId = parseInt(query.district_id);
      if (!isNaN(distId)) {
        conditions.push(`district_id = ${distId}`);
      }
    }

    if (query.case_category_id) {
      const catId = parseInt(query.case_category_id);
      if (!isNaN(catId)) {
        conditions.push(`case_category_id = ${catId}`);
      }
    }

    if (query.case_status_id) {
      const statusId = parseInt(query.case_status_id);
      if (!isNaN(statusId)) {
        conditions.push(`case_status_id = ${statusId}`);
      }
    }

    if (query.gravity_offence_id) {
      const gravityId = parseInt(query.gravity_offence_id);
      if (!isNaN(gravityId)) {
        conditions.push(`gravity_offence_id = ${gravityId}`);
      }
    }

    if (query.unit_id) {
      const unitId = parseInt(query.unit_id);
      if (!isNaN(unitId)) {
        conditions.push(`unit_id = ${unitId}`);
      }
    }

    if (query.fir_status) {
      const firStatus = String(query.fir_status).replace(/'/g, "''");
      conditions.push(`fir_status = '${firStatus}'`);
    }

    if (query.date_from) {
      if (/^\d{4}-\d{2}-\d{2}/.test(query.date_from)) {
        conditions.push(`crime_registered_date >= '${query.date_from}'`);
      }
    }

    if (query.date_to) {
      if (/^\d{4}-\d{2}-\d{2}/.test(query.date_to)) {
        conditions.push(`crime_registered_date <= '${query.date_to}'`);
      }
    }

    // Keyword search against fir_number, summary_of_facts, or place_of_occurrence
    if (query.search || query.q) {
      const searchVal = String(query.search || query.q).replace(/'/g, "''");
      conditions.push(`(fir_number LIKE '%${searchVal}%' OR summary_of_facts LIKE '%${searchVal}%' OR place_of_occurrence LIKE '%${searchVal}%')`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 3. Execute ZCQL queries
    // Target vw_case_summary view for fast read-optimized responses. Fallback if it does not exist.
    const itemsQuery = `SELECT * FROM vw_case_summary ${whereClause} LIMIT ${limit} OFFSET ${offset}`;
    const countQuery = `SELECT COUNT(ROWID) FROM vw_case_summary ${whereClause}`;

    let items = [];
    let total = 0;

    try {
      const [itemsRaw, countRaw] = await Promise.all([
        app.zcql().executeZCQLQuery(itemsQuery),
        app.zcql().executeZCQLQuery(countQuery)
      ]);

      items = flattenResults(itemsRaw);
      
      if (countRaw && countRaw.length > 0) {
        const countObj = countRaw[0];
        const inner = countObj[Object.keys(countObj)[0]];
        total = parseInt(inner[Object.keys(inner)[0]]) || 0;
      }
    } catch (viewError) {
      console.warn('vw_case_summary query failed, falling back to direct CaseMaster join queries:', viewError.message || viewError);
      
      // Fallback query joining main tables directly
      const fallbackItemsQuery = `SELECT CaseMaster.ROWID, CaseMaster.fir_number, CaseMaster.crime_registered_date, CaseMaster.place_of_occurrence, CaseMaster.summary_of_facts, CaseMaster.fir_status, District.district_name, CaseCategory.category_name, CaseStatusMaster.status_name, GravityOffence.gravity_name FROM CaseMaster LEFT JOIN District ON CaseMaster.district_id = District.ROWID LEFT JOIN CaseCategory ON CaseMaster.case_category_id = CaseCategory.ROWID LEFT JOIN CaseStatusMaster ON CaseMaster.case_status_id = CaseStatusMaster.ROWID LEFT JOIN GravityOffence ON CaseMaster.gravity_offence_id = GravityOffence.ROWID ${whereClause} LIMIT ${limit} OFFSET ${offset}`;
      const fallbackCountQuery = `SELECT COUNT(ROWID) FROM CaseMaster ${whereClause}`;

      const [itemsRaw, countRaw] = await Promise.all([
        app.zcql().executeZCQLQuery(fallbackItemsQuery),
        app.zcql().executeZCQLQuery(fallbackCountQuery)
      ]);

      items = flattenResults(itemsRaw);

      if (countRaw && countRaw.length > 0) {
        const countObj = countRaw[0];
        const inner = countObj[Object.keys(countObj)[0]];
        total = parseInt(inner[Object.keys(inner)[0]]) || 0;
      }
    }

    return sendSuccess(res, {
      total,
      items,
      page,
      limit,
      filters: {
        district_id: query.district_id ? parseInt(query.district_id) : null,
        case_category_id: query.case_category_id ? parseInt(query.case_category_id) : null,
        case_status_id: query.case_status_id ? parseInt(query.case_status_id) : null,
        gravity_offence_id: query.gravity_offence_id ? parseInt(query.gravity_offence_id) : null,
        date_from: query.date_from || null,
        date_to: query.date_to || null,
        search: query.search || query.q || null
      }
    }, {
      generatedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('Search cases error:', err);
    return sendError(res, 'DB_ERROR', err.message || 'Error querying cases datastore.', 500);
  }
}

module.exports = {
  searchCases
};
