const express = require('express');
const cors = require('cors');
const { authMiddleware } = require('../shared/auth');
const { sendSuccess, sendError } = require('../shared/response');

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  return sendSuccess(res, { status: 'UP', service: 'KSP Auth Service' });
});

// Login POST Handler
const loginHandler = (req, res) => {
  const { username, role } = req.body || {};
  const userRole = role || 'investigator';
  return sendSuccess(res, {
    session: {
      username: username || 'investigator@ksp.gov.in',
      role: userRole,
      badgeNumber: 'KSP-4589',
      name: 'Officer Mahesh Kumar'
    },
    message: 'Authentication successful'
  });
};

app.post('/login', loginHandler);
app.post('/auth/login', loginHandler);
app.post('/api/v1/auth/login', loginHandler);

// GET Handlers for authentication metadata or gateway health
app.get('/login', (req, res) => {
  return sendSuccess(res, { status: 'UP', service: 'KSP Auth Service', hint: 'Use POST for authentication' });
});
app.get('/auth/login', (req, res) => {
  return sendSuccess(res, { status: 'UP', service: 'KSP Auth Service', hint: 'Use POST for authentication' });
});

// Session check routes
app.get('/session', authMiddleware, (req, res) => {
  return sendSuccess(res, { user: req.user });
});

app.get('/auth/session', authMiddleware, (req, res) => {
  return sendSuccess(res, { user: req.user });
});

// Logout routes
app.post('/logout', (req, res) => {
  return sendSuccess(res, { message: 'Session cleared.' });
});

app.post('/auth/logout', (req, res) => {
  return sendSuccess(res, { message: 'Session cleared.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Auth Function Error:', err);
  return sendError(res, 'INTERNAL_ERROR', err.message || 'Internal server error', 500);
});

module.exports = app;
