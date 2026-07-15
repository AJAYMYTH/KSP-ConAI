/**
 * constants.js
 *
 * Defines system roles, permissions, role-permission mapping, a whitelist of tables, views,
 * and columns to prevent SQL injection in ZCQL query builder, standard error codes, and system constants.
 * NodeJS 20 compatible.
 */

// User Roles
const ROLES = {
  ADMIN: 'admin',
  INVESTIGATOR: 'investigator',
  ANALYST: 'analyst',
  VIEWER: 'viewer'
};

// Permissions
const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_CASES: 'view_cases',
  VIEW_PII: 'view_pii', // Personal Identifiable Information (restricted for Viewer)
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_MAP: 'view_map',
  VIEW_GRAPH: 'view_graph',
  VIEW_TIMELINE: 'view_timeline',
  USE_ASSISTANT: 'use_assistant',
  GENERATE_REPORT: 'generate_report',
  ADMIN_PRIVILEGES: 'admin_privileges',
  MANAGE_CACHE: 'manage_cache',
  REFRESH_DATA: 'refresh_data'
};

// Role-to-Permissions Mapping
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.INVESTIGATOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CASES,
    PERMISSIONS.VIEW_PII,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_MAP,
    PERMISSIONS.VIEW_GRAPH,
    PERMISSIONS.VIEW_TIMELINE,
    PERMISSIONS.USE_ASSISTANT,
    PERMISSIONS.GENERATE_REPORT
  ],
  [ROLES.ANALYST]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CASES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_MAP,
    PERMISSIONS.VIEW_GRAPH,
    PERMISSIONS.VIEW_TIMELINE,
    PERMISSIONS.USE_ASSISTANT
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_CASES,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_MAP,
    PERMISSIONS.VIEW_TIMELINE,
    PERMISSIONS.USE_ASSISTANT
  ]
};

// Whitelist of allowed tables for ZCQL Query Builder
const ALLOWED_TABLES = {
  // Master Tables
  State: 'State',
  District: 'District',
  UnitType: 'UnitType',
  Unit: 'Unit',
  Rank: 'Rank',
  Designation: 'Designation',
  Employee: 'Employee',
  Court: 'Court',
  CaseStatusMaster: 'CaseStatusMaster',
  GravityOffence: 'GravityOffence',
  CaseCategory: 'CaseCategory',
  CrimeHead: 'CrimeHead',
  CrimeSubHead: 'CrimeSubHead',
  Act: 'Act',
  Section: 'Section',
  CrimeHeadActSection: 'CrimeHeadActSection',
  OccupationMaster: 'OccupationMaster',
  ReligionMaster: 'ReligionMaster',
  CasteMaster: 'CasteMaster',
  UserRole: 'UserRole',

  // Transaction Tables
  CaseMaster: 'CaseMaster',
  ComplainantDetails: 'ComplainantDetails',
  Victim: 'Victim',
  Accused: 'Accused',
  ArrestSurrender: 'ArrestSurrender',
  ChargesheetDetails: 'ChargesheetDetails',
  ActSectionAssociation: 'ActSectionAssociation',
  GeneratedReports: 'GeneratedReports',
  AuditLog: 'AuditLog'
};

// Whitelist of allowed views for ZCQL Query Builder
const ALLOWED_VIEWS = {
  vw_case_summary: 'vw_case_summary',
  vw_case_by_district: 'vw_case_by_district',
  vw_case_by_category: 'vw_case_by_category',
  vw_case_by_status: 'vw_case_by_status',
  vw_case_hotspots: 'vw_case_hotspots',
  vw_accused_network: 'vw_accused_network',
  vw_case_timeline: 'vw_case_timeline',
  vw_repeat_offenders: 'vw_repeat_offenders'
};

// Whitelist of allowed columns per table/view
const ALLOWED_COLUMNS = {
  State: ['ROWID', 'state_name'],
  District: ['ROWID', 'district_name', 'state_id'],
  UnitType: ['ROWID', 'unit_type_name'],
  Unit: ['ROWID', 'unit_name', 'unit_type_id', 'district_id'],
  Rank: ['ROWID', 'rank_name'],
  Designation: ['ROWID', 'designation_name'],
  Employee: ['ROWID', 'employee_name', 'rank_id', 'designation_id', 'unit_id', 'badge_number'],
  Court: ['ROWID', 'court_name', 'district_id'],
  CaseStatusMaster: ['ROWID', 'status_name'],
  GravityOffence: ['ROWID', 'gravity_name'],
  CaseCategory: ['ROWID', 'category_name'],
  CrimeHead: ['ROWID', 'crime_head_name'],
  CrimeSubHead: ['ROWID', 'crime_sub_head_name', 'crime_head_id'],
  Act: ['ROWID', 'act_name', 'act_description'],
  Section: ['ROWID', 'section_number', 'section_description', 'act_id'],
  CrimeHeadActSection: ['ROWID', 'crime_head_id', 'crime_sub_head_id', 'act_id', 'section_id'],
  OccupationMaster: ['ROWID', 'occupation_name'],
  ReligionMaster: ['ROWID', 'religion_name'],
  CasteMaster: ['ROWID', 'caste_name'],
  UserRole: ['ROWID', 'user_id', 'role'],

  CaseMaster: [
    'ROWID', 'fir_number', 'crime_registered_date', 'incident_from_date', 'incident_to_date',
    'info_received_date', 'latitude', 'longitude', 'case_category_id', 'gravity_offence_id',
    'crime_head_id', 'crime_sub_head_id', 'case_status_id', 'court_id', 'district_id',
    'state_id', 'unit_id', 'registering_officer_id', 'place_of_occurrence', 'summary_of_facts',
    'fir_status'
  ],
  ComplainantDetails: [
    'ROWID', 'case_id', 'name', 'age', 'gender', 'phone', 'address',
    'occupation_id', 'religion_id', 'caste_id'
  ],
  Victim: [
    'ROWID', 'case_id', 'name', 'age', 'gender', 'injury_type', 'phone', 'address',
    'occupation_id', 'religion_id', 'caste_id'
  ],
  Accused: [
    'ROWID', 'case_id', 'system_accused_id', 'name', 'alias_name', 'age', 'gender', 'address',
    'occupation_id', 'religion_id', 'caste_id', 'status'
  ],
  ArrestSurrender: [
    'ROWID', 'case_id', 'accused_id', 'event_type', 'date_time', 'place', 'arresting_officer_id', 'remarks'
  ],
  ChargesheetDetails: [
    'ROWID', 'case_id', 'chargesheet_number', 'date_filed', 'submitting_officer_id', 'court_id',
    'summary_of_evidence', 'final_report_type'
  ],
  ActSectionAssociation: [
    'ROWID', 'case_id', 'act_id', 'section_id'
  ],
  GeneratedReports: [
    'ROWID', 'case_id', 'report_name', 'file_path', 'generated_at', 'generated_by'
  ],
  AuditLog: [
    'ROWID', 'user_id', 'action', 'table_name', 'record_id', 'timestamp', 'details'
  ],

  // Views
  vw_case_summary: [
    'ROWID', 'fir_number', 'crime_registered_date', 'incident_from_date', 'incident_to_date',
    'info_received_date', 'latitude', 'longitude', 'category_name', 'gravity_name',
    'crime_head_name', 'crime_sub_head_name', 'status_name', 'court_name', 'district_name',
    'state_name', 'unit_name', 'employee_name', 'place_of_occurrence', 'summary_of_facts',
    'fir_status', 'case_age_days', 'is_chargesheeted', 'is_active_case', 'incident_month',
    'incident_week', 'district_group', 'severity_bucket'
  ],
  vw_case_by_district: [
    'district_name', 'case_count', 'trend_percentage'
  ],
  vw_case_by_category: [
    'category_name', 'case_count'
  ],
  vw_case_by_status: [
    'status_name', 'case_count'
  ],
  vw_case_hotspots: [
    'ROWID', 'fir_number', 'latitude', 'longitude', 'category_name', 'severity_bucket'
  ],
  vw_accused_network: [
    'case_id', 'fir_number', 'accused_id', 'accused_name', 'associated_accused_id', 'associated_accused_name', 'connection_type'
  ],
  vw_case_timeline: [
    'case_id', 'event_name', 'event_date', 'event_details', 'delay_days'
  ],
  vw_repeat_offenders: [
    'system_accused_id', 'accused_name', 'case_count', 'case_list', 'repeat_offender_score'
  ]
};

// Sensitive fields to redact for VIEWER and ANALYST roles
const SENSITIVE_FIELDS = {
  PII: {
    ComplainantDetails: ['name', 'phone', 'address'],
    Victim: ['name', 'phone', 'address'],
    Accused: ['name', 'alias_name', 'address']
  }
};

// Standard Case Statuses
const CASE_STATUSES = {
  UNDER_INVESTIGATION: 'Under Investigation',
  CHARGESHEETED: 'Chargesheeted',
  UNTRACEABLE: 'Untraceable',
  MISTAKE_OF_FACT: 'Mistake of Fact',
  ABATED: 'Abated'
};

// Accused Statuses
const ACCUSED_STATUSES = {
  ABSCONDING: 'Absconding',
  ARRESTED: 'Arrested',
  BAILED: 'Bailed',
  SURRENDERED: 'Surrendered',
  SUSPECT: 'Suspect'
};

// Gravity of Offences
const GRAVITY_OFFENCES = {
  HEINOUS: 'Heinous',
  NON_HEINOUS: 'Non-Heinous'
};

// Standard Error Codes and Statuses
const ERROR_CODES = {
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Authentication session is invalid, missing, or expired.',
    statusCode: 401
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: 'You do not have the required permissions to perform this action.',
    statusCode: 403
  },
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'The requested resource was not found.',
    statusCode: 404
  },
  BAD_REQUEST: {
    code: 'BAD_REQUEST',
    message: 'The request parameters or body are invalid.',
    statusCode: 400
  },
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please slow down.',
    statusCode: 429
  },
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected internal error occurred.',
    statusCode: 500
  },
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    message: 'Database query execution failed.',
    statusCode: 500
  },
  AI_ERROR: {
    code: 'AI_ERROR',
    message: 'AI service (QuickML/Zia) failed to respond or returned an error.',
    statusCode: 502
  }
};

// Cache TTL Guidance (in milliseconds)
const CACHE_TTL = {
  DASHBOARD: 10 * 60 * 1000,      // 10 minutes
  ANALYTICS: 15 * 60 * 1000,      // 15 minutes
  MAP_HOTSPOTS: 15 * 60 * 1000,   // 15 minutes
  REPEAT_OFFENDERS: 30 * 60 * 1000, // 30 minutes
  ASSISTANT_SQL: 2 * 60 * 1000    // 2 minutes (short TTL)
};

module.exports = {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ALLOWED_TABLES,
  ALLOWED_VIEWS,
  ALLOWED_COLUMNS,
  SENSITIVE_FIELDS,
  CASE_STATUSES,
  ACCUSED_STATUSES,
  GRAVITY_OFFENCES,
  ERROR_CODES,
  CACHE_TTL
};
