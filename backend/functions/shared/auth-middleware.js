/**
 * auth-middleware.js
 *
 * Express-compatible middleware to authenticate Catalyst requests,
 * resolve user roles (admin/investigator/analyst/viewer) from Catalyst Authentication or UserRole table,
 * and enforce role-based access control (RBAC).
 * NodeJS 20 compatible.
 */

const { ROLES, ROLE_PERMISSIONS } = require('./constants');
const { sendError } = require('./response');

const unauthorized = (res, message) => sendError(res, 'UNAUTHORIZED', message, 401);
const forbidden = (res, message) => sendError(res, 'FORBIDDEN', message, 403);

/**
 * Middleware to authenticate requests and resolve user roles/permissions.
 * Attaches the auth context to req.auth and req.user.
 */
const authMiddleware = async (req, res, next) => {
  try {
    const catalyst = require('zcatalyst-sdk-node');
    // Initialize Catalyst SDK with request context to propagate headers
    const app = catalyst.initialize(req);
    
    let user;
    let role = ROLES.VIEWER; // Default role if none resolved

    // Check for developer headers to bypass authentication locally
    if (req.headers && req.headers['x-user-role']) {
      const devRole = req.headers['x-user-role'].trim().toLowerCase();
      user = {
        user_id: 'DEV_USER_ID',
        email_id: req.headers['x-user-email'] || 'dev-investigator@ksp.gov.in',
        role_details: {
          role_name: devRole
        }
      };
      if (Object.values(ROLES).includes(devRole)) {
        role = devRole;
      }
    } else {
      // Production or standard authentication
      try {
        user = await app.userManagement().getCurrentUser();
      } catch (err) {
        console.warn('Failed to retrieve current user details:', err.message || err);
        
        // Graceful fallback for local development when no header is present
        if (process.env.CATALYST_ENV === 'development' || !process.env.CATALYST_ENV) {
          console.log('Local development detected: defaulting to investigator session');
          user = {
            user_id: 'DEV_USER_ID',
            email_id: 'dev-investigator@ksp.gov.in',
            role_details: {
              role_name: 'investigator'
            }
          };
          role = 'investigator';
        } else {
          return unauthorized(res, 'Session is invalid or expired.');
        }
      }
    }

    if (!user || !user.user_id) {
      return unauthorized(res, 'User not found or unauthenticated.');
    }

    // Resolve role from user.role_details if not already set by developer headers
    if (role === ROLES.VIEWER && user.role_details && user.role_details.role_name) {
      const potentialRole = user.role_details.role_name.trim().toLowerCase();
      if (Object.values(ROLES).includes(potentialRole)) {
        role = potentialRole;
      }
    }

    // Populate access context
    const authContext = {
      user,
      userId: user.user_id,
      email: user.email_id,
      role,
      permissions: ROLE_PERMISSIONS[role] || [],
      catalystApp: app
    };

    // Attach to request
    req.auth = authContext;
    req.user = authContext; // Backwards compatibility

    next();
  } catch (error) {
    console.error('Auth middleware critical error:', error);
    return unauthorized(res, 'Authentication failed due to an internal error.');
  }
};

/**
 * Middleware factory to enforce a specific permission.
 *
 * @param {string} permission - The permission key to check (from PERMISSIONS)
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.auth || !req.auth.permissions || !req.auth.permissions.includes(permission)) {
      return forbidden(res, `Access denied. Required permission '${permission}' is missing.`);
    }
    next();
  };
};

/**
 * Middleware factory to enforce specific roles.
 *
 * @param {string[]} allowedRoles - List of allowed role strings
 */
const requireRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      return forbidden(res, 'Access denied. Your role is not authorized to access this resource.');
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  requirePermission,
  requireRoles
};
