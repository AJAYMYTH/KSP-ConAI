import React, { useState, useEffect } from 'react';
import { getCurrentSession } from '../../lib/auth';
import type { UserSession } from '../../lib/auth';
import { Menu, X, Search, User, LogOut, Globe } from 'lucide-react';

interface NavProps {
  currentPath?: string;
}

export default function Nav({ currentPath = '/' }: NavProps) {
  const [session, setSessionState] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'EN' | 'KN'>('EN');

  useEffect(() => {
    setSessionState(getCurrentSession());
    const saved = localStorage.getItem('ksp_language') as 'EN' | 'KN';
    if (saved === 'EN' || saved === 'KN') {
      setLang(saved);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'EN' ? 'KN' : 'EN';
    setLang(newLang);
    localStorage.setItem('ksp_language', newLang);
    window.dispatchEvent(new CustomEvent('ksp-language-change', { detail: newLang }));
  };

  const navItems = [
    { name: lang === 'EN' ? 'Dashboard' : 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', path: '/dashboard' },
    { name: lang === 'EN' ? 'FIR Search' : 'ಎಫ್‌ಐಆರ್ ಹುಡುಕಾಟ', path: '/search' },
    { name: lang === 'EN' ? 'Hotspot Map' : 'ಹಾಟ್‌ಸ್ಪಾಟ್ ನಕ್ಷೆ', path: '/map' },
    { name: lang === 'EN' ? 'AI Assistant' : 'ಎಐ ಸಹಾಯಕ', path: '/assistant' },
    { name: lang === 'EN' ? 'Reports' : 'ವರದಿಗಳು', path: '/reports' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-canvas border-b border-hairline-soft px-4 md:px-8 flex items-center justify-between">
      {/* Brand Logo */}
      <a href="/" className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg">
        <img src="/karnataka_emblem.png" alt="Government Seal" className="w-9 h-9 object-contain" width="36" height="36" />
        <div className="flex flex-col">
          <span className="font-display font-bold text-base leading-tight tracking-tight text-ink-deep">
            KSP-ConAI
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-steel">
            Crime Intelligence
          </span>
        </div>
      </a>

      {/* Center Nav Tabs (Desktop) */}
      <div className="hidden md:flex items-center gap-1 bg-surface-soft p-1 rounded-full border border-hairline-soft">
        {navItems.map((item) => {
          const isActive = currentPath.startsWith(item.path);
          return (
            <a
              key={item.path}
              href={item.path}
              className={`px-4 py-1.5 text-xs font-bold transition-all duration-150 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                isActive
                  ? 'bg-ink-deep text-canvas shadow-sm'
                  : 'text-ink hover:bg-hairline-soft'
              }`}
            >
              {item.name}
            </a>
          );
        })}
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
          <span>{lang === 'EN' ? 'English' : 'ಕನ್ನಡ'}</span>
        </button>

        {session && (
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
        </div>
      )}
    </nav>
  );
}
