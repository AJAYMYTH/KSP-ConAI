import React, { useState, useEffect } from 'react';
import { getCurrentSession } from '../../lib/auth';
import type { UserSession } from '../../lib/auth';
import { useI18n } from '../../i18n/hooks';
import { I18nProvider } from '../../i18n/provider';
import { 
  Users, 
  Settings, 
  RefreshCw, 
  ShieldCheck, 
  Database, 
  FileText, 
  Trash2, 
  Search, 
  Sliders, 
  Terminal, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface UserMock {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'investigator' | 'analyst' | 'viewer';
  unit: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  ip: string;
}

function AdminConsoleInner() {
  const { t, currentLanguage } = useI18n();
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'prompts' | 'database' | 'logs'>('users');
  
  // Users state
  const [users, setUsers] = useState<UserMock[]>([
    { id: '1', name: 'ADGP Alok Kumar', email: 'alok.kumar@ksp.gov.in', role: 'admin', unit: 'State Headquarters' },
    { id: '2', name: 'Dayananda B.', email: 'dayananda.b@ksp.gov.in', role: 'admin', unit: 'Bengaluru City Police' },
    { id: '3', name: 'Inspector Girish', email: 'girish.n@ksp.gov.in', role: 'investigator', unit: 'Indiranagar PS' },
    { id: '4', name: 'Analyst Shruthi', email: 'shruthi.ci@ksp.gov.in', role: 'analyst', unit: 'Intelligence Unit' },
    { id: '5', name: 'Officer Sandeep', email: 'sandeep.k@ksp.gov.in', role: 'viewer', unit: 'State Command Centre' }
  ]);

  // Prompt Templates state
  const [summaryTemplate, setSummaryTemplate] = useState(
    "You are an expert crime analyst. Provide a formal, highly objective investigation report based ONLY on the provided case data. Do not make determinations of guilt or speculate beyond the evidence files."
  );
  const [sqlSafetyPrompt, setSqlSafetyPrompt] = useState(
    "Only generate SELECT queries. Only target allowed tables: CaseMaster, Accused, Victim, Complainant, ActSectionAssociation. If the query requires writing data or accessing other tables, abort and throw an error."
  );

  // Database stats
  const [stats, setStats] = useState({
    cases: 1248,
    accused: 2841,
    victims: 1192,
    complainants: 1255,
    lastRefresh: new Date().toISOString()
  });

  // Action status
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: '101', timestamp: '2026-07-16T12:35:12Z', user: 'alok.kumar@ksp.gov.in', action: 'Generated Report PDF for KA-BC-2026-00812', status: 'SUCCESS', ip: '10.12.84.101' },
    { id: '102', timestamp: '2026-07-16T12:28:44Z', user: 'girish.n@ksp.gov.in', action: 'Searched suspect database: "Karthik alias Poochi"', status: 'SUCCESS', ip: '10.12.91.56' },
    { id: '103', timestamp: '2026-07-16T12:15:02Z', user: 'sandeep.k@ksp.gov.in', action: 'Attempted to access administrative config page', status: 'WARNING', ip: '10.12.12.89' },
    { id: '104', timestamp: '2026-07-16T11:58:30Z', user: 'shruthi.ci@ksp.gov.in', action: 'Exported analytics map dataset to CSV', status: 'SUCCESS', ip: '10.12.84.112' },
    { id: '105', timestamp: '2026-07-16T11:42:15Z', user: 'unknown_host', action: 'Brute-force login attempt detected (Google OAuth)', status: 'FAILED', ip: '192.168.1.43' }
  ]);

  useEffect(() => {
    setSession(getCurrentSession());
  }, []);

  const triggerToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleRoleChange = (userId: string, newRole: 'admin' | 'investigator' | 'analyst' | 'viewer') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    triggerToast(`User role updated to ${newRole.toUpperCase()}`);
    
    // Add to audit log
    const newLog: AuditLog = {
      id: Math.random().toString(),
      timestamp: new Date().toISOString(),
      user: session?.username || 'admin@ksp.gov.in',
      action: `Changed role of user ${userId} to ${newRole}`,
      status: 'SUCCESS',
      ip: '127.0.0.1'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleSaveTemplates = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("QuickML system prompts saved successfully");
  };

  const handleFlushCache = () => {
    triggerToast("System Cache invalidated successfully");
  };

  const handleTriggerIndexing = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setStats(prev => ({ ...prev, lastRefresh: new Date().toISOString() }));
      triggerToast("Case records successfully re-indexed & embeddings synchronized");
    }, 1500);
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60dvh] text-center p-6">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xs text-stone mt-2">Checking session authentication...</p>
      </div>
    );
  }

  // Admin access validation
  if (session.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-canvas border border-hairline-soft rounded-xxxl text-center card-product-shadow space-y-4">
        <div className="w-12 h-12 rounded-circle bg-critical/10 text-critical flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-ink-deep">Restricted Workspace</h2>
          <p className="text-xs text-steel">This workspace contains classified administrative configuration files. Your current credential role ({session.role}) lacks permissions.</p>
        </div>
        <a href="/dashboard" className="inline-block px-6 py-2 bg-primary text-canvas rounded-full text-xs font-bold hover:bg-primary-deep transition">
          Return to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full animate-in fade-in duration-300">
      {/* Sticky Banner Header */}
      <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl flex flex-col md:flex-row md:items-center justify-between gap-4 card-product-shadow">
        <div className="flex items-center gap-3">
          <img src="/karnataka_emblem.png" alt="Government Seal" className="w-10 h-10 object-contain animate-pulse-subtle" width="40" height="40" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-primary font-bold">Workspace Panel</span>
              <span className="w-1.5 h-1.5 rounded-circle bg-stone" />
              <span className="text-xs text-purple-700 bg-purple-50 dark:bg-purple-950/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Root Admin</span>
            </div>
            <h1 className="text-base font-bold text-ink-deep">System Administration Console</h1>
          </div>
        </div>

        {/* Global Toast Alert */}
        {actionSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-lg text-xs font-bold text-success animate-fade-in shadow-sm select-none">
            <CheckCircle className="w-4 h-4" /> {actionSuccess}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Navigation Workspace Panel */}
        <div className="md:col-span-1 grid grid-cols-2 gap-2 sm:grid-cols-4 md:flex md:flex-col md:space-y-2">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold border transition ${
              activeSubTab === 'users'
                ? 'bg-primary border-primary text-canvas shadow-sm'
                : 'bg-canvas border-hairline-soft text-steel hover:bg-surface-soft hover:text-ink'
            }`}
          >
            <Users className="w-4 h-4" /> User Management
          </button>
          <button
            onClick={() => setActiveSubTab('prompts')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold border transition ${
              activeSubTab === 'prompts'
                ? 'bg-primary border-primary text-canvas shadow-sm'
                : 'bg-canvas border-hairline-soft text-steel hover:bg-surface-soft hover:text-ink'
            }`}
          >
            <Sliders className="w-4 h-4" /> Prompt Customizer
          </button>
          <button
            onClick={() => setActiveSubTab('database')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold border transition ${
              activeSubTab === 'database'
                ? 'bg-primary border-primary text-canvas shadow-sm'
                : 'bg-canvas border-hairline-soft text-steel hover:bg-surface-soft hover:text-ink'
            }`}
          >
            <Database className="w-4 h-4" /> Data Store & Cache
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold border transition ${
              activeSubTab === 'logs'
                ? 'bg-primary border-primary text-canvas shadow-sm'
                : 'bg-canvas border-hairline-soft text-steel hover:bg-surface-soft hover:text-ink'
            }`}
          >
            <Terminal className="w-4 h-4" /> Security Audit Logs
          </button>
        </div>

        {/* Right Details Panel */}
        <div className="md:col-span-3">
          {/* Sub-Tab 1: Users */}
          {activeSubTab === 'users' && (
            <div className="bg-canvas border border-hairline-soft p-6 rounded-xxxl card-product-shadow space-y-4">
              <div>
                <h2 className="text-sm font-bold text-ink-deep">Role-Based Access List</h2>
                <p className="text-[11px] text-stone mt-0.5">Assign credentials and restrict module visibility for Karnataka State Police personnel.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-hairline-soft text-[10px] text-stone font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-1">Officer Name</th>
                      <th className="pb-3">Unit / Station</th>
                      <th className="pb-3">Credential Level</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hairline-soft text-xs text-steel">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-surface-soft/40 transition">
                        <td className="py-3 pl-1 font-semibold text-ink-deep">
                          <div>{u.name}</div>
                          <div className="text-[10px] text-stone font-medium">{u.email}</div>
                        </td>
                        <td className="py-3">{u.unit}</td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/20' :
                            u.role === 'investigator' ? 'bg-primary/10 text-primary' :
                            u.role === 'analyst' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/20' : 'bg-surface-soft text-steel'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                            className="bg-surface-mid border border-hairline-soft rounded px-2.5 py-1 text-[11px] text-ink focus:outline-none focus:border-primary cursor-pointer font-medium"
                          >
                            <option value="admin">Admin</option>
                            <option value="investigator">Investigator</option>
                            <option value="analyst">Analyst</option>
                            <option value="viewer">Viewer</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-Tab 2: Prompts */}
          {activeSubTab === 'prompts' && (
            <div className="bg-canvas border border-hairline-soft p-6 rounded-xxxl card-product-shadow space-y-4">
              <div>
                <h2 className="text-sm font-bold text-ink-deep">QuickML Prompt Configurer</h2>
                <p className="text-[11px] text-stone mt-0.5">Customize default instructions for NLP analysis and SQL query boundaries.</p>
              </div>

              <form onSubmit={handleSaveTemplates} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-steel font-bold uppercase tracking-wider">Investigation Report Prompt</label>
                  <textarea
                    rows={4}
                    value={summaryTemplate}
                    onChange={(e) => setSummaryTemplate(e.target.value)}
                    className="w-full bg-surface-soft/60 border border-hairline-soft rounded-xl p-3 text-xs text-ink placeholder-stone focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] text-steel font-bold uppercase tracking-wider">SQL Routing Security Constraint</label>
                  <textarea
                    rows={4}
                    value={sqlSafetyPrompt}
                    onChange={(e) => setSqlSafetyPrompt(e.target.value)}
                    className="w-full bg-surface-soft/60 border border-hairline-soft rounded-xl p-3 text-xs text-ink placeholder-stone focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary text-canvas rounded-full text-xs font-bold hover:bg-primary-deep shadow-sm transition"
                >
                  Save Prompt Templates
                </button>
              </form>
            </div>
          )}

          {/* Sub-Tab 3: Database */}
          {activeSubTab === 'database' && (
            <div className="space-y-6">
              {/* Table counts */}
              <div className="bg-canvas border border-hairline-soft p-6 rounded-xxxl card-product-shadow space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-ink-deep">Seeded Data Store Stats</h2>
                  <p className="text-[11px] text-stone mt-0.5">Summary of tables resolved within the System Schema.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-surface-soft/60 border border-hairline-soft rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-stone">CaseMaster</span>
                    <div className="text-lg font-bold text-ink-deep mt-1 font-mono">{stats.cases}</div>
                  </div>
                  <div className="p-4 bg-surface-soft/60 border border-hairline-soft rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-stone">Accused</span>
                    <div className="text-lg font-bold text-ink-deep mt-1 font-mono">{stats.accused}</div>
                  </div>
                  <div className="p-4 bg-surface-soft/60 border border-hairline-soft rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-stone">Victim</span>
                    <div className="text-lg font-bold text-ink-deep mt-1 font-mono">{stats.victims}</div>
                  </div>
                  <div className="p-4 bg-surface-soft/60 border border-hairline-soft rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-stone">Complainant</span>
                    <div className="text-lg font-bold text-ink-deep mt-1 font-mono">{stats.complainants}</div>
                  </div>
                </div>
              </div>

              {/* Maintenance operations */}
              <div className="bg-canvas border border-hairline-soft p-6 rounded-xxxl card-product-shadow space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-ink-deep">Database Maintenance</h2>
                  <p className="text-[11px] text-stone mt-0.5">Flush caches or synchronize Vector Database indexes manually.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleFlushCache}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-surface-mid border border-hairline-soft text-steel hover:text-ink-deep hover:bg-surface-strong hover:border-hairline rounded-full text-xs font-bold transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-critical" /> Flush System Cache
                  </button>

                  <button
                    onClick={handleTriggerIndexing}
                    disabled={isRefreshing}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-canvas rounded-full text-xs font-bold hover:bg-primary-deep shadow-sm transition disabled:opacity-75 cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
                    {isRefreshing ? 'Re-indexing...' : 'Refresh Embeddings Index'}
                  </button>
                </div>

                <div className="text-[10px] text-stone font-medium">
                  Last successfully synchronized: {new Date(stats.lastRefresh).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {/* Sub-Tab 4: Logs */}
          {activeSubTab === 'logs' && (
            <div className="bg-canvas border border-hairline-soft p-6 rounded-xxxl card-product-shadow space-y-4">
              <div>
                <h2 className="text-sm font-bold text-ink-deep">Access & Security Logs</h2>
                <p className="text-[11px] text-stone mt-0.5">Chronological record of user mutations, database modifications, and access blocks.</p>
              </div>

              <div className="space-y-2.5">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-surface-soft/60 border border-hairline-soft rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-1">
                      <div className="font-semibold text-ink-deep">{log.action}</div>
                      <div className="text-[10px] text-stone font-medium flex flex-wrap items-center gap-2">
                        <span>User: {log.user}</span>
                        <span>•</span>
                        <span>IP: {log.ip}</span>
                        <span>•</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    <span className={`self-start sm:self-auto text-[9px] font-bold px-2 py-0.5 rounded ${
                      log.status === 'SUCCESS' ? 'bg-success/15 text-success' :
                      log.status === 'WARNING' ? 'bg-attention/15 text-attention' :
                      'bg-critical/15 text-critical'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminConsole() {
  return (
    <I18nProvider>
      <AdminConsoleInner />
    </I18nProvider>
  );
}
