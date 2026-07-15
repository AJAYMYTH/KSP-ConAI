const { getCatalystApp, flattenResults } = require('../shared/catalyst');
const { sendSuccess, sendError } = require('../shared/response');

async function getDashboardSummary(req, res) {
  try {
    const app = getCatalystApp(req);

    // Define dashboard aggregation queries
    const queries = {
      statusCounts: `SELECT CaseStatusMaster.status_name, COUNT(CaseMaster.ROWID) AS status_count FROM CaseMaster LEFT JOIN CaseStatusMaster ON CaseMaster.case_status_id = CaseStatusMaster.ROWID GROUP BY CaseStatusMaster.status_name`,
      repeatOffenders: `SELECT COUNT(ROWID) FROM vw_repeat_offenders`,
      topDistricts: `SELECT District.district_name, COUNT(CaseMaster.ROWID) AS case_count FROM CaseMaster LEFT JOIN District ON CaseMaster.district_id = District.ROWID GROUP BY District.district_name`,
      recentCases: `SELECT CaseMaster.ROWID, CaseMaster.fir_number, CaseMaster.crime_registered_date, District.district_name, CaseCategory.category_name, CaseStatusMaster.status_name FROM CaseMaster LEFT JOIN District ON CaseMaster.district_id = District.ROWID LEFT JOIN CaseCategory ON CaseMaster.case_category_id = CaseCategory.ROWID LEFT JOIN CaseStatusMaster ON CaseMaster.case_status_id = CaseStatusMaster.ROWID ORDER BY CaseMaster.crime_registered_date DESC LIMIT 5`
    };

    // Execute queries in parallel to optimize latency
    const keys = Object.keys(queries);
    const promises = keys.map(k => app.zcql().executeZCQLQuery(queries[k]).catch(err => {
      console.warn(`Dashboard query ${k} failed:`, err.message || err);
      return [];
    }));

    const rawResults = await Promise.all(promises);

    const resolvedData = {};
    keys.forEach((k, idx) => {
      resolvedData[k] = flattenResults(rawResults[idx]);
    });

    // 1. Process Status Counts for Totals
    let totalFIRs = 0;
    let activeCases = 0;
    let chargesheetedCases = 0;

    const statusCounts = resolvedData.statusCounts || [];
    statusCounts.forEach(item => {
      const count = parseInt(item.status_count) || 0;
      totalFIRs += count;
      
      const status = String(item.status_name || '').toLowerCase();
      if (status === 'chargesheeted') {
        chargesheetedCases += count;
      } else if (
        status === 'registered' || 
        status === 'under investigation' || 
        status === 'investigating' || 
        status === 'active'
      ) {
        activeCases += count;
      }
    });

    // 2. Process Repeat Offenders Count (with fallback if view is missing or returns 0)
    let repeatOffenders = 0;
    const roList = resolvedData.repeatOffenders || [];
    if (roList.length > 0) {
      const firstRow = roList[0];
      repeatOffenders = parseInt(firstRow[Object.keys(firstRow)[0]]) || 0;
    }

    if (repeatOffenders === 0) {
      // Fallback: Group by system_accused_id on Accused table and count repeat cases
      try {
        const fallbackRo = await app.zcql().executeZCQLQuery(
          `SELECT system_accused_id, COUNT(ROWID) AS case_count FROM Accused GROUP BY system_accused_id`
        );
        const flattenedRo = flattenResults(fallbackRo);
        repeatOffenders = flattenedRo.filter(acc => (parseInt(acc.case_count) || 0) >= 2).length;
      } catch (fallbackErr) {
        console.warn('Fallback repeat offenders query failed:', fallbackErr.message || fallbackErr);
      }
    }

    // 3. Process Top Districts
    const topDistricts = (resolvedData.topDistricts || [])
      .map(item => ({
        district_name: item.district_name || 'Unknown',
        case_count: parseInt(item.case_count) || 0
      }))
      .sort((a, b) => b.case_count - a.case_count)
      .slice(0, 5);

    // 4. Process Recent Cases
    const recentCases = (resolvedData.recentCases || []).map(item => ({
      ROWID: item.ROWID,
      fir_number: item.fir_number,
      crime_registered_date: item.crime_registered_date,
      district_name: item.district_name || 'Unknown',
      category_name: item.category_name || 'Unknown',
      status_name: item.status_name || 'Unknown'
    }));

    return sendSuccess(res, {
      totals: {
        totalFIRs,
        activeCases,
        chargesheetedCases,
        repeatOffenders
      },
      topDistricts,
      recentCases
    }, {
      generatedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('Dashboard summary error:', err);
    return sendError(res, 'DB_ERROR', err.message || 'Error compiling dashboard summary.', 500);
  }
}

module.exports = {
  getDashboardSummary
};
