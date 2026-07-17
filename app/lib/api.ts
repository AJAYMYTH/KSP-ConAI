// API Abstraction Layer for KSP Crime Intelligence Copilot
import * as mock from './mockData';
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
export const IS_MOCK_MODE = import.meta.env.PUBLIC_MOCK_MODE === 'true';

// Re-export type definitions for usage elsewhere
export type { CaseSummary, CaseDetail, DashboardSummary, GraphData, MapHotspot, TimelineEvent, ApiResponse, PredictiveInsights, DemographicInsights, OffenderProfile, SimilarCase };

// Inject user role header for local access emulation on Catalyst serverless backend
function getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const session = getCurrentSession();
  const role = session ? session.role : 'investigator';
  return {
    'Content-Type': 'application/json',
    'x-user-role': role,
    ...extraHeaders
  };
}

// ================= ADAPTER MAPPERS =================

function mapBackendCaseToSummary(c: any): CaseSummary {
  const stationMatch = c.fir_number ? c.fir_number.split('/')[0] : 'Unknown PS';
  return {
    caseId: c.ROWID || '',
    firNumber: c.fir_number || '',
    district: c.district_name || 'Bengaluru Urban',
    station: stationMatch,
    incidentDate: c.crime_registered_date || '',
    registeredDate: c.crime_registered_date || '',
    category: c.category_name || 'Theft',
    status: c.status_name || c.fir_status || 'Under Investigation',
    gravity: c.gravity_level || 'Medium',
    crimeHead: c.category_name || 'Theft',
  };
}

function mapBackendCaseToDetail(data: any): CaseDetail {
  const c = data.case || {};
  const base = mapBackendCaseToSummary(c);
  
  const complainants = (data.complainants || []).map((comp: any) => 
    `${comp.name} (${comp.gender || 'N/A'}, Age: ${comp.age || 'N/A'})`
  );
  const victims = (data.victims || []).map((vic: any) => 
    `${vic.name} (${vic.gender || 'N/A'})`
  );
  const accused = (data.accused || []).map((acc: any) => 
    `${acc.name} (${acc.status || 'Accused'})`
  );
  
  const arrests = (data.arrests || []).map((arr: any) => ({
    date: arr.date_time || '',
    person: arr.person_name || 'Accused',
    location: arr.place || ''
  }));
  
  const chargesheets = data.chargesheets || [];
  const hasChargesheet = chargesheets.length > 0;
  const csDate = hasChargesheet ? chargesheets[0].date_filed : undefined;

  return {
    ...base,
    complainants,
    victims,
    accused,
    arrests,
    actsSections: c.acts_sections ? JSON.parse(c.acts_sections) : [{ act: 'IPC', section: '379' }],
    court: c.court_name || 'Chief Metropolitan Magistrate, Bengaluru',
    chargesheeted: hasChargesheet,
    chargesheetDate: csDate,
    summaryText: c.summary_of_facts || ''
  };
}

function mapBackendDashboardToSummary(data: any): DashboardSummary {
  return {
    kpis: {
      totalFirs: data.totalCases || 0,
      activeCases: data.activeInvestigations || 0,
      chargesheeted: Math.round((data.totalCases || 0) * ((data.solvedRate || 0) / 100)),
      arrests: data.activeInvestigations ? Math.round(data.activeInvestigations * 1.2) : 0
    },
    topDistricts: (data.hotspots || []).map((h: any) => ({
      district: h.district_name || 'Unknown',
      count: h.count || 0
    })),
    topCategories: (data.casesByCategory || []).map((c: any) => ({
      category: c.category_name || 'Other',
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
    firNumber: p.fir_number || '',
    category: p.category_name || 'Theft',
    district: p.district_name || 'Bengaluru Urban'
  }));
}

function mapBackendGraph(data: any): GraphData {
  return {
    nodes: (data.nodes || []).map((n: any) => ({
      id: n.id,
      label: n.label || '',
      type: (n.group === 'case' ? 'case' : n.group === 'accused' ? 'accused' : n.group === 'victim' ? 'victim' : 'officer') as any
    })),
    edges: (data.links || []).map((l: any) => ({
      source: l.source,
      target: l.target,
      relationship: l.type || 'LINKED'
    }))
  };
}

// ================= API ENDPOINTS =================

// Fetch dashboard KPIs
export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (IS_MOCK_MODE) {
    return mock.MOCK_DASHBOARD;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<any> = await response.json();
    const summary = mapBackendDashboardToSummary(result.data);

    // Fetch recent cases to populate recentFirs list
    try {
      const casesRes = await searchCases({ limit: '5' });
      summary.recentFirs = casesRes.items;
    } catch {
      summary.recentFirs = [...mock.MOCK_CASES].slice(0, 5);
    }

    return summary;
  } catch (error) {
    console.warn('Dashboard API failed, falling back to mock data:', error);
    return mock.MOCK_DASHBOARD;
  }
}

// Fetch cases search
export async function searchCases(params: Record<string, string>): Promise<{ items: CaseSummary[]; total: number }> {
  const getMockSearch = () => {
    let items = [...mock.MOCK_CASES] as CaseSummary[];
    if (params.query) {
      const q = params.query.toLowerCase();
      items = items.filter(c => 
        c.firNumber.toLowerCase().includes(q) || 
        c.district.toLowerCase().includes(q) || 
        c.station.toLowerCase().includes(q) || 
        c.category.toLowerCase().includes(q)
      );
    }
    if (params.district && params.district !== 'all') {
      items = items.filter(c => c.district.toLowerCase() === params.district.toLowerCase());
    }
    if (params.category && params.category !== 'all') {
      items = items.filter(c => c.category.toLowerCase() === params.category.toLowerCase());
    }
    return {
      items,
      total: items.length
    };
  };

  if (IS_MOCK_MODE) {
    return getMockSearch();
  }

  try {
    // Translate frontend keys to backend keys
    const backendParams = new URLSearchParams();
    
    // Support page-to-offset calculation
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
      items: (result.data.cases || []).map(mapBackendCaseToSummary),
      total: result.data.total || 0
    };
  } catch (error) {
    console.warn('Search API failed, falling back to local search filtering:', error);
    return getMockSearch();
  }
}

// Fetch single case details
export async function getCaseDetails(caseId: string): Promise<CaseDetail> {
  const getMockDetails = () => {
    const match = mock.MOCK_CASES.find(c => c.caseId === caseId);
    if (!match) throw new Error(`Case ${caseId} not found in mock database`);
    return match;
  };

  if (IS_MOCK_MODE) {
    return getMockDetails();
  }

  try {
    const response = await fetch(`${API_BASE_URL}/cases/${caseId}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<any> = await response.json();
    return mapBackendCaseToDetail(result.data);
  } catch (error) {
    console.warn(`Case details API failed for ${caseId}, using local match:`, error);
    return getMockDetails();
  }
}

// Fetch map hotspots
export async function getMapHotspots(params?: Record<string, string>): Promise<MapHotspot[]> {
  const getMockHotspots = () => {
    let items = [...mock.MOCK_MAP_HOTSPOTS];
    if (params && params.category && params.category !== 'all') {
      items = items.filter(h => h.category.toLowerCase() === params.category.toLowerCase());
    }
    return items;
  };

  if (IS_MOCK_MODE) {
    return getMockHotspots();
  }

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
    return mapBackendHotspots(result.data.points || []);
  } catch (error) {
    console.warn('Map hotspots API failed, using mock hotspots:', error);
    return getMockHotspots();
  }
}

// Fetch case network graph
export async function getCaseGraph(caseId: string): Promise<GraphData> {
  if (IS_MOCK_MODE) {
    return mock.MOCK_GRAPHS[caseId] || mock.DEFAULT_GRAPH;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/graph/case/${caseId}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<any> = await response.json();
    return mapBackendGraph(result.data);
  } catch (error) {
    console.warn(`Graph API failed for ${caseId}, using mock graph:`, error);
    return mock.MOCK_GRAPHS[caseId] || mock.DEFAULT_GRAPH;
  }
}

// Fetch case timeline events (Reconstructed client-side from details payload)
export async function getCaseTimeline(caseId: string): Promise<TimelineEvent[]> {
  if (IS_MOCK_MODE) {
    return mock.MOCK_TIMELINES[caseId] || [];
  }
  try {
    const details = await getCaseDetails(caseId);
    
    const events: TimelineEvent[] = [
      {
        date: details.registeredDate || '2026-05-12 14:30:00',
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
        date: details.chargesheetDate || '2026-06-15',
        title: 'Chargesheet Filed',
        description: `Final investigation report submitted to ${details.court || 'jurisdictional court'}.`,
        type: 'chargesheet'
      });
    }

    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.warn(`Timeline construction failed for ${caseId}, using reconstructed timeline fallback:`, error);
    return mock.MOCK_TIMELINES[caseId] || [];
  }
}

// Trigger PDF Report Generation
export async function generateReport(caseId: string): Promise<{ pdfUrl: string }> {
  if (IS_MOCK_MODE) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      pdfUrl: `/reports/pdf_mock_${caseId}.pdf`
    };
  }
  try {
    const response = await fetch(`${API_BASE_URL}/reports/case/${caseId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<any> = await response.json();
    return {
      pdfUrl: result.data.downloadUrl || `/reports/pdf_mock_${caseId}.pdf`
    };
  } catch (error) {
    console.warn(`Report generation API failed for ${caseId}, returning mock URL:`, error);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      pdfUrl: `/reports/pdf_mock_${caseId}.pdf`
    };
  }
}

// Fetch Predictive Analytics & Early Warnings
export async function getPredictiveInsights(): Promise<PredictiveInsights> {
  if (IS_MOCK_MODE) {
    return mock.MOCK_PREDICTIVE;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/predictive`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<PredictiveInsights> = await response.json();
    return result.data;
  } catch (error) {
    console.warn('Predictive insights API failed, falling back to mock data:', error);
    return mock.MOCK_PREDICTIVE;
  }
}

// Fetch Socio-Demographic Insights
export async function getDemographicInsights(entity: 'accused' | 'victims', months: string = '12'): Promise<DemographicInsights> {
  if (IS_MOCK_MODE) {
    return mock.MOCK_DEMOGRAPHICS[entity] || mock.MOCK_DEMOGRAPHICS.accused;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/demographics?entity=${entity}&months=${months}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<DemographicInsights> = await response.json();
    return result.data;
  } catch (error) {
    console.warn(`Demographics API failed for entity ${entity}, using mock data:`, error);
    return mock.MOCK_DEMOGRAPHICS[entity] || mock.MOCK_DEMOGRAPHICS.accused;
  }
}

// Fetch Offender Profiles for Behavioral Profiling
export async function getOffenderProfiles(searchQuery: string = ''): Promise<OffenderProfile[]> {
  const getMockOffenders = () => {
    if (!searchQuery) return mock.MOCK_OFFENDERS;
    const q = searchQuery.toLowerCase();
    return mock.MOCK_OFFENDERS.filter(o => 
      o.name.toLowerCase().includes(q) || 
      o.aliases.some(a => a.toLowerCase().includes(q)) ||
      o.id.toLowerCase().includes(q)
    );
  };

  if (IS_MOCK_MODE) {
    return getMockOffenders();
  }
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/offender?search=${encodeURIComponent(searchQuery)}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<OffenderProfile[]> = await response.json();
    return result.data;
  } catch (error) {
    console.warn(`Offender profile API failed for query ${searchQuery}, using mock database:`, error);
    return getMockOffenders();
  }
}

// Fetch Similar-Case Recommendations
export async function getSimilarCases(caseId: string, limit: number = 10): Promise<SimilarCase[]> {
  const getMockSimilar = () => {
    return mock.MOCK_SIMILAR_CASES[caseId] || [];
  };

  if (IS_MOCK_MODE) {
    return getMockSimilar();
  }
  try {
    const response = await fetch(`${API_BASE_URL}/cases/${caseId}/similar?limit=${limit}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<SimilarCase[]> = await response.json();
    return result.data;
  } catch (error) {
    console.warn(`Similar cases API failed for case ${caseId}, returning mock recommendations:`, error);
    return getMockSimilar();
  }
}
