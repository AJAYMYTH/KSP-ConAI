const { getCatalystApp, flattenResults } = require('../shared/catalyst');
const { sendSuccess, sendError } = require('../shared/response');

async function getOffenderProfile(req, res) {
  try {
    const app = getCatalystApp(req);
    const searchVal = (req.query.search || req.query.name || '').toLowerCase().trim();

    // Query accused along with case details (uses 2 joins, well below 4-join limit)
    const query = `
      SELECT 
        A.system_accused_id, 
        A.name, 
        A.age, 
        A.gender, 
        A.address, 
        A.status, 
        CaseMaster.ROWID, 
        CaseMaster.fir_number, 
        CaseCategory.category_name 
      FROM Accused A 
      LEFT JOIN CaseMaster ON A.case_id = CaseMaster.ROWID 
      LEFT JOIN CaseCategory ON CaseMaster.case_category_id = CaseCategory.ROWID
    `;

    const rawData = await app.zcql().executeZCQLQuery(query);
    const list = flattenResults(rawData);

    // Group by system_accused_id in Node.js
    const offenderMap = {};
    list.forEach(item => {
      const id = item.system_accused_id;
      if (!id) return;

      if (!offenderMap[id]) {
        offenderMap[id] = {
          system_accused_id: id,
          name: item.name,
          age: item.age,
          gender: item.gender,
          address: item.address,
          current_status: item.status,
          crime_count: 0,
          cases: [],
          categories: new Set()
        };
      }

      const profile = offenderMap[id];
      profile.crime_count++;
      
      if (item.fir_number) {
        profile.cases.push({
          case_id: item.ROWID,
          fir_number: item.fir_number,
          category_name: item.category_name
        });
      }
      
      if (item.category_name) {
        profile.categories.add(item.category_name);
      }
      
      // Keep status updated (if multiple, prefer the active status)
      if (item.status && item.status !== 'Unknown') {
        profile.current_status = item.status;
      }
    });

    // Convert map to list and compute behavioral insights
    let offenders = Object.values(offenderMap).map(profile => {
      const categoriesArray = Array.from(profile.categories);
      
      // Determine primary threat index (higher crime count = higher threat)
      let riskLevel = "Low";
      if (profile.crime_count >= 4) riskLevel = "Critical (Repeat Offender)";
      else if (profile.crime_count >= 2) riskLevel = "Medium";

      return {
        system_accused_id: profile.system_accused_id,
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        address: profile.address,
        current_status: profile.current_status || 'Under Investigation',
        crime_count: profile.crime_count,
        risk_level: riskLevel,
        modus_operandi_tags: categoriesArray,
        cases: profile.cases,
        behavioral_insights: `Offender shows repeat behavior in ${categoriesArray.join(' and ')} categories. Associated with ${profile.cases.length} active police investigations.`
      };
    });

    // Filter by search name if query is provided
    if (searchVal) {
      offenders = offenders.filter(o => 
        o.name.toLowerCase().includes(searchVal) || 
        o.system_accused_id.toLowerCase().includes(searchVal)
      );
    }

    // Sort by crime count descending to place repeat offenders at the top
    offenders.sort((a, b) => b.crime_count - a.crime_count);

    return sendSuccess(res, offenders);
  } catch (err) {
    console.error('Error fetching offender profile:', err);
    return sendError(res, 'DB_ERROR', err.message || 'Error executing offender profile query.', 500);
  }
}

module.exports = {
  getOffenderProfile
};
