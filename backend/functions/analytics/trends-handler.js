const { getCatalystApp, flattenResults } = require('../shared/catalyst');
const { sendSuccess, sendError } = require('../shared/response');

async function getTrends(req, res) {
  try {
    const app = getCatalystApp(req);
    const query = req.query || {};

    // 1. Build Filter Conditions based on parameters
    const conditions = [];
    if (query.district_id) {
      const distId = String(query.district_id);
      if (/^\d+$/.test(distId)) {
        conditions.push(`CaseMaster.district_id = ${distId}`);
      }
    }
    if (query.case_category_id) {
      const catId = String(query.case_category_id);
      if (/^\d+$/.test(catId)) {
        conditions.push(`CaseMaster.case_category_id = ${catId}`);
      }
    }
    if (query.date_from) {
      if (/^\d{4}-\d{2}-\d{2}/.test(query.date_from)) {
        conditions.push(`CaseMaster.crime_registered_date >= '${query.date_from}'`);
      }
    }
    if (query.date_to) {
      if (/^\d{4}-\d{2}-\d{2}/.test(query.date_to)) {
        conditions.push(`CaseMaster.crime_registered_date <= '${query.date_to}'`);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 2. Fetch cases with joined lookup values
    const sqlQuery = `SELECT CaseMaster.crime_registered_date, CaseCategory.category_name, CaseStatusMaster.status_name, District.district_name, GravityOffence.gravity_name FROM CaseMaster LEFT JOIN District ON CaseMaster.district_id = District.ROWID LEFT JOIN CaseCategory ON CaseMaster.case_category_id = CaseCategory.ROWID LEFT JOIN CaseStatusMaster ON CaseMaster.case_status_id = CaseStatusMaster.ROWID LEFT JOIN GravityOffence ON CaseMaster.gravity_offence_id = GravityOffence.ROWID ${whereClause}`;

    const rawData = await app.zcql().executeZCQLQuery(sqlQuery);
    const cases = flattenResults(rawData);

    // 3. Aggregate data points in JS memory (bypassing platform limits on complex SQL formatting)
    const monthlyCounts = {};
    const categoryCounts = {};
    const statusCounts = {};
    const districtCounts = {};
    const gravityCounts = {};

    cases.forEach(c => {
      // Monthly aggregate (extract "YYYY-MM")
      if (c.crime_registered_date) {
        const month = String(c.crime_registered_date).substring(0, 7);
        if (/^\d{4}-\d{2}$/.test(month)) {
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        }
      }

      // Case Category aggregate
      const cat = c.category_name || 'Unknown';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      // Status aggregate
      const stat = c.status_name || 'Unknown';
      statusCounts[stat] = (statusCounts[stat] || 0) + 1;

      // District aggregate
      const dist = c.district_name || 'Unknown';
      districtCounts[dist] = (districtCounts[dist] || 0) + 1;

      // Gravity aggregate
      const grav = c.gravity_name || 'Unknown';
      gravityCounts[grav] = (gravityCounts[grav] || 0) + 1;
    });

    // 4. Pre-shape aggregated data for easy chart usage (labels & series layout)
    
    // Monthly Trend
    const sortedMonths = Object.keys(monthlyCounts).sort();
    const monthlyTrend = {
      labels: sortedMonths,
      series: [
        {
          name: 'FIRs Registered',
          data: sortedMonths.map(m => monthlyCounts[m])
        }
      ]
    };

    // Case Category Distribution
    const sortedCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);
    const categoryDistribution = {
      labels: sortedCategories,
      series: sortedCategories.map(cat => categoryCounts[cat])
    };

    // Status Distribution
    const sortedStatuses = Object.keys(statusCounts).sort((a, b) => statusCounts[b] - statusCounts[a]);
    const statusDistribution = {
      labels: sortedStatuses,
      series: sortedStatuses.map(stat => statusCounts[stat])
    };

    // District Distribution
    const sortedDistricts = Object.keys(districtCounts).sort((a, b) => districtCounts[b] - districtCounts[a]);
    const districtDistribution = {
      labels: sortedDistricts,
      series: sortedDistricts.map(dist => districtCounts[dist])
    };

    // Gravity Distribution
    const sortedGravity = Object.keys(gravityCounts).sort((a, b) => gravityCounts[b] - gravityCounts[a]);
    const gravityDistribution = {
      labels: sortedGravity,
      series: sortedGravity.map(grav => gravityCounts[grav])
    };

    // 5. Select response payload based on the requested metric
    const metricType = String(query.metric || 'all').toLowerCase();
    let data = {};

    if (metricType === 'monthly') {
      data = { monthlyTrend };
    } else if (metricType === 'category') {
      data = { categoryDistribution };
    } else if (metricType === 'status') {
      data = { statusDistribution };
    } else if (metricType === 'district') {
      data = { districtDistribution };
    } else if (metricType === 'gravity') {
      data = { gravityDistribution };
    } else {
      data = {
        monthlyTrend,
        categoryDistribution,
        statusDistribution,
        districtDistribution,
        gravityDistribution
      };
    }

    return sendSuccess(res, data, {
      generatedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('Analytics trends error:', err);
    return sendError(res, 'DB_ERROR', err.message || 'Error generating analytics trends.', 500);
  }
}

module.exports = {
  getTrends
};
