import React, { useState, useEffect } from 'react';
import { getCurrentSession } from '../../lib/auth';
import type { UserSession } from '../../lib/auth';
import { useI18n } from '../../i18n/hooks';
import { 
  ShieldAlert, ShieldCheck, RefreshCw, 
  Download, Trash2, Search, Sliders, 
  Activity, AlertCircle, CheckCircle, 
  Terminal, Database, Lock, Clock, FileText 
} from 'lucide-react';
import { getAuditLogs, purgeCache, refreshMaterializedViews, type AuditLog } from '../../lib/api';

export default function ComplianceDashboard() {
  const { currentLanguage } = useI18n();
  const [session, setSession] = useState<UserSession | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'audit' | 'actions' | 'rules'>('audit');

  // Action loaders
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3550);
  };

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAuditLogs();
      setLogs(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to retrieve security audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSession(getCurrentSession());
    fetchLogs();
  }, []);

  const handlePurgeCache = async () => {
    setActionLoading('purge');
    try {
      const result = await purgeCache();
      showToast(result.message || 'System cache purged successfully.');
      
      // Prepend mock cache purge event to logs
      setLogs(prev => [
        {
          rowId: `c-${Date.now()}`,
          action: 'CACHE_PURGED',
          userEmail: session?.username || 'admin@ksp.gov.in',
          details: 'Cleared entire temporary application cache segment.',
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    } catch (err: any) {
      showToast(`Cache purge failed: ${err.message || err}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefreshData = async () => {
    setActionLoading('refresh');
    try {
      const result = await refreshMaterializedViews();
      showToast(result.message || 'Materialized views refreshed.');
      
      // Prepend mock data refresh event to logs
      setLogs(prev => [
        {
          rowId: `r-${Date.now()}`,
          action: 'DATA_REFRESH',
          userEmail: session?.username || 'admin@ksp.gov.in',
          details: 'Triggered view refresh for vw_case_summary.',
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    } catch (err: any) {
      showToast(`View refresh failed: ${err.message || err}`);
    } finally {
      setActionLoading(null);
    }
  };

  // CSV Log Exporter
  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = 'ROWID,Action,User,Details,Timestamp\n';
    const csvContent = logs.map(l => 
      `"${l.rowId}","${l.action}","${l.userEmail}","${l.details.replace(/"/g, '""')}","${l.timestamp}"`
    ).join('\n');
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ksp_compliance_audit_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit trail exported to CSV.');
  };

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-3.5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 w-full max-w-none animate-in fade-in duration-200">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-100 flex items-center gap-2.5 bg-[#0a1317] border border-slate-750 text-white px-4 py-3 rounded-xl shadow-xl animate-in slide-in-from-bottom-2 duration-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline-soft pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-rose-500">
            <Lock className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {currentLanguage === 'en' ? 'Audit Command Center' : 'ಲೆಕ್ಕಪರಿಶೋಧನಾ ನಿಯಂತ್ರಣ ಕೇಂದ್ರ'}
            </span>
          </div>
          <h2 className="text-base font-bold text-ink-deep">
            {currentLanguage === 'en' ? 'Data Governance, Compliance & Audits' : 'ಡೇಟಾ ಆಡಳಿತ, ಅನುಸರಣೆ ಮತ್ತು ಆಡಿಟ್'}
          </h2>
          <p className="text-xs text-slate-500 max-w-xl">
            {currentLanguage === 'en' 
              ? 'Continuous digital audit logger enforcing transparency, model boundaries, and local data residency controls in alignment with the Karnataka Police Manual.' 
              : 'ಕರ್ನಾಟಕ ಪೊಲೀಸ್ ಕೈಪಿಡಿಗೆ ಅನುಗುಣವಾಗಿ ಪಾರದರ್ಶಕತೆ, ಮಾದರಿ ಗಡಿಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಡೇಟಾ ನಿಯಂತ್ರಣಗಳನ್ನು ಜಾರಿಗೊಳಿಸುವ ಸಿಸ್ಟಮ್ ಲಾಗರ್.'}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-1 bg-surface-soft p-1 rounded-full border border-hairline-soft shrink-0 self-start md:self-center">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition cursor-pointer ${
              activeTab === 'audit' ? 'bg-ink-deep text-canvas' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {currentLanguage === 'en' ? 'Security Audit Trail' : 'ಭದ್ರತಾ ಆಡಿಟ್ ಲಾಗ್'}
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition cursor-pointer ${
              activeTab === 'actions' ? 'bg-ink-deep text-canvas' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {currentLanguage === 'en' ? 'Control Panel' : 'ನಿಯಂತ್ರಣ ಫಲಕ'}
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition cursor-pointer ${
              activeTab === 'rules' ? 'bg-ink-deep text-canvas' : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {currentLanguage === 'en' ? 'DPDP Governance Rules' : 'ಆಡಳಿತ ನಿಯಮಗಳು'}
          </button>
        </div>
      </div>

      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Filters Area */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder={currentLanguage === 'en' ? 'Filter audit logs...' : 'ಆಡಿಟ್ ಲಾಗ್‌ಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-hairline-soft bg-canvas rounded-xl text-xs font-medium text-ink-deep placeholder-stone focus:outline-none focus:border-primary shadow-xs"
              />
              <Search className="w-4 h-4 text-stone absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchLogs}
                className="p-2 border border-hairline bg-canvas hover:bg-surface-soft text-stone hover:text-ink rounded-xl flex items-center justify-center transition cursor-pointer"
                title="Reload Logs"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleExportCSV}
                disabled={logs.length === 0}
                className="px-4 py-2 bg-ink-deep hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 text-canvas text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{currentLanguage === 'en' ? 'Export CSV' : 'CSV ರಫ್ತು ಮಾಡಿ'}</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-canvas border border-hairline-soft rounded-xxxl shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-circle border-4 border-hairline-soft border-t-primary animate-spin" />
                <span className="text-xs text-steel font-bold">
                  {currentLanguage === 'en' ? 'Loading security records from datastore...' : 'ಡೇಟಾಸ್ಟೋರ್‌ನಿಂದ ಭದ್ರತಾ ದಾಖಲೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...'}
                </span>
              </div>
            ) : error ? (
              <div className="p-12 text-center flex flex-col items-center gap-2">
                <AlertCircle className="w-8 h-8 text-critical" />
                <span className="text-xs text-steel font-bold">{error}</span>
                <button onClick={fetchLogs} className="mt-2 px-4 py-2 bg-primary hover:bg-primary-deep text-white text-xs font-bold rounded-xl transition cursor-pointer">
                  {currentLanguage === 'en' ? 'Retry' : 'ಮರುಪ್ರಯತ್ನಿಸಿ'}
                </button>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="p-12 text-center text-xs text-stone font-bold">
                {currentLanguage === 'en' ? 'No governance records found matching query.' : 'ಯಾವುದೇ ಹೊಂದಾಣಿಕೆಯ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ.'}
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin">
                <table className="w-full text-left border-collapse text-xs min-w-[640px]">
                  <thead className="sticky top-0 bg-surface-soft/95 backdrop-blur-xs z-10 shadow-xs">
                    <tr className="border-b border-hairline-soft text-[10px] font-bold text-steel tracking-wider uppercase select-none">
                      <th className="p-3.5 sm:p-4 whitespace-nowrap">{currentLanguage === 'en' ? 'Timestamp' : 'ಸಮಯ'}</th>
                      <th className="p-3.5 sm:p-4 whitespace-nowrap">{currentLanguage === 'en' ? 'Security Action' : 'ಭದ್ರತಾ ಕ್ರಿಯೆ'}</th>
                      <th className="p-3.5 sm:p-4 whitespace-nowrap">{currentLanguage === 'en' ? 'Identity / Operator' : 'ಬಳಕೆದಾರ'}</th>
                      <th className="p-3.5 sm:p-4 whitespace-nowrap">{currentLanguage === 'en' ? 'Audit Details' : 'ಆಡಿಟ್ ವಿವರಗಳು'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft">
                    {filteredLogs.map((log) => {
                      const isHighAlert = log.action.includes('SENSITIVE') || log.action.includes('WARNING') || log.action.includes('RESTRICTED');
                      return (
                        <tr key={log.rowId} className={`hover:bg-slate-50/50 transition-colors ${isHighAlert ? 'bg-rose-50/10' : ''}`}>
                          <td className="p-4 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString(currentLanguage === 'kn' ? 'kn-IN' : 'en-US')}
                          </td>
                          <td className="p-4 font-bold">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                              isHighAlert 
                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}>
                              {isHighAlert ? (
                                <ShieldAlert className="w-3 h-3 text-rose-500 shrink-0" />
                              ) : (
                                <ShieldCheck className="w-3 h-3 text-slate-400 shrink-0" />
                              )}
                              {log.action}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-ink-deep whitespace-nowrap">
                            {log.userEmail}
                          </td>
                          <td className="p-4 text-slate-600 font-medium">
                            {log.details}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Action Card: Cache Purge */}
          <div className="bg-canvas border border-hairline-soft p-6 rounded-xxxl card-product-shadow flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 w-fit">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink-deep">
                {currentLanguage === 'en' ? 'Purge Application Cache Segment' : 'ಅಪ್ಲಿಕೇಶನ್ ಕ್ಯಾಶ್ ಪರ್ಜ್ ಮಾಡಿ'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {currentLanguage === 'en'
                  ? 'Clears cached response segments, forcing the dashboard metrics, maps, and network graph modules to fetch fresh data queries from the datastore.'
                  : 'ಸಂಗ್ರಹಿಸಲಾದ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಅಳಿಸಿಹಾಕುತ್ತದೆ. ಇದು ಹೊಸ ದತ್ತಾಂಶ ಪ್ರಶ್ನೆಗಳನ್ನು ಪಡೆಯಲು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಒತ್ತಾಯಿಸುತ್ತದೆ.'}
              </p>
            </div>
            
            <button
              onClick={handlePurgeCache}
              disabled={actionLoading !== null}
              className="w-full h-10 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 animate-all duration-150"
            >
              {actionLoading === 'purge' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>{currentLanguage === 'en' ? 'Purge Temporary Cache' : 'ತಾತ್ಕಾಲಿಕ ಕ್ಯಾಶ್ ಅಳಿಸಿ'}</span>
            </button>
          </div>

          {/* Action Card: Materialized View Refresh */}
          <div className="bg-canvas border border-hairline-soft p-6 rounded-xxxl card-product-shadow flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 w-fit">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink-deep">
                {currentLanguage === 'en' ? 'Refresh Materialized Case Views' : 'ಮ್ಯಾಟಿರಿಯಲೈಸ್ಡ್ ವ್ಯೂ ರಿಫ್ರೆಶ್ ಮಾಡಿ'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {currentLanguage === 'en'
                  ? 'Forces the backend database schemas to refresh pre-computed case records, summaries, and search indices. This process takes ~30 seconds on the serverless gateway.'
                  : 'ಹಿನ್ನೆಲೆ ಡೇಟಾಬೇಸ್ ವ್ಯೂಗಳನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಲು ಒತ್ತಾಯಿಸುತ್ತದೆ. ಇದು ಸರ್ವರ್‌ನಲ್ಲಿ ಪೂರ್ಣಗೊಳ್ಳಲು ಸುಮಾರು ೩೦ ಸೆಕೆಂಡುಗಳನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತದೆ.'}
              </p>
            </div>

            <button
              onClick={handleRefreshData}
              disabled={actionLoading !== null}
              className="w-full h-10 bg-[#0064e0] hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 animate-all duration-150"
            >
              {actionLoading === 'refresh' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>{currentLanguage === 'en' ? 'Refresh Materialized Tables' : 'ಕೋಷ್ಟಕಗಳನ್ನು ರಿಫ್ರೆಶ್ ಮಾಡಿ'}</span>
            </button>
          </div>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="bg-canvas border border-hairline-soft p-6 rounded-xxxl card-product-shadow space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-ink-deep">
                {currentLanguage === 'en' ? 'Indian DPDP Act & Data Privacy Governance Rules' : 'ಭಾರತೀಯ DPDP ಕಾಯ್ದೆ ಮತ್ತು ಡೇಟಾ ಗೌಪ್ಯತೆ ಆಡಳಿತ ನಿಯಮಗಳು'}
              </h3>
              <p className="text-[10px] text-steel uppercase tracking-wider font-bold">Active Configuration Matrix</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 border border-hairline-soft bg-surface-soft/20 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-deep">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{currentLanguage === 'en' ? 'Local Data Residency' : 'ಸ್ಥಳೀಯ ಡೇಟಾ ರೆಸಿಡೆನ್ಸಿ'}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                {currentLanguage === 'en'
                  ? 'All KSP criminal histories, FIR narratives, and PII are stored locally in the Bengaluru Catalyst Datastore. No cross-border model training is allowed.'
                  : 'ಎಲ್ಲಾ ಅಪರಾಧ ವಿವರಗಳು ಮತ್ತು ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ಬೆಂಗಳೂರಿನ ಡೇಟಾಸ್ಟೋರ್‌ನಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.'}
              </p>
            </div>

            <div className="p-4 border border-hairline-soft bg-surface-soft/20 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-deep">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{currentLanguage === 'en' ? 'PII Masking & Redaction' : 'PII ಮರೆಮಾಚುವಿಕೆ'}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                {currentLanguage === 'en'
                  ? 'Viewer roles are restricted from viewing witness/victim contact details. Key columns are dynamically masked inside sql-previews and narratives.'
                  : 'ಸೃಜನಶೀಲ ಮತ್ತು ವೀಕ್ಷಕರ ಪಾತ್ರಗಳು ಸಾಕ್ಷಿಗಳ ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ನೋಡುವುದನ್ನು ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ.'}
              </p>
            </div>

            <div className="p-4 border border-hairline-soft bg-surface-soft/20 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-ink-deep">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{currentLanguage === 'en' ? 'Immutable Audit Logs' : 'ಬದಲಾಗದ ಆಡಿಟ್ ಲಾಗ್‌ಗಳು'}</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                {currentLanguage === 'en'
                  ? 'Every database query, report generation, and speech synthesis triggered is permanently written to the datastore. Administrators cannot delete audit logs.'
                  : 'ಪ್ರತಿಯೊಂದು ಡೇಟಾಬೇಸ್ ಪ್ರಶ್ನೆ ಮತ್ತು ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ ಅನ್ನು ಶಾಶ್ವತವಾಗಿ ಲಾಗ್ ಮಾಡಲಾಗುತ್ತದೆ. ಲಾಗ್‌ಗಳನ್ನು ಅಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
