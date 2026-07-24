import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, CartesianGrid, Legend, Area, AreaChart 
} from 'recharts';
import { 
  TrendingUp, AlertTriangle, AlertCircle, 
  Activity, MapPin, Sparkles, RefreshCw 
} from 'lucide-react';
import { getPredictiveInsights, type PredictiveInsights as PredictiveType } from '../../lib/api';
import { useI18n } from '../../i18n/hooks';
import { translateDistrict } from '../../i18n/utils';

export default function PredictiveInsights() {
  const { currentLanguage } = useI18n();
  const [data, setData] = useState<PredictiveType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPredictiveInsights();
      setData(result);
    } catch (err) {
      setError('Failed to fetch predictive insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="bg-canvas border border-hairline-soft rounded-xxxl p-6 flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="w-8 h-8 rounded-circle border-4 border-hairline-soft border-t-primary animate-spin" />
        <span className="text-xs text-steel font-bold">
          {currentLanguage === 'en' ? 'Calculating crime trends & forecast models...' : 'ಅಪರಾಧ ಪ್ರವೃತ್ತಿಗಳು ಮತ್ತು ಮುನ್ಸೂಚನೆ ಮಾದರಿಗಳನ್ನು ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತಿದೆ...'}
        </span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-canvas border border-hairline-soft rounded-xxxl p-6 flex flex-col items-center justify-center min-h-[300px] text-center gap-3">
        <AlertCircle className="w-8 h-8 text-critical" />
        <span className="text-xs text-steel font-bold">
          {currentLanguage === 'en' ? 'Unable to load predictive analytics data.' : 'ಮುನ್ಸೂಚನಾ ವಿಶ್ಲೇಷಣೆ ದತ್ತಾಂಶವನ್ನು ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.'}
        </span>
        <button 
          onClick={fetchInsights} 
          className="px-4 py-2 bg-surface-soft hover:bg-hairline text-ink text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> {currentLanguage === 'en' ? 'Retry' : 'ಮರುಪ್ರಯತ್ನಿಸಿ'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary/5 via-blue-600/5 to-transparent border border-primary/10 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {currentLanguage === 'en' ? 'Machine Learning Predictions' : 'ಮಷಿನ್ ಲರ್ನಿಂಗ್ ಮುನ್ಸೂಚನೆಗಳು'}
            </span>
          </div>
          <h2 className="text-base font-bold text-ink-deep">
            {currentLanguage === 'en' ? 'Predictive Crime Intelligence' : 'ಮುನ್ಸೂಚನಾ ಅಪರಾಧ ಇಂಟೆಲಿಜೆನ್ಸ್'}
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            {currentLanguage === 'en' 
              ? 'Early warning models and hotspot forecasts derived from temporal analysis, historical crime rates, and recidivism indicators.' 
              : 'ಐತಿಹಾಸಿಕ ಅಪರಾಧ ದರಗಳು ಮತ್ತು ಪುನರಾವರ್ತಿತ ಅಪರಾಧ ಸೂಚಕಗಳ ಆಧಾರದ ಮೇಲೆ ರಚಿಸಲಾದ ಮುನ್ಸೂಚನೆಗಳು.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast Line Chart */}
        <div className="lg:col-span-2 bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow flex flex-col justify-between">
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">
              {currentLanguage === 'en' ? '8-Day Trend Forecast' : '೮ ದಿನಗಳ ಪ್ರವೃತ್ತಿ ಮುನ್ಸೂಚನೆ'}
            </span>
            <h3 className="text-sm font-bold text-ink-deep">
              {currentLanguage === 'en' ? 'Expected Incident Volumes' : 'ಅಪರಾಧ ಪ್ರಕರಣಗಳ ನಿರೀಕ್ಷಿತ ಪ್ರಮಾಣ'}
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-hairline-soft)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--color-stone)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-stone)" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ background: 'var(--color-canvas)', borderColor: 'var(--color-hairline-soft)', borderRadius: '8px', fontSize: '11px' }} 
                  labelFormatter={(label) => `${currentLanguage === 'en' ? 'Date:' : 'ದಿನಾಂಕ:'} ${label}`}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" fontSize={11} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                {/* Confidence Range Area */}
                <Area 
                  type="monotone" 
                  dataKey="confidenceUpper" 
                  stroke="none" 
                  fill="var(--color-primary-soft)" 
                  fillOpacity={0.15} 
                  name={currentLanguage === 'en' ? 'Confidence Bound (Upper)' : 'ವಿಶ್ವಾಸಾರ್ಹ ಮಿತಿ (ಮೇಲಿನ)'}
                />
                <Line 
                  type="monotone" 
                  dataKey="actualCount" 
                  stroke="var(--color-ink-deep)" 
                  strokeWidth={2.5} 
                  dot={{ r: 3 }} 
                  name={currentLanguage === 'en' ? 'Actual Incidents' : 'ವಾಸ್ತವ ಅಪರಾಧಗಳು'} 
                />
                <Line 
                  type="monotone" 
                  dataKey="predictedCount" 
                  stroke="var(--color-primary)" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={{ r: 3, strokeDasharray: '0 0' }} 
                  name={currentLanguage === 'en' ? 'AI Predicted Volume' : 'AI ಮುನ್ಸೂಚನೆ'} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Statistical Anomalies */}
        <div className="lg:col-span-1 bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">
              {currentLanguage === 'en' ? 'Statistical Deviations' : 'ಅಸಂಗತತೆಗಳು'}
            </span>
            <h3 className="text-sm font-bold text-ink-deep">
              {currentLanguage === 'en' ? 'Active Anomaly Triggers' : 'ಸಕ್ರಿಯ ಸಿಗ್ನಲ್ ಪ್ರಚೋದಕಗಳು'}
            </h3>
          </div>
          <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
            {data.anomalies.map((anom) => (
              <div key={anom.id} className="p-3 border border-hairline-soft rounded-xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${
                    anom.gravity === 'high' ? 'bg-critical/10 text-critical border-critical/20' : 'bg-warning/10 text-warning border-warning/20'
                  }`}>
                    {anom.gravity === 'high' ? (currentLanguage === 'en' ? 'Critical Spike' : 'ತೀವ್ರ ಏರಿಕೆ') : (currentLanguage === 'en' ? 'Moderate Dev' : 'ಮಧ್ಯಮ ಏರಿಕೆ')}
                  </span>
                  <span className="text-[10px] font-bold text-critical font-mono">
                    +{anom.deviationPercentage}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-ink-deep">{anom.title}</h4>
                <p className="text-[10px] text-steel leading-relaxed">{anom.description}</p>
                <div className="text-[9px] text-stone font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone" /> {translateDistrict(anom.district, currentLanguage)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Early Warning Dashboard Panel */}
      <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-steel font-bold">
            {currentLanguage === 'en' ? 'Command Center Alerts' : 'ಆದೇಶ ಕೇಂದ್ರದ ಎಚ್ಚರಿಕೆಗಳು'}
          </span>
          <h3 className="text-sm font-bold text-ink-deep">
            {currentLanguage === 'en' ? 'Early Warnings & Preventive Indicators' : 'ಮುಂಚಿನ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ತಡೆಗಟ್ಟುವ ಸೂಚಕಗಳು'}
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.earlyWarnings.map((warning) => (
            <div key={warning.id} className="flex gap-3.5 p-4 border border-hairline-soft rounded-xl bg-surface-soft/20 items-start">
              <div className={`p-2.5 rounded-xl border shrink-0 ${
                warning.alertLevel === 'critical' ? 'bg-critical/10 text-critical border-critical/20' : 'bg-warning/10 text-warning border-warning/20'
              }`}>
                {warning.alertLevel === 'critical' ? <AlertCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] text-stone font-bold uppercase tracking-wider">{warning.metric}</span>
                  <span className={`text-[8px] font-bold uppercase px-1.5 py-0.2 rounded-full border ${
                    warning.alertLevel === 'critical' ? 'bg-critical/15 text-critical border-critical/30' : 'bg-warning/15 text-warning border-warning/30'
                  }`}>
                    {warning.alertLevel === 'critical' ? (currentLanguage === 'en' ? 'Action Required' : 'ಕ್ರಮ ಅಗತ್ಯವಿದೆ') : (currentLanguage === 'en' ? 'Monitor' : 'ಮೇಲ್ವಿಚಾರಣೆ')}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-ink-deep truncate">{warning.value}</h4>
                <p className="text-[10px] text-steel leading-relaxed">{warning.relevance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
