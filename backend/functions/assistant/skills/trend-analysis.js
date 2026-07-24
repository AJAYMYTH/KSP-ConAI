/**
 * trend-analysis.js
 * Skill module to analyze and calculate crime trends over time.
 * Fetches data and performs aggregation, delta, and percentage calculations in-memory.
 */

const { executeQuery } = require('../../shared/database');

// Lists for validation
const SAFE_DISTRICTS = [
  'Bengaluru Urban', 'Mysuru', 'Mangaluru', 'Hubli-Dharwad', 
  'Belagavi', 'Kalaburagi', 'Tumkur', 'Shimoga'
];

const SAFE_CATEGORIES = [
  'Murder', 'Theft', 'Robbery', 'Burglary', 'Cybercrime', 'Assault', 'Rape', 'Kidnapping'
];

/**
 * Computes crime trends based on extracted slots.
 * 
 * @param {object} slots - Extracted slots from slot-extractor
 * @param {object} app - Catalyst App instance
 * @returns {Promise<object>} Skill execution result
 */
async function executeTrendAnalysis(slots, app) {
  let query = 'SELECT ROWID, crime_registered_date, category_name, district_name FROM vw_case_summary';
  const conditions = [];

  // 1. District Filter
  if (slots.district) {
    if (SAFE_DISTRICTS.includes(slots.district)) {
      conditions.push(`district_name = '${slots.district}'`);
    }
  }

  // 2. Category Filter
  if (slots.category) {
    if (SAFE_CATEGORIES.includes(slots.category)) {
      conditions.push(`category_name = '${slots.category}'`);
    }
  }

  // 3. Date range filter - default to last 12 months if not specified
  let fromDate = new Date();
  fromDate.setFullYear(fromDate.getFullYear() - 1); // 1 year ago
  let toDate = new Date();

  if (slots.dateRange && slots.dateRange.from && slots.dateRange.to) {
    fromDate = new Date(slots.dateRange.from);
    toDate = new Date(slots.dateRange.to);
  }

  conditions.push(`crime_registered_date >= '${fromDate.toISOString()}'`);
  conditions.push(`crime_registered_date <= '${toDate.toISOString()}'`);

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY crime_registered_date ASC';

  console.log(`[TrendAnalysis] Querying: ${query}`);

  try {
    const cases = await executeQuery(app, query);

    // Group cases by month in memory (format: YYYY-MM)
    const monthlyCounts = {};
    
    // Initialize months in range to avoid gaps
    const tempDate = new Date(fromDate);
    while (tempDate <= toDate) {
      const monthKey = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, '0')}`;
      monthlyCounts[monthKey] = 0;
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    // Aggregate counts
    cases.forEach(c => {
      if (c.crime_registered_date) {
        const dateObj = new Date(c.crime_registered_date);
        const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
        // Only increment if monthKey exists in our initialized keys
        if (monthlyCounts[monthKey] !== undefined) {
          monthlyCounts[monthKey]++;
        } else {
          monthlyCounts[monthKey] = 1;
        }
      }
    });

    // Format into chart series (labels + counts)
    const sortedMonths = Object.keys(monthlyCounts).sort();
    const series = sortedMonths.map(month => ({
      month,
      count: monthlyCounts[month]
    }));

    // Calculate delta between latest two months
    let deltaText = '';
    let percentageChange = 0;
    let trendDirection = 'stable';

    if (series.length >= 2) {
      const current = series[series.length - 1].count;
      const previous = series[series.length - 2].count;
      
      const currentMonthName = series[series.length - 1].month;
      const previousMonthName = series[series.length - 2].month;

      if (previous > 0) {
        percentageChange = Math.round(((current - previous) / previous) * 100);
      } else {
        percentageChange = current > 0 ? 100 : 0;
      }

      if (current > previous) {
        trendDirection = 'rising';
        deltaText = `showed an increase of ${percentageChange}% (${current} cases in ${currentMonthName} vs ${previous} cases in ${previousMonthName})`;
      } else if (current < previous) {
        trendDirection = 'falling';
        deltaText = `showed a decrease of ${Math.abs(percentageChange)}% (${current} cases in ${currentMonthName} vs ${previous} cases in ${previousMonthName})`;
      } else {
        trendDirection = 'stable';
        deltaText = `remained stable at ${current} cases in ${currentMonthName} (matching ${previousMonthName})`;
      }
    } else {
      deltaText = 'insufficient historical data to calculate monthly delta';
    }

    const categoryStr = slots.category ? slots.category : 'Crime';
    const districtStr = slots.district ? ` in ${slots.district}` : '';
    const answer = `${categoryStr} cases${districtStr} ${deltaText}.`;

    return {
      success: true,
      answer,
      supportingData: {
        trendDirection,
        percentageChange,
        series,
        totalCasesAnalyzed: cases.length
      },
      linkedCases: [],
      sqlPreview: query,
      sources: ['vw_case_summary'],
      confidence: 'high'
    };
  } catch (err) {
    console.error('[TrendAnalysis] Error analyzing trends:', err.message);
    return {
      success: false,
      answer: 'Failed to compute trend parameters due to a data error.',
      supportingData: { error: err.message },
      sqlPreview: query,
      sources: ['vw_case_summary'],
      confidence: 'low'
    };
  }
}

module.exports = {
  executeTrendAnalysis
};
