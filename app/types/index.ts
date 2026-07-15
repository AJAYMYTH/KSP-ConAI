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
  nodes: { id: string; label: string; type: 'case' | 'accused' | 'victim' | 'station' | 'officer' }[];
  edges: { source: string; target: string; relationship: string }[];
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
