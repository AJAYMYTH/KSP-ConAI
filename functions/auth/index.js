const express = require('express');
const cors = require('cors');
const { authMiddleware } = require('../shared/auth');
const { sendSuccess, sendError } = require('../shared/response');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Session check routes (handle both with and without prefix)
app.get('/session', authMiddleware, (req, res) => {
  return sendSuccess(res, { user: req.user });
});

app.get('/auth/session', authMiddleware, (req, res) => {
  return sendSuccess(res, { user: req.user });
});

// Logout routes
app.post('/logout', (req, res) => {
  return sendSuccess(res, { message: 'Session cleared. Client should redirect to Catalyst logout.' });
});

app.post('/auth/logout', (req, res) => {
  return sendSuccess(res, { message: 'Session cleared. Client should redirect to Catalyst logout.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Auth Function Error:', err);
  return sendError(res, 'INTERNAL_ERROR', err.message || 'Internal server error', 500);
});

module.exports = app;
