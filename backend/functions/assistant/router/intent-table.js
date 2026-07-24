/**
 * intent-table.js
 * Configuration table for all assistant intents, descriptions, and trigger keywords.
 */

const intents = {
  anomaly_detection: {
    description: 'Detection of operational, procedural, or registration anomalies in case files.',
    keywords: [
      'anomaly', 'anomalies', 'detect anomaly', 'irregularity', 'suspicious delay',
      'unusual pattern', 'procedural gap', 'missing accused', 'data inconsistency'
    ],
    rules: [
      /anomaly/i, /anomalies/i, /detect anomaly/i, /irregularity/i, /suspicious delay/i
    ]
  },
  fraud_detection: {
    description: 'Analysis and detection of cybercrime, financial fraud, phishing, and scam patterns.',
    keywords: [
      'fraud', 'financial fraud', 'cybercrime', 'phishing', 'scam', 'otp scam',
      'banking fraud', 'online scam', 'cheating', 'monetary loss', 'cyber fraud'
    ],
    rules: [
      /fraud/i, /cybercrime/i, /phishing/i, /scam/i, /financial fraud/i, /cheating case/i
    ]
  },
  investigation_reasoning: {
    description: 'Generative investigation reasoning over aggregated data or similar case patterns.',
    keywords: [
      'why', 'explain the pattern', 'is this suspicious', 'reason behind', 
      'explain why', 'suspicious activity'
    ],
    rules: [
      /why /i, /explain the pattern/i, /is this suspicious/i, /reason behind/i
    ]
  },
  translation: {
    description: 'Translation of case information or responses from English to Kannada or vice-versa.',
    keywords: [
      'translate to', 'in kannada', 'kannada translation', 'translate this', 
      'kannadadalli', 'translate'
    ],
    rules: [
      /translate/i, /kannada/i, /in kannada/i
    ]
  },
  similarity_search: {
    description: 'Hybrid search to find cases resembling a query case in MO, act/section, or circumstances.',
    keywords: [
      'similar cases', 'resembles', 'does this match', 'similar to', 
      'matching pattern', 'similarity', 'same modus operandi', 'same mo'
    ],
    rules: [
      /similar( case)?/i, /resembles/i, /does this match/i, /matching pattern/i
    ]
  },
  report_drafting: {
    description: 'Generative draft of an investigative summary document for a case.',
    keywords: [
      'generate a report', 'prepare a summary document', 'draft report', 
      'report for case', 'create report'
    ],
    rules: [
      /generate (a )?report/i, /draft report/i, /prepare (a )?report/i, /create (a )?report/i
    ]
  },
  case_summary: {
    description: 'Generative summarization of a single case by its ID.',
    keywords: [
      'summarize case', 'summary of', 'overview of case', 'brief of case', 
      'case summary', 'what happened in case', 'details of case'
    ],
    rules: [
      /summarize( case)?/i, /summary of/i, /overview of( case)?/i, /case summary/i
    ]
  },
  trend_analysis: {
    description: 'Deterministic computation of crime trend metrics (ratios, increases, monthly comparisons).',
    keywords: [
      'trend', 'over time', 'rising', 'compare months', 'increase', 'decrease', 
      'growing', 'monthly comparison', 'trend of', 'compare years', 'percentage change'
    ],
    rules: [
      /trend/i, /over time/i, /rising/i, /increase/i, /decrease/i, /compare/i, /upward/i, /downward/i
    ]
  },
  sql_lookup: {
    description: 'Deterministic SQL query to count, list, or retrieve cases matching standard criteria.',
    keywords: [
      'how many', 'list', 'show me', 'which cases', 'count of', 'number of cases', 
      'find cases', 'firs registered', 'fir count', 'cases in', 'registered in'
    ],
    rules: [
      /how many/i, /list (of )?cases/i, /show (me )?cases/i, /count (of )?cases/i, /number of cases/i
    ]
  }
};

module.exports = {
  intents
};
