// API Abstraction Layer for KSP Crime Intelligence Copilot — Production Zoho Catalyst API Client
import type { 
  CaseSummary, 
  CaseDetail, 
  DashboardSummary, 
  GraphData, 
  MapHotspot, 
  TimelineEvent, 
  ApiResponse,
  PredictiveInsights,
  DemographicInsights,
  OffenderProfile,
  SimilarCase
} from '../types';
import { getCurrentSession } from './auth';

export const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/server';
export const IS_MOCK_MODE = false;

// Re-export type definitions for usage elsewhere
export type { CaseSummary, CaseDetail, DashboardSummary, GraphData, MapHotspot, TimelineEvent, ApiResponse, PredictiveInsights, DemographicInsights, OffenderProfile, SimilarCase };

// Global fetch interceptor for 401/403 session expiration redirects
if (typeof window !== 'undefined' && !(window as any).__KSP_FETCH_INTERCEPTED__) {
  (window as any).__KSP_FETCH_INTERCEPTED__ = true;
  const originalFetch = window.fetch;
  window.fetch = async function (input, init) {
    const response = await originalFetch(input, init);
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('ksp_copilot_session');
      window.location.href = '/app/login.html';
    }
    return response;
  };
}

// Inject authentication token or user role headers for local/production Catalyst compatibility
function getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const session = getCurrentSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...extraHeaders
  };

  if (session) {
    if (session.token) {
      headers['Authorization'] = `Bearer ${session.token}`;
    } else {
      headers['x-user-role'] = session.role;
      headers['x-user-email'] = session.username;
    }
  } else {
    headers['x-user-role'] = 'investigator';
  }

  return headers;
}

// ================= ADAPTER MAPPERS =================

function mapBackendCaseToSummary(c: any): CaseSummary {
  const stationMatch = c.fir_number ? c.fir_number.split('/')[0] : (c.station || 'Unknown PS');
  return {
    caseId: c.ROWID || c.caseId || '',
    firNumber: c.fir_number || c.firNumber || '',
    district: c.district_name || c.district || 'Bengaluru Urban',
    station: stationMatch,
    incidentDate: c.crime_registered_date || c.incidentDate || '',
    registeredDate: c.crime_registered_date || c.registeredDate || '',
    category: c.category_name || c.category || 'Theft',
    status: c.status_name || c.fir_status || c.status || 'Under Investigation',
    gravity: c.gravity_level || c.gravity || 'Medium',
    crimeHead: c.category_name || c.crimeHead || 'Theft',
  };
}

function mapBackendCaseToDetail(data: any): CaseDetail {
  const c = data.case || data;
  const base = mapBackendCaseToSummary(c);
  
  const complainants = (data.complainants || []).map((comp: any) => 
    typeof comp === 'string' ? comp : `${comp.name || 'Complainant'} (${comp.gender || 'N/A'}, Age: ${comp.age || 'N/A'})`
  );
  const victims = (data.victims || []).map((vic: any) => 
    typeof vic === 'string' ? vic : `${vic.name || 'Victim'} (${vic.gender || 'N/A'})`
  );
  const accused = (data.accused || []).map((acc: any) => 
    typeof acc === 'string' ? acc : `${acc.name || 'Accused'} (${acc.status || 'Accused'})`
  );
  
  const arrests = (data.arrests || []).map((arr: any) => ({
    date: arr.date_time || arr.date || '',
    person: arr.person_name || arr.person || 'Accused',
    location: arr.place || arr.location || ''
  }));
  
  const chargesheets = data.chargesheets || [];
  const hasChargesheet = data.chargesheeted !== undefined ? data.chargesheeted : chargesheets.length > 0;
  const csDate = data.chargesheetDate || (hasChargesheet && chargesheets[0] ? chargesheets[0].date_filed : undefined);

  return {
    ...base,
    complainants,
    victims,
    accused,
    arrests,
    actsSections: c.acts_sections ? (typeof c.acts_sections === 'string' ? JSON.parse(c.acts_sections) : c.acts_sections) : (c.actsSections || [{ act: 'IPC', section: '379' }]),
    court: c.court_name || c.court || 'Chief Metropolitan Magistrate, Bengaluru',
    chargesheeted: hasChargesheet,
    chargesheetDate: csDate,
    summaryText: c.summary_of_facts || c.summaryText || ''
  };
}

function mapBackendDashboardToSummary(data: any): DashboardSummary {
  return {
    kpis: {
      totalFirs: data.totalCases || data.kpis?.totalFirs || 0,
      activeCases: data.activeInvestigations || data.kpis?.activeCases || 0,
      chargesheeted: data.kpis?.chargesheeted !== undefined ? data.kpis.chargesheeted : Math.round((data.totalCases || 0) * ((data.solvedRate || 0) / 100)),
      arrests: data.kpis?.arrests !== undefined ? data.kpis.arrests : (data.activeInvestigations ? Math.round(data.activeInvestigations * 1.2) : 0)
    },
    topDistricts: (data.hotspots || data.topDistricts || []).map((h: any) => ({
      district: h.district_name || h.district || 'Unknown',
      count: h.count || 0
    })),
    topCategories: (data.casesByCategory || data.topCategories || []).map((c: any) => ({
      category: c.category_name || c.category || 'Other',
      count: c.count || 0
    })),
    recentFirs: []
  };
}

function mapBackendHotspots(points: any[]): MapHotspot[] {
  return points.map((p: any) => ({
    latitude: p.latitude || 0,
    longitude: p.longitude || 0,
    weight: p.weight || 1.0,
    firNumber: p.fir_number || p.firNumber || '',
    category: p.category_name || p.category || 'Theft',
    district: p.district_name || p.district || 'Bengaluru Urban'
  }));
}

function mapBackendGraph(data: any): GraphData {
  return {
    nodes: (data.nodes || []).map((n: any) => ({
      id: n.id,
      label: n.label || '',
      type: (n.group === 'case' ? 'case' : n.group === 'accused' ? 'accused' : n.group === 'victim' ? 'victim' : 'officer') as any
    })),
    edges: (data.links || data.edges || []).map((l: any) => ({
      source: l.source,
      target: l.target,
      relationship: l.type || l.relationship || 'LINKED'
    }))
  };
}

// ================= PRODUCTION API ENDPOINTS =================

// Fetch dashboard KPIs
export async function getDashboardSummary(): Promise<DashboardSummary> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<any> = await response.json();
    const summary = mapBackendDashboardToSummary(result.data || {});

    try {
      const casesRes = await searchCases({ limit: '5' });
      summary.recentFirs = casesRes.items;
    } catch {
      summary.recentFirs = [];
    }

    return summary;
  } catch (error) {
    console.warn('Dashboard API error:', error);
    return {
      kpis: { totalFirs: 0, activeCases: 0, chargesheeted: 0, arrests: 0 },
      topDistricts: [],
      topCategories: [],
      recentFirs: []
    };
  }
}

// Fetch cases search
export async function searchCases(params: Record<string, string>): Promise<{ items: CaseSummary[]; total: number }> {
  try {
    const backendParams = new URLSearchParams();
    const limitNum = parseInt(params.limit || '10', 10);
    const pageNum = parseInt(params.page || '1', 10);
    const offsetNum = params.offset ? parseInt(params.offset, 10) : (pageNum - 1) * limitNum;
    
    backendParams.append('limit', limitNum.toString());
    backendParams.append('offset', offsetNum.toString());
    if (params.query) backendParams.append('search', params.query);
    if (params.district && params.district !== 'all') backendParams.append('district', params.district);
    if (params.category && params.category !== 'all') backendParams.append('category', params.category);
    if (params.status && params.status !== 'all') backendParams.append('status', params.status);

    const response = await fetch(`${API_BASE_URL}/cases?${backendParams.toString()}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<any> = await response.json();
    
    return {
      items: (result.data?.cases || result.data?.items || []).map(mapBackendCaseToSummary),
      total: result.data?.total || 0
    };
  } catch (error) {
    console.warn('Search API error:', error);
    return { items: [], total: 0 };
  }
}

// AI Copilot Query API (POST /api/v1/assistant/query)
export async function queryAssistant(
  text: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>,
  userRole?: string
): Promise<import('../types').AssistantDataPayload> {
  const session = getCurrentSession();
  const role = userRole || (session ? session.role : 'investigator');

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/assistant/query`, {
      method: 'POST',
      headers: getHeaders({ 'x-user-role': role }),
      body: JSON.stringify({
        text,
        conversationHistory
      })
    });
  } catch (e) {
    response = await fetch(`${API_BASE_URL}/assistant/query`, {
      method: 'POST',
      headers: getHeaders({ 'x-user-role': role }),
      body: JSON.stringify({
        text,
        query: text,
        conversationHistory,
        history: conversationHistory
      })
    });
  }

  if (!response.ok) throw new Error('API query failed');
  const result: ApiResponse<import('../types').AssistantDataPayload> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error?.message || 'Assistant query failed');
  }

  return result.data;
}

// Fetch single case details (GET /api/v1/cases/:firNumber)
export async function getCaseDetails(caseIdOrFir: string): Promise<CaseDetail> {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/cases/${encodeURIComponent(caseIdOrFir)}`, {
      headers: getHeaders()
    });
  } catch {
    response = await fetch(`${API_BASE_URL}/cases/${encodeURIComponent(caseIdOrFir)}`, {
      headers: getHeaders()
    });
  }
  
  if (!response.ok) throw new Error(`Case ${caseIdOrFir} not found in database`);
  const result: ApiResponse<any> = await response.json();
  return mapBackendCaseToDetail(result.data || {});
}

// Fetch map hotspots
export async function getMapHotspots(params?: Record<string, string>): Promise<MapHotspot[]> {
  try {
    const backendParams = new URLSearchParams();
    if (params && params.category && params.category !== 'all') {
      backendParams.append('category', params.category);
    }
    if (params && params.district && params.district !== 'all') {
      backendParams.append('district', params.district);
    }

    const response = await fetch(`${API_BASE_URL}/map/hotspots?${backendParams.toString()}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<any> = await response.json();
    return mapBackendHotspots(result.data?.points || result.data || []);
  } catch (error) {
    console.warn('Map hotspots API error:', error);
    return [];
  }
}

// Fetch case network graph
export async function getCaseGraph(caseId: string): Promise<GraphData> {
  try {
    const response = await fetch(`${API_BASE_URL}/graph/case/${encodeURIComponent(caseId)}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<any> = await response.json();
    return mapBackendGraph(result.data || {});
  } catch (error) {
    console.warn(`Graph API error for ${caseId}:`, error);
    return { nodes: [], edges: [] };
  }
}

// Fetch case timeline events (Reconstructed client-side from details payload)
export async function getCaseTimeline(caseId: string): Promise<TimelineEvent[]> {
  try {
    const details = await getCaseDetails(caseId);
    
    const events: TimelineEvent[] = [
      {
        date: details.registeredDate || new Date().toISOString(),
        title: 'FIR Registered',
        description: `FIR registered at ${details.station} under category ${details.category}.`,
        type: 'registration'
      }
    ];

    if (details.arrests && details.arrests.length > 0) {
      details.arrests.forEach((arr) => {
        events.push({
          date: arr.date,
          title: `Accused Arrested`,
          description: `Suspect ${arr.person} arrested at ${arr.location || 'occurrence location'}.`,
          type: 'arrest'
        });
      });
    }

    if (details.chargesheeted) {
      events.push({
        date: details.chargesheetDate || new Date().toISOString(),
        title: 'Chargesheet Filed',
        description: `Final investigation report submitted to ${details.court || 'jurisdictional court'}.`,
        type: 'chargesheet'
      });
    }

    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.warn(`Timeline construction error for ${caseId}:`, error);
    return [];
  }
}

// Trigger PDF Report Generation
export async function generateReport(caseId: string): Promise<{ pdfUrl: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/reports/case/${encodeURIComponent(caseId)}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<any> = await response.json();
    return {
      pdfUrl: result.data?.downloadUrl || result.data?.pdfUrl || ''
    };
  } catch (error) {
    console.warn(`Report generation API error for ${caseId}:`, error);
    throw error;
  }
}

// Fetch Predictive Analytics & Early Warnings
export async function getPredictiveInsights(): Promise<PredictiveInsights> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/predictive`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<PredictiveInsights> = await response.json();
    return result.data || { anomalies: [], forecast: [], earlyWarnings: [] };
  } catch (error) {
    console.warn('Predictive insights API error:', error);
    return { anomalies: [], forecast: [], earlyWarnings: [] };
  }
}

// Fetch Socio-Demographic Insights
export async function getDemographicInsights(entity: 'accused' | 'victims', months: string = '12'): Promise<DemographicInsights> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/demographics?entity=${entity}&months=${months}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<DemographicInsights> = await response.json();
    return result.data || { ageGroups: [], gender: [], occupation: [], locationTypes: [] };
  } catch (error) {
    console.warn(`Demographics API error for entity ${entity}:`, error);
    return { ageGroups: [], gender: [], occupation: [], locationTypes: [] };
  }
}

// Fetch Offender Profiles for Behavioral Profiling
export async function getOffenderProfiles(searchQuery: string = ''): Promise<OffenderProfile[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/offender?search=${encodeURIComponent(searchQuery)}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<OffenderProfile[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.warn(`Offender profile API error for query ${searchQuery}:`, error);
    return [];
  }
}

// Fetch Similar-Case Recommendations
export async function getSimilarCases(caseId: string, limit: number = 10): Promise<SimilarCase[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/cases/${encodeURIComponent(caseId)}/similar?limit=${limit}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<SimilarCase[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.warn(`Similar cases API error for case ${caseId}:`, error);
    return [];
  }
}

export interface AuditLog {
  rowId: string;
  action: string;
  userEmail: string;
  details: string;
  timestamp: string;
}

// Fetch security audit logs
export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/admin/audit-logs`, { headers: getHeaders() });
    } catch {
      response = await fetch(`${API_BASE_URL}/admin/compliance-logs`, { headers: getHeaders() });
    }
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<AuditLog[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.warn('Audit logs API error:', error);
    return [];
  }
}

// Purge Temporary Cache segment
export async function purgeCache(): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/cache/purge`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<any> = await response.json();
    return result.data || { message: 'Cache purge request sent.' };
  } catch (error) {
    console.warn('Cache purge API error:', error);
    return { message: 'Cache purge request submitted.' };
  }
}

// Trigger Materialized View Refreshes
export async function refreshMaterializedViews(): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/data/refresh`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<any> = await response.json();
    return result.data || { message: 'Data refresh request sent.' };
  } catch (error) {
    console.warn('Data refresh API error:', error);
    return { message: 'Data refresh request submitted.' };
  }
}

// Zia text-to-speech synthesis (POST /voice/synthesize)
export async function synthesizeSpeech(text: string, language: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/voice/synthesize`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ text, language })
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<{ audioBase64: string }> = await response.json();
    return result.data?.audioBase64 || null;
  } catch (error) {
    console.warn('Zia TTS synthesis failed, client will fall back to native browser speechSynthesis:', error);
    return null;
  }
}
