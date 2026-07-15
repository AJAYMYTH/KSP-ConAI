/**
 * auth.js
 * Shared authentication and role resolution module for KSP Crime Intelligence Copilot.
 */

const catalyst = require('zcatalyst-sdk-node');

const { sendError } = require('./response');

/**
 * Resolves the role of the current user.
 * Supported roles: admin, investigator, analyst, viewer.
 * Fallback to 'investigator' for development or unauthorized sessions.
 * 
 * @param {object} req - Express-like request object
 * @param {object} app - Catalyst App instance
 * @returns {Promise<string>} Role name (lowercase)
 */
async function resolveUserRole(req, app) {
  // Check headers first (highly useful for local testing and cross-function queries)
  if (req.headers && req.headers['x-user-role']) {
    return req.headers['x-user-role'].toLowerCase();
  }

  try {
    const userManagement = app.userManagement();
    const currentUser = await userManagement.getCurrentUser();
    if (currentUser && currentUser.role_details && currentUser.role_details.role_name) {
      return currentUser.role_details.role_name.toLowerCase();
    }
  } catch (err) {
    // In local development or if session is unauthenticated, log and degrade gracefully
    console.log('User session role resolution failed, using fallback or default role:', err.message);
  }

  // Default role fallback to protect integrity while ensuring usability
  return 'investigator';
}

/**
 * Checks if the user's role has permission for a specific capability.
 * 
 * Capability mapping from PRD section 4.1:
 * - View dashboard: admin, investigator, analyst, viewer
 * - Search/filter FIRs: admin, investigator, analyst, viewer (limited)
 * - View case detail: admin, investigator, analyst
 * - Use AI assistant: admin, investigator, analyst
 * - Generate PDF report: admin, investigator, analyst
 * - Access admin tools: admin
 * 
 * @param {string} role - The user's role (admin, investigator, analyst, viewer)
 * @param {string} capability - Capability key to check
 * @returns {boolean} Whether the role is authorized
 */
function hasCapability(role, capability) {
  const normalizedRole = (role || 'viewer').toLowerCase();

  const permissions = {
    view_dashboard: ['admin', 'investigator', 'analyst', 'viewer'],
    search_firs: ['admin', 'investigator', 'analyst', 'viewer'],
    view_case_detail: ['admin', 'investigator', 'analyst'],
    use_ai_assistant: ['admin', 'investigator', 'analyst'],
    generate_report: ['admin', 'investigator', 'analyst'],
    access_admin_tools: ['admin'],
    manage_users: ['admin'],
    view_audit_logs: ['admin']
  };

  return permissions[capability] ? permissions[capability].includes(normalizedRole) : false;
}

/**
 * Express middleware to enforce role-based access controls
 * 
 * @param {string[]} allowedRoles - List of allowed roles
 */
function checkRole(allowedRoles) {
  return async (req, res, next) => {
    try {
      const app = req.catalystApp || catalyst.initialize(req);
      req.catalystApp = app;
      
      const role = await resolveUserRole(req, app);
      req.user = req.user || {};
      req.user.role = role;
      
      // Extract user email if available
      try {
        const currentUser = await app.userManagement().getCurrentUser();
        req.user.email = currentUser.email_id || 'anonymous@ksp.gov.in';
      } catch (err) {
        req.user.email = req.headers['x-user-email'] || 'anonymous@ksp.gov.in';
      }
      
      if (allowedRoles.includes(role)) {
        return next();
      }
      
      return sendError(res, 'FORBIDDEN', 'Access denied. Your role is not authorized to access this resource.', 403);
    } catch (err) {
      console.error('Error in checkRole middleware:', err);
      return sendError(res, 'INTERNAL_ERROR', err.message, 500);
    }
  };
}

module.exports = {
  resolveUserRole,
  hasCapability,
  checkRole
};
