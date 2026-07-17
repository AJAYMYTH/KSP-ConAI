// TypeScript interfaces for KSP Crime Intelligence Copilot

export interface CaseSummary {
  caseId: string;
  firNumber: string;
  district: string;
  station: string;
  incidentDate: string;
  registeredDate: string;
  category: string;
  status: string;
  gravity: string;
  crimeHead: string;
}

export interface CaseDetail extends CaseSummary {
  complainants: string[];
  victims: string[];
  accused: string[];
  arrests: { date: string; person: string; location: string }[];
  actsSections: { act: string; section: string }[];
  court: string;
  chargesheeted: boolean;
  chargesheetDate?: string;
  summaryText?: string;
}

export interface DashboardSummary {
  kpis: {
    totalFirs: number;
    activeCases: number;
    chargesheeted: number;
    arrests: number;
  };
  topDistricts: { district: string; count: number }[];
  topCategories: { category: string; count: number }[];
  recentFirs: CaseSummary[];
}

export interface GraphData {
  nodes: { id: string; label: string; type: 'case' | 'accused' | 'victim' | 'witness' | 'station' | 'location' | 'phone' | 'vehicle' | 'bank' | 'organization' }[];
  edges: { source: string; target: string; relationship: string }[];
}

export interface PredictiveInsights {
  anomalies: {
    id: string;
    title: string;
    description: string;
    gravity: 'high' | 'medium' | 'low';
    district: string;
    deviationPercentage: number;
  }[];
  forecast: {
    date: string;
    actualCount?: number;
    predictedCount: number;
    confidenceLower: number;
    confidenceUpper: number;
  }[];
  earlyWarnings: {
    id: string;
    metric: string;
    value: string;
    alertLevel: 'critical' | 'warning' | 'info';
    relevance: string;
  }[];
}

export interface DemographicInsights {
  ageGroups: { group: string; count: number }[];
  gender: { label: string; value: number }[];
  occupation: { label: string; count: number }[];
  locationTypes: { type: string; count: number }[];
}

export interface OffenderProfile {
  id: string;
  name: string;
  aliases: string[];
  age: number;
  gender: string;
  recidivismScore: number;
  moSummary: string;
  knownAssociates: string[];
  casesAssociated: { caseId: string; role: string; date: string }[];
  status: 'active' | 'in_custody' | 'absconding';
}

export interface MapHotspot {
  latitude: number;
  longitude: number;
  weight: number;
  firNumber: string;
  category: string;
  district: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'incident' | 'registration' | 'arrest' | 'chargesheet' | 'court';
  delayDays?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface SimilarCase {
  caseId: string;
  firNumber: string;
  district: string;
  category: string;
  status: string;
  similarityScore: number;
  matchReason: string;
}
