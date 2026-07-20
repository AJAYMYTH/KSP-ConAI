const { getCatalystApp, flattenResults } = require('../shared/catalyst');
const { sendSuccess, sendError } = require('../shared/response');

async function getDemographics(req, res) {
  try {
    const app = getCatalystApp(req);
    const entity = (req.query.entity || 'accused').toLowerCase().trim();

    let query = '';
    let tableName = '';

    if (entity === 'accused') {
      tableName = 'Accused';
      query = `SELECT A.age, A.gender, OccupationMaster.occupation_name, ReligionMaster.religion_name, CasteMaster.caste_name FROM Accused A LEFT JOIN OccupationMaster ON A.occupation_id = OccupationMaster.ROWID LEFT JOIN ReligionMaster ON A.religion_id = ReligionMaster.ROWID LEFT JOIN CasteMaster ON A.caste_id = CasteMaster.ROWID`;
    } else if (entity === 'victim') {
      tableName = 'Victim';
      query = `SELECT V.age, V.gender, OccupationMaster.occupation_name, ReligionMaster.religion_name, CasteMaster.caste_name FROM Victim V LEFT JOIN OccupationMaster ON V.occupation_id = OccupationMaster.ROWID LEFT JOIN ReligionMaster ON V.religion_id = ReligionMaster.ROWID LEFT JOIN CasteMaster ON V.caste_id = CasteMaster.ROWID`;
    } else if (entity === 'complainant' || entity === 'complainantdetails') {
      tableName = 'ComplainantDetails';
      query = `SELECT CD.age, CD.gender, OccupationMaster.occupation_name, ReligionMaster.religion_name, CasteMaster.caste_name FROM ComplainantDetails CD LEFT JOIN OccupationMaster ON CD.occupation_id = OccupationMaster.ROWID LEFT JOIN ReligionMaster ON CD.religion_id = ReligionMaster.ROWID LEFT JOIN CasteMaster ON CD.caste_id = CasteMaster.ROWID`;
    } else {
      return sendError(res, 'INVALID_INPUT', 'Entity parameter must be one of: accused, victim, complainant.', 400);
    }

    const rawData = await app.zcql().executeZCQLQuery(query);
    const list = flattenResults(rawData);

    // Group and aggregate in Node.js for high performance and to bypass ZCQL constraints
    const totalCount = list.length;
    const genderCounts = {};
    const ageBuckets = {
      'Under 25': 0,
      '25-35': 0,
      '36-50': 0,
      '51-65': 0,
      'Over 65': 0,
      'Unknown': 0
    };
    const occupationCounts = {};
    const religionCounts = {};
    const casteCounts = {};

    list.forEach(item => {
      // 1. Gender
      const g = item.gender || 'Unknown';
      genderCounts[g] = (genderCounts[g] || 0) + 1;

      // 2. Age
      if (item.age !== undefined && item.age !== null) {
        const age = parseInt(item.age);
        if (isNaN(age)) {
          ageBuckets['Unknown']++;
        } else if (age < 25) {
          ageBuckets['Under 25']++;
        } else if (age <= 35) {
          ageBuckets['25-35']++;
        } else if (age <= 50) {
          ageBuckets['36-50']++;
        } else if (age <= 65) {
          ageBuckets['51-65']++;
        } else {
          ageBuckets['Over 65']++;
        }
      } else {
        ageBuckets['Unknown']++;
      }

      // 3. Occupation
      const occ = item.occupation_name || 'Other/Unknown';
      occupationCounts[occ] = (occupationCounts[occ] || 0) + 1;

      // 4. Religion
      const rel = item.religion_name || 'Unknown';
      religionCounts[rel] = (religionCounts[rel] || 0) + 1;

      // 5. Caste
      const caste = item.caste_name || 'Unknown';
      casteCounts[caste] = (casteCounts[caste] || 0) + 1;
    });

    // Helper helper to convert counts to list with percentages
    const toPercentList = (obj) => {
      return Object.keys(obj).map(key => ({
        label: key,
        count: obj[key],
        percentage: totalCount > 0 ? Number(((obj[key] / totalCount) * 100).toFixed(1)) : 0
      })).sort((a, b) => b.count - a.count);
    };

    const payload = {
      entity: entity,
      totalCount: totalCount,
      gender: toPercentList(genderCounts),
      age: Object.keys(ageBuckets).map(bucket => ({
        label: bucket,
        count: ageBuckets[bucket],
        percentage: totalCount > 0 ? Number(((ageBuckets[bucket] / totalCount) * 100).toFixed(1)) : 0
      })),
      occupations: toPercentList(occupationCounts),
      religions: toPercentList(religionCounts),
      castes: toPercentList(casteCounts)
    };

    return sendSuccess(res, payload);
  } catch (err) {
    console.error('Error computing demographics stats:', err);
    return sendError(res, 'DB_ERROR', err.message || 'Error executing demographics query.', 500);
  }
}

module.exports = {
  getDemographics
};
