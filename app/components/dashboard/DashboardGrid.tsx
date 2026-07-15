import React, { useState, useEffect } from 'react';
import { getDashboardSummary } from '../../lib/api';
import type { DashboardSummary } from '../../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, CartesianGrid, Legend 
} from 'recharts';
import { Shield, Activity, FileText, CheckCircle, MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function DashboardGrid() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const summary = await getDashboardSummary();
      setData(summary);
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
        <h3 className="text-lg font-bold text-ink-deep">Failed to Load Intelligence</h3>
        <p className="text-xs text-steel">Could not establish connection to the data gateway. Please check your network and try again.</p>
        <button 
          onClick={fetchData} 
          className="mt-2 px-6 py-2 bg-primary text-canvas rounded-full text-xs font-bold hover:bg-primary-deep focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  // Generate trend line data dynamically for Area Chart
  const trendData = [
    { name: 'Jan', Cases: 410, Solved: 280 },
    { name: 'Feb', Cases: 480, Solved: 310 },
    { name: 'Mar', Cases: 520, Solved: 390 },
    { name: 'Apr', Cases: 610, Solved: 430 },
    { name: 'May', Cases: 580, Solved: 490 },
    { name: 'Jun', Cases: 680, Solved: 512 }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-canvas border border-hairline-soft p-4 md:p-5 rounded-xl card-product-shadow flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">Total FIRs</span>
            <h2 className="text-2xl font-bold text-ink-deep tabular-nums">{data.kpis.totalFirs.toLocaleString()}</h2>
            <div className="text-[10px] text-success font-bold flex items-center gap-1">
              <span>+12.4%</span>
              <span className="text-stone font-medium">from last month</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-circle bg-surface-soft flex items-center justify-center text-ink-deep">
            <FileText className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-canvas border border-hairline-soft p-4 md:p-5 rounded-xl card-product-shadow flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">Active Cases</span>
            <h2 className="text-2xl font-bold text-ink-deep tabular-nums">{data.kpis.activeCases.toLocaleString()}</h2>
            <div className="text-[10px] text-attention font-bold flex items-center gap-1">
              <span>Under investigation</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-circle bg-surface-soft flex items-center justify-center text-attention">
            <Activity className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-canvas border border-hairline-soft p-4 md:p-5 rounded-xl card-product-shadow flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">Chargesheeted</span>
            <h2 className="text-2xl font-bold text-ink-deep tabular-nums">{data.kpis.chargesheeted.toLocaleString()}</h2>
            <div className="text-[10px] text-success font-bold flex items-center gap-1">
              <span>53.8% rate</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-circle bg-surface-soft flex items-center justify-center text-success">
            <CheckCircle className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-canvas border border-hairline-soft p-4 md:p-5 rounded-xl card-product-shadow flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">Arrests</span>
            <h2 className="text-2xl font-bold text-ink-deep tabular-nums">{data.kpis.arrests.toLocaleString()}</h2>
            <div className="text-[10px] text-primary font-bold flex items-center gap-1">
              <span>Across units</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-circle bg-surface-soft flex items-center justify-center text-primary">
            <Shield className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Main Grid: Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Area Chart: Cases registered over time */}
        <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow md:col-span-2 flex flex-col justify-between">
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">Crime Incidence Trend</span>
            <h3 className="text-base font-bold text-ink-deep">FIR Registrations vs. Resolved Cases (2026)</h3>
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
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">Crime Categories</span>
            <h3 className="text-base font-bold text-ink-deep">Cases by Major Heads</h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topCategories} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <XAxis type="number" stroke="var(--color-stone)" fontSize={8} tickLine={false} axisLine={false} hide />
                <YAxis type="category" dataKey="category" stroke="var(--color-ink)" fontSize={9} width={90} tickLine={false} axisLine={false} />
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
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">Geographic Distribution</span>
            <h3 className="text-base font-bold text-ink-deep">Top Active Districts</h3>
          </div>
          <div className="space-y-3.5 flex-1 mt-2">
            {data.topDistricts.map((dist, idx) => (
              <div key={dist.district} className="flex items-center justify-between border-b border-hairline-soft pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone">{idx + 1}</span>
                  <span className="text-xs font-medium text-ink-deep">{dist.district}</span>
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
              <span className="text-[10px] uppercase tracking-wider text-steel font-bold">Recent Intelligence</span>
              <h3 className="text-base font-bold text-ink-deep">Recently Registered FIRs</h3>
            </div>
            <a href="/search" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded">
              View All <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
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
                      {fir.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-steel flex items-center gap-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" aria-hidden="true" /> {fir.station}, {fir.district}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" aria-hidden="true" /> {new Date(fir.registeredDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className="text-right">
                    <div className="text-xs font-bold text-ink">{fir.crimeHead}</div>
                    <div className="text-[10px] text-stone font-medium">{fir.category}</div>
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
    </div>
  );
}
