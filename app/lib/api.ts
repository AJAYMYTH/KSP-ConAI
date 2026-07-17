// API Abstraction Layer for KSP Crime Intelligence Copilot
import * as mock from './mockData';
import type { 
  CaseSummary, 
  CaseDetail, 
  DashboardSummary, 
  GraphData, 
  MapHotspot, 
  TimelineEvent, 
  ApiResponse 
} from '../types';

export const API_BASE_URL = import.meta.env.PUBLIC_API_URL || '';
// Default to mock mode (true) unless PUBLIC_MOCK_MODE is explicitly set to 'false'
export const IS_MOCK_MODE = import.meta.env.PUBLIC_MOCK_MODE !== 'false';

// Re-export type definitions for usage elsewhere
export type { CaseSummary, CaseDetail, DashboardSummary, GraphData, MapHotspot, TimelineEvent, ApiResponse };

// Fetch dashboard KPIs
export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (IS_MOCK_MODE) {
    return mock.MOCK_DASHBOARD;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`);
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<DashboardSummary> = await response.json();
    return result.data;
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
    const searchParams = new URLSearchParams(params);
    const response = await fetch(`${API_BASE_URL}/api/cases?${searchParams.toString()}`);
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<{ items: CaseSummary[]; total: number }> = await response.json();
    return result.data;
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
    const response = await fetch(`${API_BASE_URL}/api/cases/${caseId}`);
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<CaseDetail> = await response.json();
    return result.data;
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
    const searchParams = params ? new URLSearchParams(params) : '';
    const response = await fetch(`${API_BASE_URL}/api/map/hotspots?${searchParams.toString()}`);
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<MapHotspot[]> = await response.json();
    return result.data;
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
    const response = await fetch(`${API_BASE_URL}/api/graph/case/${caseId}`);
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<GraphData> = await response.json();
    return result.data;
  } catch (error) {
    console.warn(`Graph API failed for ${caseId}, using mock graph:`, error);
    return mock.MOCK_GRAPHS[caseId] || mock.DEFAULT_GRAPH;
  }
}

// Fetch case timeline events
export async function getCaseTimeline(caseId: string): Promise<TimelineEvent[]> {
  if (IS_MOCK_MODE) {
    return mock.MOCK_TIMELINES[caseId] || [];
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/cases/${caseId}/timeline`);
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<TimelineEvent[]> = await response.json();
    return result.data;
  } catch (error) {
    console.warn(`Timeline API failed for ${caseId}, using reconstructed timeline:`, error);
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
    const response = await fetch(`${API_BASE_URL}/api/reports/case/${caseId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('API Error');
    const result: ApiResponse<{ pdfUrl: string }> = await response.json();
    return result.data;
  } catch (error) {
    console.warn(`Report generation API failed for ${caseId}, returning mock URL:`, error);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      pdfUrl: `/reports/pdf_mock_${caseId}.pdf`
    };
  }
}
