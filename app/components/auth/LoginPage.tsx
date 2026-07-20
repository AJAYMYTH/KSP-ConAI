import React, { useState } from 'react';
import { Lock, User, ArrowRight, Shield, Database, MapPin, Mail, Globe, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { DEMO_USERS, setSession, type UserRole } from '../../lib/auth';
import { RoleSelector } from './RoleSelector';

interface LoginPageProps {
  defaultView?: 'login' | 'register';
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultView = 'login' }) => {
  const { t, currentLanguage, changeLanguage } = useI18n();
  const [view, setView] = useState<'login' | 'register'>(defaultView);
  
  // Login Form states
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register Form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  // Role Selection staging states
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [stagedUser, setStagedUser] = useState<any>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userVal = loginUser.trim().toLowerCase();

    let roleMatch: UserRole = 'investigator';
    if (userVal.includes('admin') || userVal.includes('dayananda')) {
      roleMatch = 'admin';
    } else if (userVal.includes('analyst') || userVal.includes('praveen')) {
      roleMatch = 'analyst';
    } else if (userVal.includes('viewer') || userVal.includes('supervisor')) {
      roleMatch = 'viewer';
    }

    const defaultSession = DEMO_USERS[roleMatch];
    setStagedUser({
      ...defaultSession,
      username: userVal || defaultSession.username
    });
    setShowRoleSelector(true);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStagedUser({
      role: 'investigator',
      name: regName || 'New Officer',
      username: regEmail || 'new.officer@ksp.gov.in',
      badgeNumber: `KSP-${Math.floor(1000 + Math.random() * 9000)}`
    });
    setShowRoleSelector(true);
  };

  const handleGoogleSSO = () => {
    setStagedUser(DEMO_USERS.investigator);
    setShowRoleSelector(true);
  };

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'en' ? 'kn' : 'en';
    changeLanguage(nextLang);
  };

  // Google and Zoho OAuth buttons using button-ghost style:
  // Transparent background, border 2px solid rgba(10, 19, 23, 0.12), rounded full, height 44px
  const socialLoginBlock = (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
        <div className="h-px flex-1 bg-slate-150"></div>
        <span className="shrink-0">{t('login.divider')}</span>
        <div className="h-px flex-1 bg-slate-150"></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSSO}
          className="group flex items-center justify-center gap-2 h-11 px-5 border-2 border-slate-200/60 hover:border-slate-350 bg-transparent active:scale-[0.98] rounded-full text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-fb-blue transition-all duration-150"
        >
          <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        {/* Zoho OAuth */}
        <button
          type="button"
          onClick={handleGoogleSSO}
          className="group flex items-center justify-center gap-2 h-11 px-5 border-2 border-slate-200/60 hover:border-slate-350 bg-transparent active:scale-[0.98] rounded-full text-xs font-bold text-slate-700 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-fb-blue transition-all duration-150"
        >
          <div className="w-4 h-4 bg-amber-500 rounded flex items-center justify-center text-white font-black text-[9px] leading-none select-none shrink-0 transition-transform group-hover:rotate-12 group-hover:scale-110">Z</div>
          Zoho
        </button>
      </div>
    </div>
  );

  const onRoleSelect = (role: UserRole) => {
    if (!stagedUser) return;
    
    let badgeNum = stagedUser.badgeNumber || 'KSP-9999';
    let name = stagedUser.name;
    if (role === 'admin') {
      badgeNum = 'KSP-001';
      name = 'Shri B. Dayananda, IPS';
    } else if (role === 'investigator') {
      badgeNum = 'KSP-4589';
      name = 'Mahesh Kumar (IO)';
    } else if (role === 'analyst') {
      badgeNum = 'KSP-2114';
      name = 'Praveen Gowda (Analyst)';
    } else if (role === 'viewer') {
      badgeNum = 'KSP-009';
      name = 'Inspector General (Supervisor)';
    }

    setSession({
      ...stagedUser,
      role,
      name,
      badgeNumber: badgeNum
    });
    window.location.href = '/dashboard';
  };

  const availableRoles: {
    role: UserRole;
    badge: string;
    icon: React.ReactNode;
    color: string;
    textColor: string;
    borderColor: string;
    permissions: { name: string; allowed: boolean }[];
  }[] = [
    {
      role: 'admin',
      badge: 'KSP-001',
      icon: <Shield className="w-5 h-5" />,
      color: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-100',
      permissions: [
        { name: currentLanguage === 'en' ? 'Dashboard access' : 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', allowed: true },
        { name: currentLanguage === 'en' ? 'FIR Search' : 'ಎಫ್‌ಐಆರ್ ಹುಡುಕಾಟ', allowed: true },
        { name: currentLanguage === 'en' ? 'Hotspot Map' : 'ಹಾಟ್‌ಸ್ಪಾಟ್ ನಕ್ಷೆ', allowed: true },
        { name: currentLanguage === 'en' ? 'AI Assistant' : 'AI ಸಹಾಯಕ', allowed: true },
        { name: currentLanguage === 'en' ? 'Reports Vault' : 'ವರದಿಗಳ ಕನ್ಸೋಲ್', allowed: true },
        { name: currentLanguage === 'en' ? 'Admin Tools' : 'ನಿರ್ವಾಹಕ ಉಪಕರಣಗಳು', allowed: true },
      ]
    },
    {
      role: 'investigator',
      badge: 'KSP-4589',
      icon: <Eye className="w-5 h-5" />,
      color: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-100',
      permissions: [
        { name: currentLanguage === 'en' ? 'Dashboard access' : 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', allowed: true },
        { name: currentLanguage === 'en' ? 'FIR Search' : 'ಎಫ್‌ಐಆರ್ ಹುಡುಕಾಟ', allowed: true },
        { name: currentLanguage === 'en' ? 'Hotspot Map' : 'ಹಾಟ್‌ಸ್ಪಾಟ್ ನಕ್ಷೆ', allowed: true },
        { name: currentLanguage === 'en' ? 'AI Assistant' : 'AI ಸಹಾಯಕ', allowed: true },
        { name: currentLanguage === 'en' ? 'Reports Vault' : 'ವರದಿಗಳ ಕನ್ಸೋಲ್', allowed: true },
        { name: currentLanguage === 'en' ? 'Admin Tools' : 'ನಿರ್ವಾಹಕ ಉಪಕರಣಗಳು', allowed: false },
      ]
    },
    {
      role: 'analyst',
      badge: 'KSP-2114',
      icon: <Database className="w-5 h-5" />,
      color: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-100',
      permissions: [
        { name: currentLanguage === 'en' ? 'Dashboard access' : 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', allowed: true },
        { name: currentLanguage === 'en' ? 'FIR Search' : 'ಎಫ್‌ಐಆರ್ ಹುಡುಕಾಟ', allowed: true },
        { name: currentLanguage === 'en' ? 'Hotspot Map' : 'ಹಾಟ್‌ಸ್ಪಾಟ್ ನಕ್ಷೆ', allowed: true },
        { name: currentLanguage === 'en' ? 'AI Assistant' : 'AI ಸಹಾಯಕ', allowed: true },
        { name: currentLanguage === 'en' ? 'Reports Vault' : 'ವರದಿಗಳ ಕನ್ಸೋಲ್', allowed: true },
        { name: currentLanguage === 'en' ? 'Admin Tools' : 'ನಿರ್ವಾಹಕ ಉಪಕರಣಗಳು', allowed: false },
      ]
    },
    {
      role: 'viewer',
      badge: 'KSP-009',
      icon: <Lock className="w-5 h-5" />,
      color: 'bg-slate-100',
      textColor: 'text-slate-600',
      borderColor: 'border-slate-200',
      permissions: [
        { name: currentLanguage === 'en' ? 'Dashboard access' : 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', allowed: true },
        { name: currentLanguage === 'en' ? 'FIR Search' : 'ಎಫ್‌ಐಆರ್ ಹುಡುಕಾಟ', allowed: true },
        { name: currentLanguage === 'en' ? 'Hotspot Map' : 'ಹಾಟ್‌ಸ್ಪಾಟ್ ನಕ್ಷೆ', allowed: false },
        { name: currentLanguage === 'en' ? 'AI Assistant' : 'AI ಸಹಾಯಕ', allowed: false },
        { name: currentLanguage === 'en' ? 'Reports Vault' : 'ವರದಿಗಳ ಕನ್ಸೋಲ್', allowed: false },
        { name: currentLanguage === 'en' ? 'Admin Tools' : 'ನಿರ್ವಾಹಕ ಉಪಕರಣಗಳು', allowed: false },
      ]
    }
  ];

  if (showRoleSelector) {
    return (
      <div className="flex-grow flex min-h-[100dvh] w-full items-center justify-center bg-[#fbfbfd] p-6 selection:bg-primary-soft selection:text-primary-deep">
        <div className="w-full max-w-4xl p-8 md:p-10 bg-white border border-[#dee3e9] rounded-xxxl shadow-xl shadow-slate-100/50 relative">
          <button 
            type="button"
            onClick={() => setShowRoleSelector(false)}
            className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-350 bg-transparent rounded-full text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer select-none shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentLanguage === 'en' ? 'Back' : 'ಹಿಂದಕ್ಕೆ'}</span>
          </button>
          
          <RoleSelector 
            onRoleSelect={onRoleSelect} 
            availableRoles={availableRoles} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex min-h-[100dvh] w-full font-sans bg-[#fbfbfd] selection:bg-primary-soft selection:text-primary-deep">
      {/* Left Brand Panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-[#080d1a] text-white p-12 relative overflow-hidden select-none border-r border-[#dee3e9]/10">
        {/* Glow ambient orbs */}
        <div className="absolute top-1/4 -left-1/4 w-[80%] h-[50%] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[80%] h-[50%] rounded-full bg-[#0064e0]/10 blur-[100px] pointer-events-none"></div>

        {/* Subtle grid mesh background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Top brand header */}
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-lg flex items-center justify-center">
            <img src="/karnataka_emblem.png" alt="Karnataka Coat of Arms" className="w-9 h-9 object-contain brightness-[1.05]" width="36" height="36" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold tracking-[0.18em] text-blue-400 uppercase leading-none">{t('nav.govKarnataka')}</span>
            <span className="text-sm font-extrabold text-white tracking-tight mt-1.5 font-display">
              KSP-ConAI
            </span>
          </div>
        </div>

        {/* Center Content in the Blue Section */}
        <div className="relative z-10 space-y-7 max-w-sm my-auto pl-2 flex flex-col items-start justify-center">
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm text-[9px] font-bold tracking-wider text-blue-305 uppercase">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              {t('hero.gateway')}
            </div>
            <h1 className="text-3xl font-extrabold text-white leading-[1.16] tracking-tight font-display text-left">
              {currentLanguage === 'en' ? (
                <>
                  Real-time intelligence.<br/>
                  <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">Smarter policing.</span>
                </>
              ) : (
                <>
                  ನೈಜ-ಸಮಯದ ಗುಪ್ತಚರ ಮಾಹಿತಿ.<br/>
                  <span className="bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">ಚುರುಕಾದ ಪೊಲೀಸಿಂಗ್.</span>
                </>
              )}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed text-left font-medium">
              {t('hero.description')}
            </p>
          </div>

          {/* Feature bullets - rounded-xl (16px) */}
          <div className="space-y-3 w-full pt-1.5">
            {[
              { icon: Shield, text: t('login.bullet1') },
              { icon: Database, text: t('login.bullet2') },
              { icon: MapPin, text: t('login.bullet3') },
            ].map(({ icon: Icon, text }, idx) => (
              <div 
                key={idx} 
                className="group/item flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.02] hover:border-white/[0.06] transition-all duration-200 text-xs text-slate-300 font-medium"
              >
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 transition-all duration-200 group-hover/item:bg-blue-600/20 group-hover/item:border-blue-500/30">
                  <Icon className="w-3.5 h-3.5 text-blue-400 transition-transform duration-200 group-hover/item:scale-110" />
                </div>
                <span className="transition-colors duration-200 group-hover/item:text-white">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Empty bottom space to balance layout */}
        <div className="h-12 shrink-0"></div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-between px-6 py-10 md:px-16 lg:px-20 relative">
        {/* Top Header controls (bilingual toggle in card-pill-tab active/inactive style) */}
        <div className="flex justify-end relative z-10">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-full text-[10px] font-bold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-fb-blue transition-all duration-150 cursor-pointer select-none shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{currentLanguage === 'en' ? 'English' : 'ಕನ್ನಡ'}</span>
          </button>
        </div>

        {/* Form Container: card-product-feature styled - rounded-xxxl (32px), border 1px solid hairline-soft */}
        <div className="flex-grow flex items-center justify-center my-6 relative z-10">
          <div className="w-full max-w-sm space-y-7 bg-white p-8 md:p-10 rounded-xxxl border border-[#dee3e9] shadow-xl shadow-slate-100/50">
            {/* ======== LOGIN VIEW ======== */}
            {view === 'login' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold tracking-widest text-primary uppercase">{t('hero.gateway')}</div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display">{t('login.title')}</h2>
                  <p className="text-xs text-slate-500 font-medium">{t('login.subtitle')}</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* User input: height 44px, border hairline, rounded lg (8px), focus border 2px solid fb-blue */}
                  <div className="space-y-1.5">
                    <label htmlFor="login-username" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('login.usernameLabel')}</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-fb-blue transition-colors" />
                      <input
                        type="text"
                        id="login-username"
                        required
                        value={loginUser}
                        onChange={(e) => setLoginUser(e.target.value)}
                        placeholder={t('login.usernamePlaceholder')}
                        className="w-full pl-10 pr-4 bg-white border border-[#ced0d4] hover:border-slate-350 focus:border-2 focus:border-fb-blue focus:ring-0 rounded-lg text-xs text-slate-900 placeholder-slate-400 h-11 transition-all duration-150 outline-none"
                      />
                    </div>
                  </div>

                  {/* Password input: height 44px, border hairline, rounded lg (8px), focus border 2px solid fb-blue */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label htmlFor="login-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('login.passwordLabel')}</label>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-fb-blue transition-colors" />
                      <input
                        type={showLoginPass ? "text" : "password"}
                        id="login-password"
                        required
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder={t('login.passwordPlaceholder')}
                        className="w-full pl-10 pr-10 bg-white border border-[#ced0d4] hover:border-slate-350 focus:border-2 focus:border-fb-blue focus:ring-0 rounded-lg text-xs text-slate-900 placeholder-slate-400 h-11 transition-all duration-150 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none rounded"
                        aria-label={showLoginPass ? "Hide password" : "Show password"}
                      >
                        {showLoginPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Primary submit button buy-cta style: bg-primary, active bg-primary-deep, rounded full, height 44px */}
                  <button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary-deep active:bg-primary-deep text-white font-bold rounded-full text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-fb-blue transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 mt-2 font-display"
                  >
                    {t('login.submitBtn')} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {socialLoginBlock}

                <div className="h-px bg-slate-100"></div>

                <p className="text-center text-[11px] text-slate-400 font-medium">
                  {t('login.noAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setView('register')}
                    className="text-primary hover:text-primary-deep hover:underline font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-fb-blue rounded-sm cursor-pointer bg-transparent border-0 p-0"
                  >
                    {t('login.requestAccess')}
                  </button>
                </p>
              </div>
            )}

            {/* ======== REQUEST ACCESS VIEW (REGISTER) ======== */}
            {view === 'register' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-1">
                  <div className="text-[10px] font-bold tracking-widest text-primary uppercase">{t('hero.gateway')}</div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display">{t('login.regTitle')}</h2>
                  <p className="text-xs text-slate-500 font-medium">{t('login.regSubtitle')}</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Name field: height 44px, border hairline, rounded lg (8px), focus border 2px solid fb-blue */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('login.regNameLabel')}</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-fb-blue transition-colors" />
                      <input
                        type="text"
                        id="reg-name"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={t('login.regNamePlaceholder')}
                        className="w-full pl-10 pr-4 bg-white border border-[#ced0d4] hover:border-slate-350 focus:border-2 focus:border-fb-blue focus:ring-0 rounded-lg text-xs text-slate-900 placeholder-slate-400 h-11 transition-all duration-150 outline-none"
                      />
                    </div>
                  </div>

                  {/* Email field: height 44px, border hairline, rounded lg (8px), focus border 2px solid fb-blue */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('login.regEmailLabel')}</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-fb-blue transition-colors" />
                      <input
                        type="email"
                        id="reg-email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder={t('login.regEmailPlaceholder')}
                        className="w-full pl-10 pr-4 bg-white border border-[#ced0d4] hover:border-slate-350 focus:border-2 focus:border-fb-blue focus:ring-0 rounded-lg text-xs text-slate-900 placeholder-slate-400 h-11 transition-all duration-150 outline-none"
                      />
                    </div>
                  </div>

                  {/* Password field: height 44px, border hairline, rounded lg (8px), focus border 2px solid fb-blue */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('login.regPasswordLabel')}</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-fb-blue transition-colors" />
                      <input
                        type={showRegPass ? "text" : "password"}
                        id="reg-password"
                        required
                        value={regPass}
                        onChange={(e) => setRegPass(e.target.value)}
                        placeholder={t('login.regPasswordPlaceholder')}
                        className="w-full pl-10 pr-10 bg-white border border-[#ced0d4] hover:border-slate-350 focus:border-2 focus:border-fb-blue focus:ring-0 rounded-lg text-xs text-slate-900 placeholder-slate-400 h-11 transition-all duration-150 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPass(!showRegPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none rounded"
                        aria-label={showRegPass ? "Hide password" : "Show password"}
                      >
                        {showRegPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Primary submit button buy-cta style: bg-primary, active bg-primary-deep, rounded full, height 44px */}
                  <button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary-deep active:bg-primary-deep text-white font-bold rounded-full text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-fb-blue transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 mt-2 font-display"
                  >
                    {t('login.regSubmitBtn')} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {socialLoginBlock}

                <div className="h-px bg-slate-100"></div>

                <p className="text-center text-[11px] text-slate-400 font-medium">
                  {t('login.hasAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-primary hover:text-primary-deep hover:underline font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-fb-blue rounded-sm cursor-pointer bg-transparent border-0 p-0"
                  >
                    {t('login.signInLink')}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom footer text */}
        <div className="text-center text-[9px] text-slate-400 font-semibold uppercase tracking-wider relative z-10">
          {currentLanguage === 'en' 
            ? 'Karnataka State Police · Datathon 2026' 
            : 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ · ದತ್ತಾಂಶ ಹಬ್ಬ ೨೦೨೬'}
        </div>
      </div>
    </div>
  );
};
