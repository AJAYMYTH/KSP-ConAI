// Authentication & RBAC helper for KSP Crime Intelligence Copilot

export type UserRole = 'admin' | 'investigator' | 'analyst' | 'viewer';

export interface UserSession {
  username: string;
  role: UserRole;
  token?: string;
  name: string;
  badgeNumber?: string;
}

const STORAGE_KEY = 'ksp_copilot_session';

// Default mock sessions for demo role-switching
export const DEMO_USERS: Record<UserRole, UserSession> = {
  admin: {
    username: 'admin@ksp.gov.in',
    role: 'admin',
    name: 'Shri B. Dayananda, IPS',
    badgeNumber: 'KSP-001',
  },
  investigator: {
    username: 'io.mahesh@ksp.gov.in',
    role: 'investigator',
    name: 'Mahesh Kumar (IO)',
    badgeNumber: 'KSP-4589',
  },
  analyst: {
    username: 'analyst.praveen@ksp.gov.in',
    role: 'analyst',
    name: 'Praveen Gowda (Analyst)',
    badgeNumber: 'KSP-2114',
  },
  viewer: {
    username: 'supervisor@ksp.gov.in',
    role: 'viewer',
    name: 'Inspector General (Supervisor)',
    badgeNumber: 'KSP-009',
  },
};

// Get current session
export function getCurrentSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    // Default to investigator for demo if no session is set
    return DEMO_USERS.investigator;
  }
  try {
    return JSON.parse(data);
  } catch {
    return DEMO_USERS.investigator;
  }
}

// Set session
export function setSession(session: UserSession): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

// Clear session
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Role Capabilities Matrix (PRD.md Section 4.1)
export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  SEARCH_FIRS: 'search_firs',
  VIEW_CASE_DETAIL_FULL: 'view_case_detail_full',
  USE_ASSISTANT: 'use_assistant',
  GENERATE_REPORTS: 'generate_reports',
  USE_VOICE: 'use_voice',
  ACCESS_ADMIN_TOOLS: 'access_admin_tools',
  MANAGE_USERS: 'manage_users',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  VIEW_MAP: 'view_map',
  VIEW_GRAPH: 'view_graph',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.SEARCH_FIRS,
    PERMISSIONS.VIEW_CASE_DETAIL_FULL,
    PERMISSIONS.USE_ASSISTANT,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.USE_VOICE,
    PERMISSIONS.ACCESS_ADMIN_TOOLS,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.VIEW_MAP,
    PERMISSIONS.VIEW_GRAPH,
  ],
  investigator: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.SEARCH_FIRS,
    PERMISSIONS.VIEW_CASE_DETAIL_FULL,
    PERMISSIONS.USE_ASSISTANT,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.USE_VOICE,
    PERMISSIONS.VIEW_MAP,
    PERMISSIONS.VIEW_GRAPH,
  ],
  analyst: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.SEARCH_FIRS,
    PERMISSIONS.VIEW_CASE_DETAIL_FULL,
    PERMISSIONS.USE_ASSISTANT,
    PERMISSIONS.GENERATE_REPORTS,
    PERMISSIONS.USE_VOICE,
    PERMISSIONS.VIEW_MAP,
    PERMISSIONS.VIEW_GRAPH,
  ],
  viewer: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.SEARCH_FIRS,
  ],
};

// Check if current role has a specific capability
export function hasPermission(permission: Permission): boolean {
  const session = getCurrentSession();
  if (!session) return false;
  return ROLE_PERMISSIONS[session.role]?.includes(permission) || false;
}
