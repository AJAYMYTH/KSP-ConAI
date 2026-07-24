/**
 * index.js
 * Advanced I/O function entry point for the assistant service.
 * Standard Express.js server mapped to Catalyst routing.
 */

try { require('dotenv').config(); } catch (e) {}
const express = require('express');
const catalyst = require('zcatalyst-sdk-node');
const { resolveUserRole, hasCapability } = require('../shared/auth');
const { composeResponse } = require('./response-composer');
const { checkDomainBoundary } = require('./guardrails');

// Router imports
const { classifyIntent } = require('./router/intent-classifier');
const { extractSlots } = require('./router/slot-extractor');

// Skills imports
const { executeSqlLookup } = require('./skills/sql-lookup');
const { executeTrendAnalysis } = require('./skills/trend-analysis');
const { executeCaseSummary } = require('./skills/case-summary');
const { executeTranslation, translateToKannada } = require('./skills/translation');
const { executeSimilaritySearch } = require('./skills/similarity-search');
const { executeAnomalyDetection } = require('./skills/anomaly-detection');
const { executeFraudDetection } = require('./skills/fraud-detection');

const app = express();
app.use(express.json());

const { getCatalystApp } = require('../shared/catalyst');

// Main handler function for assistant queries
const queryHandler = async (req, res) => {
  // Initialize Catalyst SDK
  const catalystApp = getCatalystApp(req);
  
  const text = req.body.text || req.body.query || req.body.q || req.body.message;
  const conversationHistory = req.body.conversationHistory || req.body.history;

  if (!text) {
    return res.status(400).json(composeResponse({
      success: false,
      answer: 'Bad Request: "text" or "query" parameter is required.',
      role: 'viewer'
    }));
  }

  try {
    // 1. Authentication and Role Verification
    const role = await resolveUserRole(req, catalystApp);
    if (!hasCapability(role, 'use_ai_assistant')) {
      return res.status(403).json(composeResponse({
        success: false,
        intent: 'clarify',
        answer: 'Access Denied: Your role is not authorized to use the AI assistant.',
        role
      }));
    }

    // 1.5 Domain Boundary Guardrail Check
    const domainCheck = checkDomainBoundary(text);
    if (!domainCheck.allowed) {
      console.warn(`[Assistant] Query rejected by domain guardrails: "${text}" (Reason: ${domainCheck.reason})`);
      return res.status(200).json(composeResponse({
        success: false,
        intent: 'out_of_domain',
        answer: domainCheck.refusalMessage,
        role,
        confidence: 'high'
      }));
    }

    // 2. Intent Classification (Tier 1 rules / Tier 2 QuickML)
    const { intent, confidence } = await classifyIntent(text, catalystApp);

    // 3. Slot / Parameter Extraction
    const slots = extractSlots(text);

    console.log(`[Assistant] Query: "${text}", Intent: ${intent}, Confidence: ${confidence}, Slots:`, slots);

    // 4. Check if Kannada translation is explicitly suffix-requested (e.g. "... in Kannada" or "... translate to Kannada")
    const isSuffixTranslationRequested = text.toLowerCase().includes('kannada') || text.toLowerCase().includes('ಕನ್ನಡ');

    let skillResult;

    // 5. Execute corresponding skill branch
    switch (intent) {
      case 'anomaly_detection':
        skillResult = await executeAnomalyDetection(slots, catalystApp);
        break;

      case 'fraud_detection':
        skillResult = await executeFraudDetection(slots, catalystApp);
        break;

      case 'sql_lookup':
        skillResult = await executeSqlLookup(slots, catalystApp, role);
        break;

      case 'trend_analysis':
        skillResult = await executeTrendAnalysis(slots, catalystApp);
        break;

      case 'case_summary':
        skillResult = await executeCaseSummary(slots, catalystApp);
        break;

      case 'similarity_search':
        skillResult = await executeSimilaritySearch(slots, catalystApp);
        break;

      case 'translation': {
        // Translation target resolution: prioritize extracted text, then input text, then last turn in conversationHistory
        let textToTranslate = slots.text || text;
        if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
          const lastAssistantTurn = [...conversationHistory]
            .reverse()
            .find(msg => msg.role === 'assistant' || msg.sender === 'assistant');
          if (lastAssistantTurn) {
            textToTranslate = lastAssistantTurn.content || lastAssistantTurn.text || textToTranslate;
          }
        }
        skillResult = await executeTranslation({ text: textToTranslate }, catalystApp);
        break;
      }

      case 'report_drafting': {
        // Fall back to case summary logic for report details in assistant chat
        skillResult = await executeCaseSummary(slots, catalystApp);
        if (skillResult.success) {
          skillResult.answer = `### DRAFT INVESTIGATIVE REPORT\n\n${skillResult.answer}\n\n*Note: This is an AI-generated draft report based on CaseMaster files.*`;
        }
        break;
      }

      case 'investigation_reasoning': {
        // Run trend analysis first to gather facts, then add reasoning context
        const trendResult = await executeTrendAnalysis(slots, catalystApp);
        if (trendResult.success) {
          const trendDir = trendResult.supportingData.trendDirection;
          let reasoning = trendResult.answer;
          
          if (trendDir === 'rising') {
            reasoning += '\n\n**Investigative Hypothesis:** The rising trend in this category may warrant increased patrolling in identified hotspots and a review of active repeat offenders in the area. Modus Operandi matches are recommended for further analysis.';
          } else {
            reasoning += '\n\n**Investigative Hypothesis:** Incident rates are stable or declining. No immediate hotspot shift detected.';
          }
          
          skillResult = {
            success: true,
            answer: reasoning,
            supportingData: trendResult.supportingData,
            linkedCases: [],
            sqlPreview: trendResult.sqlPreview,
            sources: trendResult.sources,
            confidence: 'medium'
          };
        } else {
          skillResult = trendResult;
        }
        break;
      }

      case 'clarify':
      default:
        skillResult = {
          success: true,
          answer: "I'm not sure if you want to analyze case anomalies, detect fraud patterns, count cases, show trends, search similarity, or summarize a case. Could you please rephrase, for example:\n- 'Detect anomalies in recent FIR registrations'\n- 'Analyze financial fraud patterns in cybercrime cases'\n- 'How many robbery cases in Mysuru?'\n- 'Summarize case 0001/2026'",
          supportingData: {},
          linkedCases: [],
          sources: [],
          confidence: 'high'
        };
        break;
    }

    // 6. Handle translation suffix if requested
    if (isSuffixTranslationRequested && intent !== 'translation' && skillResult && skillResult.success) {
      console.log('[Assistant] Appending translation suffix for Kannada output...');
      const translatedAnswer = await translateToKannada(skillResult.answer, catalystApp);
      skillResult.answer = translatedAnswer;
    }

    // 7. Compose and return final response envelope
    const finalResponse = composeResponse({
      success: skillResult.success,
      intent,
      answer: skillResult.answer,
      supportingData: skillResult.supportingData,
      linkedCases: skillResult.linkedCases,
      sqlPreview: skillResult.sqlPreview,
      sources: skillResult.sources,
      confidence: skillResult.confidence || confidence,
      role
    });

    return res.status(200).json(finalResponse);

  } catch (err) {
    console.error('[Assistant] Fatal error in route handler:', err);
    return res.status(500).json(composeResponse({
      success: false,
      intent: 'clarify',
      answer: 'A fatal server error occurred while processing your query.',
      supportingData: { error: err.message },
      confidence: 'low',
      role: 'viewer'
    }));
  }
};

// Enable production CORS for frontend applications
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, CATALYST-ORG, x-user-role');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Health check endpoint
app.get(['/health', '/api/v1/health'], (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'Karnataka State Police (KSP) Crime Intelligence Copilot AI Engine',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Direct FIR Case Detail REST API endpoint
app.get('/api/v1/cases/:firNumber', async (req, res) => {
  let catalystApp;
  try {
    catalystApp = catalyst.initialize(req);
  } catch (err) {
    catalystApp = catalyst.initialize();
  }

  const { firNumber } = req.params;
  const role = await resolveUserRole(req, catalystApp);

  try {
    const skillResult = await executeCaseSummary({ firNumber }, catalystApp);
    const finalResponse = composeResponse({
      success: skillResult.success,
      intent: 'case_summary',
      answer: skillResult.answer,
      supportingData: skillResult.supportingData,
      linkedCases: skillResult.linkedCases,
      sources: skillResult.sources,
      confidence: skillResult.confidence,
      role
    });
    return res.status(skillResult.success ? 200 : 404).json(finalResponse);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message }
    });
  }
});

// Bind query routes for production REST API, local serving, and gateway path variations
app.post('/query', queryHandler);
app.post('/assistant/query', queryHandler);
app.post('/api/v1/assistant/query', queryHandler);

module.exports = app;
