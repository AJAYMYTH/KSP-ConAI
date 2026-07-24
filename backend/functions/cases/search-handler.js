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

    // Numeric ID filters
    if (query.district_id) {
      const distId = String(query.district_id);
      if (/^\d+$/.test(distId)) {
        conditions.push(`district_id = ${distId}`);
      }
    } else if (query.district && query.district !== 'all') {
      const distName = String(query.district).replace(/'/g, "''");
      conditions.push(`district_name LIKE '%${distName}%'`);
    }

    if (query.case_category_id) {
      const catId = String(query.case_category_id);
      if (/^\d+$/.test(catId)) {
        conditions.push(`case_category_id = ${catId}`);
      }
    } else if (query.category && query.category !== 'all') {
      const catName = String(query.category).replace(/'/g, "''");
      conditions.push(`category_name LIKE '%${catName}%'`);
    }

    if (query.case_status_id) {
      const statusId = String(query.case_status_id);
      if (/^\d+$/.test(statusId)) {
        conditions.push(`case_status_id = ${statusId}`);
      }
    } else if (query.status && query.status !== 'all') {
      const statusName = String(query.status).replace(/'/g, "''");
      conditions.push(`status_name LIKE '%${statusName}%'`);
    }

    if (query.gravity_offence_id) {
      const gravityId = String(query.gravity_offence_id);
      if (/^\d+$/.test(gravityId)) {
        conditions.push(`gravity_offence_id = ${gravityId}`);
      }
    }

    if (query.unit_id) {
      const unitId = String(query.unit_id);
      if (/^\d+$/.test(unitId)) {
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
      cases: items,
      total,
      items,
      page,
      limit,
      filters: {
        district: query.district || query.district_id || null,
        category: query.category || query.case_category_id || null,
        status: query.status || query.case_status_id || null,
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
