const { getCatalystApp, flattenResults } = require('../shared/catalyst');
const { sendSuccess, sendError } = require('../shared/response');

async function getSimilarCases(req, res) {
  try {
    const app = getCatalystApp(req);
    const caseId = req.params.caseId;

    if (!caseId || !/^\d+$/.test(caseId)) {
      return sendError(res, 'INVALID_INPUT', 'Case ID must be a valid numeric string.', 400);
    }

    // 1. Fetch current case parameters to establish baseline similarity
    const baseQuery = `SELECT ROWID, case_category_id, crime_sub_head_id, district_id, latitude, longitude FROM CaseMaster WHERE ROWID = ${caseId}`;
    const baseResult = await app.zcql().executeZCQLQuery(baseQuery);
    
    if (!baseResult || baseResult.length === 0) {
      return sendError(res, 'NOT_FOUND', `Base case with ID ${caseId} not found.`, 404);
    }

    const baseCase = baseResult[0].CaseMaster;

    // 2. Fetch potentially similar cases (matching category or sub-head, excluding current case)
    const matchesQuery = `
      SELECT 
        CaseMaster.ROWID, 
        CaseMaster.fir_number, 
        CaseMaster.crime_registered_date, 
        CaseMaster.latitude, 
        CaseMaster.longitude, 
        CaseMaster.place_of_occurrence, 
        CaseMaster.summary_of_facts, 
        CaseMaster.case_category_id,
        CaseMaster.crime_sub_head_id,
        CaseMaster.district_id,
        CaseCategory.category_name, 
        District.district_name 
      FROM CaseMaster 
      LEFT JOIN CaseCategory ON CaseMaster.case_category_id = CaseCategory.ROWID 
      LEFT JOIN District ON CaseMaster.district_id = District.ROWID 
      WHERE (CaseMaster.case_category_id = ${baseCase.case_category_id} OR CaseMaster.crime_sub_head_id = ${baseCase.crime_sub_head_id}) 
        AND CaseMaster.ROWID != ${caseId} 
      LIMIT 0, 10
    `;

    const rawMatches = await app.zcql().executeZCQLQuery(matchesQuery);
    const matches = flattenResults(rawMatches);

    // 3. Compute similarity score (0 to 100) for each match
    const scoredMatches = matches.map(item => {
      let score = 0;

      // Category match (up to 30 pts)
      if (item.case_category_id === baseCase.case_category_id) {
        score += 30;
      }
      
      // Sub-head match (up to 40 pts - indicating high modus operandi similarity)
      if (item.crime_sub_head_id === baseCase.crime_sub_head_id) {
        score += 40;
      }

      // District match (up to 20 pts - geographical proximity indicator)
      if (item.district_id === baseCase.district_id) {
        score += 20;
      }

      // Spatial distance scoring (up to 10 pts)
      if (baseCase.latitude && baseCase.longitude && item.latitude && item.longitude) {
        const latDiff = Math.abs(baseCase.latitude - item.latitude);
        const lngDiff = Math.abs(baseCase.longitude - item.longitude);
        const distanceVal = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        
        if (distanceVal < 0.05) score += 10;
        else if (distanceVal < 0.2) score += 5;
      }

      // Cap/bound similarity percentage
      const similarityPercentage = Math.min(98, Math.max(45, score));

      return {
        ROWID: item.ROWID,
        fir_number: item.fir_number,
        crime_registered_date: item.crime_registered_date,
        place_of_occurrence: item.place_of_occurrence,
        summary_of_facts: item.summary_of_facts,
        category_name: item.category_name,
        district_name: item.district_name,
        similarity_score: similarityPercentage
      };
    });

    // Sort by highest similarity score
    scoredMatches.sort((a, b) => b.similarity_score - a.similarity_score);

    return sendSuccess(res, scoredMatches);
  } catch (err) {
    console.error('Error fetching similar cases:', err);
    return sendError(res, 'DB_ERROR', err.message || 'Error executing similarity search.', 500);
  }
}

module.exports = {
  getSimilarCases
};
