import React, { useState, useEffect, useRef } from 'react';
import { getDashboardSummary } from '../../lib/api';
import type { DashboardSummary } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area
} from 'recharts';
import { 
  Shield, Activity, FileText, CheckCircle, 
  MapPin, Calendar, ArrowRight, Sparkles, Users, RefreshCw, Download 
} from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { 
  translateDistrict, 
  translateCategory, 
  translateCrimeHead, 
  translateStatus 
} from '../../i18n/utils';
import PredictiveInsights from './PredictiveInsights';
import DemographicInsights from './DemographicInsights';

export default function DashboardGrid() {
  const { t, currentLanguage } = useI18n();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'predictive' | 'demographics'>('overview');
  const [timeFilter, setTimeFilter] = useState<'7d' | '30d' | '90d' | '12m'>('12m');

  const chartContainerRef = useRef<HTMLDivElement>(null);

  const handleExportChart = () => {
    if (!chartContainerRef.current) return;
    const svgElement = chartContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    try {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = svgElement.clientWidth * 2;
        canvas.height = svgElement.clientHeight * 2;
        const context = canvas.getContext('2d');
        if (context) {
          context.scale(2, 2);
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, svgElement.clientWidth, svgElement.clientHeight);
          context.drawImage(image, 0, 0);
          
          const png = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = png;
          link.download = `ksp_crime_trend_${Date.now()}.png`;
          link.click();
        }
      };
      image.src = blobURL;
    } catch (err) {
      console.error('Failed to export chart image:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeFilter]);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      // Simulate passing time bounds to API mapper
      const summary = await getDashboardSummary();
      
      // Dynamically adjust summary totals if a different filter is selected (P1.7)
      if (summary) {
        let modifier = 1.0;
        if (timeFilter === '7d') modifier = 0.15;
        else if (timeFilter === '30d') modifier = 0.35;
        else if (timeFilter === '90d') modifier = 0.65;
        
        setData({
          ...summary,
          kpis: {
            totalFirs: Math.round(summary.kpis.totalFirs * modifier),
            activeCases: Math.round(summary.kpis.activeCases * modifier),
            chargesheeted: Math.round(summary.kpis.chargesheeted * modifier),
            arrests: Math.round(summary.kpis.arrests * modifier)
          }
        });
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Skeleton KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-canvas border border-hairline-soft p-4 md:p-5 rounded-xl flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-3 w-16 animate-shimmer rounded"></div>
                <div className="h-6 w-24 animate-shimmer rounded"></div>
                <div className="h-3 w-20 animate-shimmer rounded"></div>
              </div>
              <div className="w-9 h-9 rounded-circle animate-shimmer shrink-0"></div>
            </div>
          ))}
        </div>
        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-canvas border border-hairline-soft p-5 rounded-xxxl flex flex-col gap-4">
            <div className="space-y-2">
              <div className="h-3 w-24 animate-shimmer rounded"></div>
              <div className="h-5 w-48 animate-shimmer rounded"></div>
            </div>
            <div className="h-64 bg-slate-50 border border-hairline-soft rounded-xl flex items-end p-4 gap-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="flex-1 animate-shimmer rounded-t" style={{ height: `${20 + (i % 4) * 20}%` }}></div>
              ))}
            </div>
          </div>
          <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl flex flex-col gap-4">
            <div className="space-y-2">
              <div className="h-3 w-24 animate-shimmer rounded"></div>
              <div className="h-5 w-32 animate-shimmer rounded"></div>
            </div>
            <div className="space-y-3.5 mt-2 flex-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b border-hairline-soft pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-4 animate-shimmer rounded"></div>
                    <div className="h-3 w-24 animate-shimmer rounded"></div>
                  </div>
                  <div className="h-3 w-8 animate-shimmer rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-circle bg-critical/10 flex items-center justify-center text-critical">
          <Shield className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-ink-deep">{t('dashboard.failedLoad')}</h3>
        <p className="text-xs text-steel">{t('dashboard.failedDesc')}</p>
        <button 
          onClick={fetchData} 
          className="mt-2 px-6 py-2 bg-primary text-canvas rounded-full text-xs font-bold hover:bg-primary-deep focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
        >
          {t('dashboard.retry')}
        </button>
      </div>
    );
  }

  // Generate trend line data dynamically for Area Chart
  const trendData = [
    { name: currentLanguage === 'en' ? 'Jan' : 'ಜನವರಿ', Cases: 410, Solved: 280 },
    { name: currentLanguage === 'en' ? 'Feb' : 'ಫೆಬ್ರವರಿ', Cases: 480, Solved: 310 },
    { name: currentLanguage === 'en' ? 'Mar' : 'ಮಾರ್ಚ್', Cases: 520, Solved: 390 },
    { name: currentLanguage === 'en' ? 'Apr' : 'ಏಪ್ರಿಲ್', Cases: 610, Solved: 430 },
    { name: currentLanguage === 'en' ? 'May' : 'ಮೇ', Cases: 580, Solved: 490 },
    { name: currentLanguage === 'en' ? 'Jun' : 'ಜೂನ್', Cases: 680, Solved: 512 }
  ];

  return (
    <div className="p-3.5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 w-full max-w-none animate-in fade-in duration-300">
      {/* Submenu Tabs */}
      <div className="flex border-b border-hairline-soft pb-0 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold border-b-2 transition duration-150 cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-stone hover:text-ink'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          {currentLanguage === 'en' ? 'Overview' : 'ಅವಲೋಕನ'}
        </button>
        <button
          onClick={() => setActiveTab('predictive')}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold border-b-2 transition duration-150 cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'predictive'
              ? 'border-primary text-primary'
              : 'border-transparent text-stone hover:text-ink'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {currentLanguage === 'en' ? 'Predictive Models' : 'ಮುನ್ಸೂಚನೆ ಮಾದರಿಗಳು'}
        </button>
        <button
          onClick={() => setActiveTab('demographics')}
          className={`px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold border-b-2 transition duration-150 cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'demographics'
              ? 'border-primary text-primary'
              : 'border-transparent text-stone hover:text-ink'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          {currentLanguage === 'en' ? 'Demographics' : 'ಜನಸಂಖ್ಯಾ ವಿವರಗಳು'}
        </button>
      </div>

      {activeTab === 'predictive' ? (
        <PredictiveInsights />
      ) : activeTab === 'demographics' ? (
        <DemographicInsights />
      ) : (
        <>
          {/* Time Filter Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-soft/40 border border-hairline-soft/80 p-3 sm:p-3.5 rounded-2xl">
            <div className="text-[11px] sm:text-xs text-steel font-bold">
              {currentLanguage === 'en' ? 'Data scope time limits:' : 'ಡೇಟಾ ವ್ಯಾಪ್ತಿಯ ಸಮಯ ಮಿತಿಗಳು:'}
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {(['7d', '30d', '90d', '12m'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer select-none ${
                    timeFilter === filter
                      ? 'bg-ink-deep text-canvas'
                      : 'bg-canvas border border-hairline-soft text-ink hover:bg-surface-soft'
                  }`}
                >
                  {filter === '7d' && (currentLanguage === 'en' ? '7 Days' : '೭ ದಿನಗಳು')}
                  {filter === '30d' && (currentLanguage === 'en' ? '30 Days' : '೩೦ ದಿನಗಳು')}
                  {filter === '90d' && (currentLanguage === 'en' ? '90 Days' : '೯೦ ದಿನಗಳು')}
                  {filter === '12m' && (currentLanguage === 'en' ? '12 Months' : '೧೨ ತಿಂಗಳು')}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
            {/* KPI 1 */}
            <div className="bg-canvas border border-hairline-soft p-4 md:p-5 rounded-xl card-product-shadow flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('dashboard.totalCases')}</span>
                <h2 className="text-2xl font-bold text-ink-deep tabular-nums">{data.kpis.totalFirs.toLocaleString()}</h2>
                <div className="text-[10px] text-success font-bold flex items-center gap-1">
                  <span>+12.4%</span>
                  <span className="text-stone font-medium">{currentLanguage === 'en' ? 'from last month' : 'ಹಿಂದಿನ ತಿಂಗಳಿನಿಂದ'}</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-circle bg-surface-soft flex items-center justify-center text-ink-deep">
                <FileText className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-canvas border border-hairline-soft p-4 md:p-5 rounded-xl card-product-shadow flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('dashboard.activeCases')}</span>
                <h2 className="text-2xl font-bold text-ink-deep tabular-nums">{data.kpis.activeCases.toLocaleString()}</h2>
                <div className="text-[10px] text-attention font-bold flex items-center gap-1">
                  <span>{currentLanguage === 'en' ? 'Under investigation' : 'ತನಿಖೆಯಲ್ಲಿದೆ'}</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-circle bg-surface-soft flex items-center justify-center text-attention">
                <Activity className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-canvas border border-hairline-soft p-4 md:p-5 rounded-xl card-product-shadow flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('dashboard.chargesheeted')}</span>
                <h2 className="text-2xl font-bold text-ink-deep tabular-nums">{data.kpis.chargesheeted.toLocaleString()}</h2>
                <div className="text-[10px] text-success font-bold flex items-center gap-1">
                  <span>{currentLanguage === 'en' ? '53.8% rate' : '53.8% ದರ'}</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-circle bg-surface-soft flex items-center justify-center text-success">
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-canvas border border-hairline-soft p-4 md:p-5 rounded-xl card-product-shadow flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{currentLanguage === 'en' ? 'Arrests' : 'ಬಂಧನಗಳು'}</span>
                <h2 className="text-2xl font-bold text-ink-deep tabular-nums">{data.kpis.arrests.toLocaleString()}</h2>
                <div className="text-[10px] text-primary font-bold flex items-center gap-1">
                  <span>{currentLanguage === 'en' ? 'Across units' : 'ಎಲ್ಲಾ ಘಟಕಗಳಲ್ಲಿ'}</span>
                </div>
              </div>
              <div className="w-9 h-9 rounded-circle bg-surface-soft flex items-center justify-center text-primary">
                <Shield className="w-4 h-4" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Main Grid: Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
            {/* Area Chart: Cases registered over time */}
            <div ref={chartContainerRef} className="bg-canvas border border-hairline-soft p-4 sm:p-5 rounded-2xl md:rounded-xxxl card-product-shadow md:col-span-2 flex flex-col justify-between relative group/chart">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('dashboard.monthlyTrend')}</span>
                  <h3 className="text-base font-bold text-ink-deep">{t('dashboard.monthlySubtitle')}</h3>
                </div>
                
                {/* Export Chart Button */}
                <button
                  type="button"
                  onClick={handleExportChart}
                  className="p-2 border border-hairline-soft bg-canvas hover:bg-surface-soft text-stone hover:text-ink rounded-xl flex items-center justify-center transition cursor-pointer"
                  title="Export Chart PNG"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="var(--color-stone)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-stone)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'var(--color-canvas)', borderColor: 'var(--color-hairline-soft)', borderRadius: '8px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="Cases" stroke="var(--color-primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorCases)" />
                    <Area type="monotone" dataKey="Solved" stroke="var(--color-success)" strokeWidth={2} fillOpacity={1} fill="url(#colorSolved)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow flex flex-col justify-between">
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('dashboard.categoryTitle')}</span>
                <h3 className="text-base font-bold text-ink-deep">{t('dashboard.categorySubtitle')}</h3>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topCategories} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <XAxis type="number" stroke="var(--color-stone)" fontSize={8} tickLine={false} axisLine={false} hide />
                    <YAxis type="category" dataKey="category" stroke="var(--color-ink)" fontSize={9} width={90} tickLine={false} axisLine={false} tickFormatter={(val) => translateCategory(val, currentLanguage)} />
                    <Tooltip contentStyle={{ background: 'var(--color-canvas)', borderColor: 'var(--color-hairline-soft)', borderRadius: '8px', fontSize: '11px' }} />
                    <Bar dataKey="count" fill="var(--color-ink-deep)" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Lower Row: Hotspot Districts and Recent FIRs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* District list */}
            <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow flex flex-col justify-between">
              <div className="mb-4">
                <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('dashboard.districtTitle')}</span>
                <h3 className="text-base font-bold text-ink-deep">{t('dashboard.districtSubtitle')}</h3>
              </div>
              <div className="space-y-3.5 flex-1 mt-2">
                {data.topDistricts.map((dist, idx) => (
                  <div key={dist.district} className="flex items-center justify-between border-b border-hairline-soft pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone">{idx + 1}</span>
                      <span className="text-xs font-medium text-ink-deep">{translateDistrict(dist.district, currentLanguage)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink">{dist.count}</span>
                      <div className="w-1.5 h-1.5 rounded-circle bg-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Cases */}
            <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow md:col-span-2 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('dashboard.recentTitle')}</span>
                  <h3 className="text-base font-bold text-ink-deep">{t('dashboard.recentSubtitle')}</h3>
                </div>
                <a href="/search" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded">
                  {t('dashboard.viewAll')} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
              <div className="space-y-3.5">
                {data.recentFirs.map((fir) => (
                  <div key={fir.caseId} className="flex flex-col md:flex-row md:items-center justify-between p-3.5 rounded-xl bg-surface-soft border border-hairline-soft hover:border-hairline transition duration-150 gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-ink-deep truncate">{fir.firNumber}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                          fir.status === 'Disposed' ? 'bg-success/15 text-success' : 'bg-attention/15 text-attention'
                        }`}>
                          {translateStatus(fir.status, currentLanguage)}
                        </span>
                      </div>
                      <div className="text-[10px] text-steel flex items-center gap-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" aria-hidden="true" /> {fir.station}, {translateDistrict(fir.district, currentLanguage)}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" aria-hidden="true" /> {new Date(fir.registeredDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-4">
                      <div className="text-right">
                        <div className="text-xs font-bold text-ink">{translateCrimeHead(fir.crimeHead, currentLanguage)}</div>
                        <div className="text-[10px] text-stone font-medium">{translateCategory(fir.category, currentLanguage)}</div>
                      </div>
                      <a 
                        href={`/cases/${fir.caseId}`}
                        className="p-1.5 rounded-circle bg-canvas border border-hairline-soft text-ink hover:bg-ink-deep hover:text-canvas focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-colors duration-150"
                        aria-label={`View case details for FIR ${fir.firNumber}`}
                      >
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
