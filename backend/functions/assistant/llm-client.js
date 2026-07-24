/**
 * llm-client.js
 * Unified LLM service wrapper supporting:
 * 1. Zoho Catalyst QuickML GLM Chat REST API (https://api.catalyst.zoho.in/quickml/v1/project/.../glm/chat)
 * 2. Zoho Catalyst SDK QuickML endpoints (app.quickML().predict(...))
 * 3. OpenAI / Custom HTTP REST endpoints (LLM_API_ENDPOINT)
 * 4. Structured fallback synthesis when offline or unconfigured
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * System prompt instructions for strictly database-grounded responses.
 */
const SYSTEM_GROUNDING_PROMPT = `
You are the Karnataka State Police (KSP) Crime Intelligence Copilot.
Your duty is to assist police officers, investigators, and crime analysts with accurate intelligence derived from official police database records.

STRICT OPERATIONAL RULES:
1. Base your answer strictly and exclusively on the provided DATABASE CONTEXT.
2. Never invent, assume, or hallucinate facts, names, dates, FIR numbers, locations, or legal charges.
3. If the provided database context does not contain enough information to answer a part of the query, explicitly state: "No matching records found in the database for this aspect."
4. Do NOT answer off-topic queries (e.g. writing quotes, poems, recipes, general non-police trivia, or non-police coding).
5. Maintain an objective, neutral, formal legal tone suitable for police intelligence reports. Do not state guilt determinations.
`.trim();

/**
 * Calls a Zoho Catalyst QuickML or OpenAI-compatible REST endpoint.
 * 
 * @param {string} endpointUrl 
 * @param {string} apiKey 
 * @param {string} orgId 
 * @param {string} modelName 
 * @param {string} systemPrompt 
 * @param {string} userMessage 
 * @returns {Promise<string>} Model output text
 */
async function callRestEndpoint(endpointUrl, apiKey, orgId, modelName, systemPrompt, userMessage) {
  return new Promise((resolve, reject) => {
    try {
      const parsedUrl = new URL(endpointUrl);
      const isHttps = parsedUrl.protocol === 'https:';
      const client = isHttps ? https : http;

      const payload = JSON.stringify({
        model: modelName || 'crm-di-glm47b_30b_it',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1000,
        temperature: 0.2,
        stream: false
      });

      const headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      };

      if (apiKey) {
        headers['Authorization'] = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;
      }
      if (orgId) {
        headers['CATALYST-ORG'] = orgId;
      }

      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'POST',
        headers,
        timeout: 15000
      };

      const req = client.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const json = JSON.parse(body);
              // Handle QuickML / OpenAI chat choice format
              if (json.choices && json.choices[0] && json.choices[0].message) {
                const content = json.choices[0].message.content;
                resolve(typeof content === 'string' ? content.trim() : JSON.stringify(content));
              } else if (json.answer || json.output || json.result || json.response) {
                resolve(json.answer || json.output || json.result || json.response);
              } else {
                resolve(body.trim());
              }
            } catch (e) {
              resolve(body.trim());
            }
          } else {
            reject(new Error(`LLM REST endpoint returned HTTP ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', (err) => reject(err));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('LLM REST endpoint request timed out after 15 seconds'));
      });

      req.write(payload);
      req.end();
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Invokes LLM service with database context for grounded synthesis.
 * 
 * @param {object} params
 * @param {string} params.prompt - User task / query prompt
 * @param {object|string} params.dbContext - Database records / ground truth context
 * @param {object} [params.app] - Catalyst App instance (for QuickML SDK)
 * @param {string} [params.taskName] - Optional task descriptor (e.g. 'Case Summary', 'Anomaly Detection')
 * @param {string} [params.fallbackAnswer] - Structured text fallback if LLM is unavailable
 * @returns {Promise<{ answer: string, providerUsed: string }>}
 */
async function generateGroundedResponse({ prompt, dbContext, app, authToken, taskName = 'Intelligence Synthesis', fallbackAnswer = '' }) {
  const contextString = typeof dbContext === 'string' ? dbContext : JSON.stringify(dbContext, null, 2);
  const fullUserMessage = `TASK: ${taskName}\nUSER QUERY: ${prompt}\n\nDATABASE CONTEXT:\n${contextString}`;

  // 1. Check for Zoho Catalyst QuickML REST API endpoint
  const restEndpoint = process.env.CATALYST_QUICKML_URL || process.env.LLM_API_ENDPOINT;
  const apiKey = process.env.CATALYST_AUTH_TOKEN || process.env.LLM_API_KEY || authToken;
  const orgId = process.env.CATALYST_ORG_ID || '60073254156';
  const modelName = process.env.LLM_MODEL_NAME || 'crm-di-glm47b_30b_it';

  if (restEndpoint) {
    try {
      console.log(`[LLMClient] Invoking Zoho Catalyst QuickML REST API (${restEndpoint})...`);
      const resultText = await callRestEndpoint(restEndpoint, apiKey, orgId, modelName, SYSTEM_GROUNDING_PROMPT, fullUserMessage);
      return {
        answer: resultText,
        providerUsed: `Zoho Catalyst QuickML REST (${modelName})`
      };
    } catch (err) {
      console.error(`[LLMClient] QuickML REST invocation failed (${err.message}). Falling back to QuickML SDK / Deterministic...`);
    }
  }

  // 2. Check for Zoho Catalyst SDK QuickML Key
  const quickMlKey = process.env.QUICKML_LLM_KEY || process.env.QUICKML_SUMMARIZER_KEY;
  if (quickMlKey && app) {
    try {
      console.log(`[LLMClient] Invoking Zoho Catalyst SDK QuickML endpoint...`);
      const quickML = app.quickML();
      const payload = {
        prompt: `${SYSTEM_GROUNDING_PROMPT}\n\n${fullUserMessage}`
      };
      const response = await quickML.predict(quickMlKey, payload);

      if (response && response.success && (response.data?.output || response.data?.summary || response.output)) {
        const text = response.data?.output || response.data?.summary || response.output;
        return {
          answer: text.trim(),
          providerUsed: 'Zoho Catalyst QuickML SDK'
        };
      }
    } catch (err) {
      console.error(`[LLMClient] QuickML SDK invocation error (${err.message}). Falling back to Deterministic...`);
    }
  }

  // 3. Graceful Fallback to Deterministic Structured Synthesis
  console.log(`[LLMClient] No active LLM endpoint online. Returning database-grounded template synthesis.`);
  return {
    answer: fallbackAnswer || `Database Context Retracted:\n${contextString}`,
    providerUsed: 'Deterministic Database Synthesizer'
  };
}

module.exports = {
  SYSTEM_GROUNDING_PROMPT,
  callRestEndpoint,
  generateGroundedResponse
};
