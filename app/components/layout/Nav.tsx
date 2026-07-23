import React, { useState, useEffect } from 'react';
import { getCurrentSession, PERMISSIONS, hasPermission, clearSession } from '../../lib/auth';
import type { UserSession } from '../../lib/auth';
import { Menu, X, Search, User, LogOut, Globe } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { IS_MOCK_MODE } from '../../lib/api';

interface NavProps {
  currentPath?: string;
}

export default function Nav({ currentPath = '/' }: NavProps) {
  const { t, currentLanguage, changeLanguage } = useI18n();
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSessionState(getCurrentSession());
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'en' ? 'kn' : 'en';
    changeLanguage(nextLang);
  };

  const navItems = mounted && session ? [
    { name: t('nav.dashboard'), path: '/app/dashboard.html', perm: PERMISSIONS.VIEW_DASHBOARD },
    { name: t('nav.search'), path: '/app/search.html', perm: PERMISSIONS.SEARCH_FIRS },
    { name: t('nav.map'), path: '/app/map.html', perm: PERMISSIONS.VIEW_MAP },
    { name: t('nav.assistant'), path: '/app/assistant.html', perm: PERMISSIONS.USE_ASSISTANT },
    { name: t('nav.graph'), path: '/app/graph.html', perm: PERMISSIONS.VIEW_GRAPH },
    { name: t('nav.reports'), path: '/app/reports.html', perm: PERMISSIONS.GENERATE_REPORTS },
    { name: currentLanguage === 'en' ? 'Profiling' : 'ಪ್ರೊಫೈಲಿಂಗ್', path: '/app/profiling.html', perm: PERMISSIONS.VIEW_CASE_DETAIL_FULL },
    { name: currentLanguage === 'en' ? 'Compliance' : 'ಅನುಸರಣೆ', path: '/app/compliance.html', perm: PERMISSIONS.VIEW_AUDIT_LOGS }
  ].filter(item => hasPermission(item.perm)) : [];

  const hasAdminPermission = mounted && session && hasPermission(PERMISSIONS.ACCESS_ADMIN_TOOLS);

  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-canvas border-b border-hairline-soft px-4 md:px-8 flex items-center justify-between">
      {/* Brand Logo and Status Badge */}
      <div className="flex items-center gap-4">
        <a href="/app/dashboard.html" className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg">
          <img src="/karnataka_emblem.png" alt="Government Seal" className="w-9 h-9 object-contain" width="36" height="36" />
          <div className="flex flex-col">
            <span className="font-display font-bold text-base leading-tight tracking-tight text-ink-deep">
              KSP-ConAI
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-steel">
              {currentLanguage === 'en' ? 'Crime Intelligence' : 'ಅಪರಾಧ ಗುಪ್ತಚರ'}
            </span>
          </div>
        </a>

        {/* Live vs Mock Status Badge */}
        {mounted && (
          <div className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-wider select-none ${
            IS_MOCK_MODE 
              ? 'bg-amber-50/50 border-amber-200/60 text-amber-600'
              : 'bg-emerald-50/50 border-emerald-250/60 text-emerald-600'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${IS_MOCK_MODE ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span>{IS_MOCK_MODE ? 'Sandbox' : 'Live Catalyst'}</span>
          </div>
        )}
      </div>

      {/* Center Nav Tabs (Desktop & Tablet) */}
      <div className="hidden md:flex items-center gap-1 bg-surface-soft p-1 rounded-full border border-hairline-soft">
        {navItems.map((item) => {
          const itemKey = item.path.replace('.html', '').split('/').pop() || '';
          const isActive = currentPath.includes(itemKey);
          return (
            <a
              key={item.path}
              href={item.path}
              className={`px-3 lg:px-4 py-1.5 text-[11px] lg:text-xs font-bold transition-all duration-150 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                isActive
                  ? 'bg-ink-deep text-canvas shadow-sm'
                  : 'text-ink hover:bg-hairline-soft'
              }`}
            >
              {item.name}
            </a>
          );
        })}
        {hasAdminPermission && (
          <a
            href="/app/admin.html"
            className={`px-3 lg:px-4 py-1.5 text-[11px] lg:text-xs font-bold transition-all duration-150 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              currentPath.includes('admin')
                ? 'bg-ink-deep text-canvas shadow-sm'
                : 'text-ink hover:bg-hairline-soft'
            }`}
          >
            {currentLanguage === 'en' ? 'Admin' : 'ನಿರ್ವಾಹಕರು'}
          </a>
        )}
      </div>

      {/* Right Actions & Role Swapper */}
      <div className="flex items-center gap-3">
        {/* Global Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-soft border border-hairline-soft hover:bg-hairline hover:border-steel rounded-full text-[10px] font-bold text-ink cursor-pointer transition select-none"
          aria-label="Toggle language between English and Kannada"
        >
          <Globe className="w-3.5 h-3.5 text-stone" />
          <span>{currentLanguage === 'en' ? 'English' : 'ಕನ್ನಡ'}</span>
        </button>

        {session && (
          <>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-hairline-soft bg-surface-soft select-none">
              <div className="w-6 h-6 rounded-circle bg-ink-deep text-canvas text-[10px] font-bold flex items-center justify-center">
                {session.role.substring(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-ink-deep leading-none">{session.name}</span>
                <span className="text-[9px] text-steel font-medium leading-tight mt-0.5 uppercase tracking-wider">
                  {session.role} ({session.badgeNumber})
                </span>
              </div>
            </div>
            
            <button
              onClick={() => {
                clearSession();
                window.location.href = '/app/login.html';
              }}
              className="p-2 border border-hairline-soft bg-surface-soft hover:bg-rose-50 hover:text-critical rounded-full transition cursor-pointer select-none text-slate-500 flex items-center justify-center"
              title={currentLanguage === 'en' ? 'Log Out' : 'ನೀರ್ಗಮಿಸಿ'}
              aria-label="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-ink hover:bg-surface-soft rounded-circle focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-canvas border-b border-hairline-soft shadow-md py-4 px-6 flex flex-col gap-3 md:hidden z-40 animate-in slide-in-from-top-4 duration-150">
          <div className="text-[10px] font-bold text-stone uppercase tracking-wider">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = currentPath.startsWith(item.path);
            return (
              <a
                key={item.path}
                href={item.path}
                className={`py-2 px-3 rounded-lg text-sm font-bold flex items-center ${
                  isActive ? 'bg-surface-soft text-primary' : 'text-ink hover:bg-surface-soft'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            );
          })}
          {hasAdminPermission && (
            <a
              href="/admin"
              className={`py-2 px-3 rounded-lg text-sm font-bold flex items-center ${
                currentPath.startsWith('/admin') ? 'bg-surface-soft text-primary' : 'text-ink hover:bg-surface-soft'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {currentLanguage === 'en' ? 'Admin Tools' : 'ನಿರ್ವಾಹಕ ಉಪಕರಣಗಳು'}
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
