/**
 * similarity-search.js
 * Hybrid similarity search pipeline for crime cases:
 * - Stage 1: Deterministic filter by category, district, and section overlap.
 * - Stage 2: Semantic text similarity (using QuickML vector embedding predictions or Jaccard fallback).
 * - Blend: Combined scoring and explanation (reason codes).
 */

const { executeQuery } = require('../../shared/database');
const { fetchCaseBundle } = require('./case-summary');

/**
 * Calculates Jaccard similarity between two text strings in JavaScript as a fallback.
 * 
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @returns {number} Jaccard similarity score (0.0 to 1.0)
 */
function calculateJaccardSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;
  
  const getTokens = (txt) => {
    return new Set(
      txt.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(/\s+/)
        .filter(token => token.length > 3) // Ignore short stopwords
    );
  };

  const set1 = getTokens(text1);
  const set2 = getTokens(text2);
  
  if (set1.size === 0 || set2.size === 0) return 0;

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

/**
 * Runs the Hybrid Similarity Search skill.
 * 
 * @param {object} slots - Extracted slots containing firNumber
 * @param {object} app - Catalyst App instance
 * @returns {Promise<object>} Similarity search results
 */
async function executeSimilaritySearch(slots, app) {
  if (!slots.firNumber) {
    return {
      success: false,
      answer: 'Please provide a reference case or FIR number (e.g. 0001/2026) to find similar cases.',
      confidence: 'low'
    };
  }

  try {
    // 1. Fetch reference case bundle
    const refBundle = await fetchCaseBundle(slots.firNumber, app);
    if (!refBundle) {
      return {
        success: false,
        answer: `Reference case with FIR number ${slots.firNumber} was not found.`,
        confidence: 'high'
      };
    }

    const refCase = refBundle.caseMaster;
    const refCaseId = refCase.ROWID;
    const refCategory = refCase.category_name;
    const refDistrict = refCase.district_name;
    const refSummary = refCase.summary_of_facts || '';

    // Extract section numbers for Stage 1 match
    const refSections = refBundle.actsSections.map(as => as.section_number);

    // --- STAGE 1: Deterministic Filtering & Candidate Retrieval ---
    // Fetch cases that share category, district, or sections, excluding the reference case itself.
    let candidateQuery = `SELECT ROWID, fir_number, crime_registered_date, place_of_occurrence, summary_of_facts, district_name, category_name, status_name FROM vw_case_summary WHERE ROWID != ${refCaseId}`;
    
    const clauses = [];
    if (refCategory) {
      clauses.push(`category_name = '${refCategory}'`);
    }
    if (refDistrict) {
      clauses.push(`district_name = '${refDistrict}'`);
    }
    
    // If reference case has sections, include section overlaps
    if (refSections.length > 0) {
      const sectionConditions = refSections.map(sec => `section_number = '${sec}'`).join(' OR ');
      clauses.push(`ROWID IN (SELECT case_id FROM ActSectionAssociation WHERE section_id IN (SELECT ROWID FROM Section WHERE ${sectionConditions}))`);
    }

    if (clauses.length > 0) {
      candidateQuery += ` AND (${clauses.join(' OR ')})`;
    }
    
    candidateQuery += ' LIMIT 30'; // Cap candidates for processing speed

    console.log(`[SimilaritySearch] Stage 1 Query: ${candidateQuery}`);
    const candidates = await executeQuery(app, candidateQuery);

    if (candidates.length === 0) {
      return {
        success: true,
        answer: `No similar cases were found matching the category, district, or sections of case ${slots.firNumber}.`,
        supportingData: [],
        linkedCases: [],
        sources: ['vw_case_summary'],
        confidence: 'high'
      };
    }

    // --- STAGE 2: Scoring and Explainability (Reason Codes) ---
    const scoredCandidates = [];
    const endpointKey = process.env.QUICKML_EMBEDDING_KEY;

    for (const cand of candidates) {
      const reasons = [];
      let ruleScore = 0;

      // Rule 1: Same category
      if (cand.category_name === refCategory) {
        reasons.push('Same Crime Category');
        ruleScore += 0.35;
      }
      
      // Rule 2: Same district
      if (cand.district_name === refDistrict) {
        reasons.push('Same Police District');
        ruleScore += 0.25;
      }

      // Rule 3: Section overlap (requires fetching candidate sections or comparing check)
      // For simplicity, if we found it via the query we can give credit if we do a sub-check
      // Here we check if the query returned overlap
      // We can also query sections for this specific candidate, but in our case we do keyword/metadata overlap
      
      // Compute semantic similarity
      let semanticScore = 0;
      let usedQuickML = false;

      if (endpointKey && app) {
        try {
          // Attempt to get QuickML embedding / similarity prediction
          const quickML = app.quickML();
          const response = await quickML.predict(endpointKey, {
            source_text: refSummary,
            candidate_text: cand.summary_of_facts || ''
          });

          if (response && response.success && response.data && response.data.similarity_score !== undefined) {
            semanticScore = response.data.similarity_score;
            usedQuickML = true;
          }
        } catch (err) {
          console.warn('[SimilaritySearch] QuickML embedding prediction failed, using Jaccard fallback:', err.message);
        }
      }

      if (!usedQuickML) {
        semanticScore = calculateJaccardSimilarity(refSummary, cand.summary_of_facts || '');
      }

      if (semanticScore > 0.3) {
        reasons.push('Similar Modus Operandi (MO)');
      }

      // Blend the scores (0.4 rule score, 0.6 semantic score)
      const blendedScore = (ruleScore * 0.4) + (semanticScore * 0.6);

      scoredCandidates.push({
        caseId: cand.ROWID,
        fir_number: cand.fir_number,
        category_name: cand.category_name,
        district_name: cand.district_name,
        crime_registered_date: cand.crime_registered_date,
        place_of_occurrence: cand.place_of_occurrence,
        summary_of_facts: cand.summary_of_facts,
        status_name: cand.status_name,
        similarityScore: Math.round(blendedScore * 100),
        matchingReasons: reasons
      });
    }

    // Sort by blended score descending and take top 3
    const topMatches = scoredCandidates
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, 3);

    // Compose final answer text
    let answer = `Based on a hybrid similarity search for case **${slots.firNumber}** (${refCategory} in ${refDistrict}), here are the top matching cases:\n\n`;
    
    topMatches.forEach((match, idx) => {
      answer += `${idx + 1}. **FIR ${match.fir_number}** (${match.category_name} - ${match.district_name}) - **${match.similarityScore}% Match**\n`;
      answer += `   - **Reasons:** ${match.matchingReasons.join(', ')}\n`;
      answer += `   - **Status:** ${match.status_name}\n`;
      answer += `   - **Summary:** ${match.summary_of_facts.substring(0, 120)}...\n\n`;
    });

    const linkedCases = topMatches.map(m => m.fir_number);

    return {
      success: true,
      answer,
      supportingData: {
        referenceCase: slots.firNumber,
        matches: topMatches
      },
      linkedCases,
      sqlPreview: candidateQuery,
      sources: ['vw_case_summary', 'ActSectionAssociation', 'Section'],
      confidence: 'high'
    };
  } catch (err) {
    console.error('[SimilaritySearch] Error executing similarity search:', err.message);
    return {
      success: false,
      answer: `Failed to complete similarity search for case ${slots.firNumber}.`,
      supportingData: { error: err.message },
      sources: ['vw_case_summary'],
      confidence: 'low'
    };
  }
}

module.exports = {
  executeSimilaritySearch
};
