// Trigger compile update 3
const express = require('express');
const cors = require('cors');
const { authMiddleware } = require('../shared/auth');
const { searchCases } = require('./search-handler');
const { getCaseDetail } = require('./detail-handler');
const { sendError } = require('../shared/response');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Protect all cases routes
app.use(authMiddleware);

// Define router endpoints
app.get('/cases', searchCases);
app.get('/cases/:caseId', getCaseDetail);

// Support direct endpoints (when API gateway paths map /cases/* directly to the function context)
app.get('/', searchCases);
app.get('/:caseId', getCaseDetail);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Cases Function Error:', err);
  return sendError(res, 'INTERNAL_ERROR', err.message || 'Internal server error', 500);
});

module.exports = app;
