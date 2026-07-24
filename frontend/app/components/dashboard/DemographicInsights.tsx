import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid 
} from 'recharts';
import { 
  Users, UserCheck, Shield, Sparkles, 
  Briefcase, Calendar, MapPin, RefreshCw, AlertCircle 
} from 'lucide-react';
import { getDemographicInsights, type DemographicInsights as DemographicsType } from '../../lib/api';
import { useI18n } from '../../i18n/hooks';

const COLORS = [
  'var(--color-primary)', 
  'var(--color-oculus-purple)', 
  'var(--color-success)', 
  'var(--color-attention)', 
  'var(--color-critical)'
];

export default function DemographicInsights() {
  const { currentLanguage } = useI18n();
  const [entity, setEntity] = useState<'accused' | 'victims'>('accused');
  const [timePeriod, setTimePeriod] = useState<string>('12');
  const [data, setData] = useState<DemographicsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDemographics = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDemographicInsights(entity, timePeriod);
      setData(result);
    } catch (err) {
      setError('Failed to fetch demographic insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemographics();
  }, [entity, timePeriod]);

  if (loading) {
    return (
      <div className="bg-canvas border border-hairline-soft rounded-xxxl p-6 flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="w-8 h-8 rounded-circle border-4 border-hairline-soft border-t-primary animate-spin" />
        <span className="text-xs text-steel font-bold">
          {currentLanguage === 'en' ? 'Compiling demographic distributions...' : 'ಜನಸಂಖ್ಯಾ ವಿತರಣಾ ವಿವರಗಳನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುತ್ತಿದೆ...'}
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-canvas border border-hairline-soft rounded-xxxl p-6 flex flex-col items-center justify-center min-h-[300px] text-center gap-3">
        <AlertCircle className="w-8 h-8 text-critical" />
        <span className="text-xs text-steel font-bold">
          {currentLanguage === 'en' ? 'Unable to load socio-demographic analytics.' : 'ಸಾಮಾಜಿಕ-ಜನಸಂಖ್ಯಾ ವಿಶ್ಲೇಷಣಾ ವಿವರಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.'}
        </span>
        <button 
          onClick={fetchDemographics} 
          className="px-4 py-2 bg-surface-soft hover:bg-hairline text-ink text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> {currentLanguage === 'en' ? 'Retry' : 'ಮರುಪ್ರಯತ್ನಿಸಿ'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filters and Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline-soft pb-5">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-steel font-bold">
            {currentLanguage === 'en' ? 'Socio-Demographic Profiling' : 'ಸಾಮಾಜಿಕ-ಜನಸಂಖ್ಯಾ ಪ್ರೊಫೈಲಿಂಗ್'}
          </span>
          <h2 className="text-base font-bold text-ink-deep">
            {currentLanguage === 'en' ? 'Demographic Distribution Insights' : 'ಜನಸಂಖ್ಯಾ ವಿವರಗಳ ವಿಶ್ಲೇಷಣೆ'}
          </h2>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Entity Selector (Accused vs Victims) */}
          <div className="flex p-1 bg-surface-soft rounded-xl border border-hairline-soft">
            <button
              onClick={() => setEntity('accused')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition select-none cursor-pointer ${
                entity === 'accused' 
                  ? 'bg-canvas text-primary shadow-xs' 
                  : 'text-stone hover:text-ink'
              }`}
            >
              {currentLanguage === 'en' ? 'Accused Profiles' : 'ಆರೋಪಿಗಳ ಪ್ರೊಫೈಲ್'}
            </button>
            <button
              onClick={() => setEntity('victims')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition select-none cursor-pointer ${
                entity === 'victims' 
                  ? 'bg-canvas text-primary shadow-xs' 
                  : 'text-stone hover:text-ink'
              }`}
            >
              {currentLanguage === 'en' ? 'Victims / Complainants' : 'ಸಂತ್ರಸ್ತರು / ದೂರುದಾರರು'}
            </button>
          </div>

          {/* Time Period Filter */}
          <div className="relative">
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value)}
              className="bg-canvas border border-hairline-soft px-3 py-2 rounded-xl text-xs font-bold text-ink-deep outline-none focus:border-primary cursor-pointer pr-8 appearance-none"
            >
              <option value="3">{currentLanguage === 'en' ? 'Past 3 Months' : 'ಕಳೆದ ೩ ತಿಂಗಳು'}</option>
              <option value="6">{currentLanguage === 'en' ? 'Past 6 Months' : 'ಕಳೆದ ೬ ತಿಂಗಳು'}</option>
              <option value="12">{currentLanguage === 'en' ? 'Past 12 Months' : 'ಕಳೆದ ೧೨ ತಿಂಗಳು'}</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone font-bold text-[10px]">▼</div>
          </div>
        </div>
      </div>

      {/* Charts Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Age Group Bar Chart */}
        <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone font-bold flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {currentLanguage === 'en' ? 'Age Distribution' : 'ವಯಸ್ಸಿನ ವಿತರಣೆ'}
            </span>
            <h3 className="text-sm font-bold text-ink-deep mt-1">
              {entity === 'accused' 
                ? (currentLanguage === 'en' ? 'Accused Age Groups' : 'ಆರೋಪಿಗಳ ವಯಸ್ಸಿನ ಗುಂಪುಗಳು') 
                : (currentLanguage === 'en' ? 'Victim Age Groups' : 'ಸಂತ್ರಸ್ತರ ವಯಸ್ಸಿನ ಗುಂಪುಗಳು')}
            </h3>
          </div>
          <div className="h-56 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ageGroups} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline-soft)" vertical={false} />
                <XAxis dataKey="group" stroke="var(--color-stone)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-stone)" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-canvas)', borderColor: 'var(--color-hairline-soft)', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2: Gender Pie Donut Chart */}
        <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone font-bold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" /> {currentLanguage === 'en' ? 'Gender Breakdown' : 'ಲಿಂಗದ ವಿವರ'}
            </span>
            <h3 className="text-sm font-bold text-ink-deep mt-1">
              {currentLanguage === 'en' ? 'Reported Demographics' : 'ವರದಿಯಾದ ಜನಸಂಖ್ಯೆ'}
            </h3>
          </div>
          <div className="h-56 w-full mt-4 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.gender}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.gender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--color-canvas)', borderColor: 'var(--color-hairline-soft)', borderRadius: '8px', fontSize: '11px' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" fontSize={10} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3: Location Occurrence Analysis */}
        <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow flex flex-col justify-between lg:col-span-1 md:col-span-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {currentLanguage === 'en' ? 'Crime Setting Analysis' : 'ಅಪರಾಧ ಪ್ರದೇಶಗಳ ವಿಶ್ಲೇಷಣೆ'}
            </span>
            <h3 className="text-sm font-bold text-ink-deep mt-1">
              {currentLanguage === 'en' ? 'Top Scene Environments' : 'ಅಪರಾಧ ನಡೆದ ಪ್ರಮುಖ ಸ್ಥಳಗಳು'}
            </h3>
          </div>
          <div className="h-56 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.locationTypes} layout="vertical" margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline-soft)" horizontal={false} />
                <XAxis type="number" stroke="var(--color-stone)" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="type" stroke="var(--color-stone)" fontSize={8} width={80} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-canvas)', borderColor: 'var(--color-hairline-soft)', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="count" fill="var(--color-oculus-purple)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Occupations Analysis grid row */}
      <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-stone font-bold flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5" /> {currentLanguage === 'en' ? 'Socio-Economic Indicators' : 'ಸಾಮಾಜಿಕ-ಆರ್ಥಿಕ ಸೂಚಕಗಳು'}
          </span>
          <h3 className="text-sm font-bold text-ink-deep mt-1">
            {entity === 'accused' 
              ? (currentLanguage === 'en' ? 'Declared Accused Occupations' : 'ಆರೋಪಿಗಳ ಉದ್ಯೋಗ ವಿವರಣೆ') 
              : (currentLanguage === 'en' ? 'Victim Occupation Categories' : 'ಸಂತ್ರಸ್ತರ ಉದ್ಯೋಗದ ಪ್ರಮುಖ ವರ್ಗಗಳು')}
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.occupation.map((occ, idx) => (
            <div key={idx} className="p-3 border border-hairline-soft rounded-xl bg-surface-soft/30 text-center space-y-1">
              <span className="text-[10px] text-stone font-semibold truncate block">{occ.label}</span>
              <div className="text-lg font-bold text-ink-deep tabular-nums">{occ.count}</div>
              <span className="text-[8px] text-slate-400 block font-bold">{currentLanguage === 'en' ? 'REGISTERED' : 'ದಾಖಲಾಗಿದೆ'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
