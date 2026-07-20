// Trigger compile update
const express = require('express');
const cors = require('cors');
const { authMiddleware } = require('../shared/auth');
const { getDashboardSummary } = require('./dashboard-handler');
const { getTrends } = require('./trends-handler');
const { getPredictiveInsights } = require('./predictive-handler');
const { getDemographics } = require('./demographics-handler');
const { getOffenderProfile } = require('./offender-handler');
const { sendError } = require('../shared/response');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Protect all analytics endpoints
app.use(authMiddleware);

// Define API Gateway mapped endpoints
app.get('/dashboard/summary', getDashboardSummary);
app.get('/analytics/trends', getTrends);
app.get('/analytics/predictive', getPredictiveInsights);
app.get('/analytics/demographics', getDemographics);
app.get('/analytics/offender', getOffenderProfile);

// Direct root fallbacks (matching route definitions inside the function's own routing context)
app.get('/summary', getDashboardSummary);
app.get('/trends', getTrends);
app.get('/predictive', getPredictiveInsights);
app.get('/demographics', getDemographics);
app.get('/offender', getOffenderProfile);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Analytics Function Error:', err);
  return sendError(res, 'INTERNAL_ERROR', err.message || 'Internal server error', 500);
});

module.exports = app;
