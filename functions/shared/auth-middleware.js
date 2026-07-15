/**
 * auth-middleware.js
 *
 * Express-compatible middleware to authenticate Catalyst requests,
 * resolve user roles (admin/investigator/analyst/viewer) from Catalyst Authentication or UserRole table,
 * and enforce role-based access control (RBAC).
 * NodeJS 20 compatible.
 */

const { ROLES, ROLE_PERMISSIONS } = require('./constants');
const { unauthorized, forbidden } = require('./response');

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
    try {
      user = await app.user().getCurrentUser();
    } catch (err) {
      console.warn('Failed to retrieve current user details:', err.message || err);
      return unauthorized(res, 'Session is invalid or expired.');
    }

    if (!user || !user.user_id) {
      return unauthorized(res, 'User not found or unauthenticated.');
    }

    let role = ROLES.VIEWER; // Default role if none resolved

    try {
      // 1. Try to resolve role from user.role_details (Catalyst Auth custom role)
      if (user.role_details && user.role_details.role_name) {
        const potentialRole = user.role_details.role_name.trim().toLowerCase();
        if (Object.values(ROLES).includes(potentialRole)) {
          role = potentialRole;
        }
      }

      // 2. If role is still default VIEWER, query the UserRole table
      if (role === ROLES.VIEWER) {
        const userIdEscaped = String(user.user_id).replace(/'/g, "''");
        const emailEscaped = String(user.email_id).replace(/'/g, "''");
        const query = `SELECT role FROM UserRole WHERE user_id = '${userIdEscaped}' OR user_id = '${emailEscaped}'`;
        
        const dbResult = await app.zcql().executeZCQLQuery(query);
        if (dbResult && dbResult.length > 0 && dbResult[0].UserRole) {
          const dbRole = dbResult[0].UserRole.role.trim().toLowerCase();
          if (Object.values(ROLES).includes(dbRole)) {
            role = dbRole;
          }
        }
      }
    } catch (roleError) {
      console.error('Role resolution error:', roleError.message || roleError);
      // Fail-safe: keep role as VIEWER
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
