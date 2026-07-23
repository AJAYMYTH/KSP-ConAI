import React, { useState, useEffect } from 'react';
import { Lock, User, ArrowRight, Shield, Database, MapPin, Mail, Globe, Eye, EyeOff, Check } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { DEMO_USERS, setSession, type UserRole } from '../../lib/auth';

interface LoginPageProps {
  defaultView?: 'login' | 'register';
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultView = 'login' }) => {
  const { t, currentLanguage, changeLanguage } = useI18n();
  const [view, setView] = useState<'login' | 'register'>(defaultView);
  
  // Selected role directly on the login form
  const [selectedRole, setSelectedRole] = useState<UserRole>('investigator');

  // Login Form states
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);

  // Register Form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);

  // Automatically update credentials when role changes to assist demo login
  useEffect(() => {
    if (view === 'login') {
      const demoUser = DEMO_USERS[selectedRole];
      setLoginUser(demoUser.username);
      setLoginPass('••••••••');
    }
  }, [view, selectedRole]);

  // Zoho Catalyst Web SDK Auth initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).catalyst?.auth) {
      const container = document.getElementById('loginDivElementId');
      if (container) {
        try {
          const config = { service_url: "/app/dashboard.html" };
          (window as any).catalyst?.auth?.signIn?.("loginDivElementId", config);
        } catch (err) {
          console.warn("Catalyst SDK Auth initialization:", err);
        }
      }
    }
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userVal = loginUser.trim().toLowerCase();

    const defaultSession = DEMO_USERS[selectedRole];
    let badgeNum = defaultSession.badgeNumber || 'KSP-9999';
    let name = defaultSession.name;
    if (selectedRole === 'admin') {
      badgeNum = 'KSP-001';
      name = 'Shri B. Dayananda, IPS';
    } else if (selectedRole === 'investigator') {
      badgeNum = 'KSP-4589';
      name = 'Mahesh Kumar (IO)';
    } else if (selectedRole === 'analyst') {
      badgeNum = 'KSP-2114';
      name = 'Praveen Gowda (Analyst)';
    } else if (selectedRole === 'viewer') {
      badgeNum = 'KSP-009';
      name = 'Inspector General (Supervisor)';
    }

    setSession({
      ...defaultSession,
      username: userVal || defaultSession.username,
      role: selectedRole,
      name,
      badgeNumber: badgeNum,
      token: `mock-jwt-token-for-ksp-catalyst-${selectedRole}`
    });
    window.location.href = '/app/dashboard.html';
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let badgeNum = `KSP-${Math.floor(1000 + Math.random() * 9000)}`;
    let name = regName || 'New Officer';
    if (selectedRole === 'admin') {
      badgeNum = 'KSP-001';
      name = regName || 'Shri B. Dayananda, IPS';
    } else if (selectedRole === 'investigator') {
      badgeNum = 'KSP-4589';
      name = regName || 'Mahesh Kumar (IO)';
    } else if (selectedRole === 'analyst') {
      badgeNum = 'KSP-2114';
      name = regName || 'Praveen Gowda (Analyst)';
    } else if (selectedRole === 'viewer') {
      badgeNum = 'KSP-009';
      name = regName || 'Inspector General (Supervisor)';
    }

    setSession({
      role: selectedRole,
      name,
      username: regEmail || 'officer.name@ksp.gov.in',
      badgeNumber: badgeNum,
      token: `mock-jwt-token-for-ksp-catalyst-${selectedRole}`
    });
    window.location.href = '/app/dashboard.html';
  };

  const handleGoogleSSO = () => {
    const defaultSession = DEMO_USERS[selectedRole];
    let badgeNum = defaultSession.badgeNumber || 'KSP-9999';
    let name = defaultSession.name;
    if (selectedRole === 'admin') {
      badgeNum = 'KSP-001';
      name = 'Shri B. Dayananda, IPS';
    } else if (selectedRole === 'investigator') {
      badgeNum = 'KSP-4589';
      name = 'Mahesh Kumar (IO)';
    } else if (selectedRole === 'analyst') {
      badgeNum = 'KSP-2114';
      name = 'Praveen Gowda (Analyst)';
    } else if (selectedRole === 'viewer') {
      badgeNum = 'KSP-009';
      name = 'Inspector General (Supervisor)';
    }

    setSession({
      ...defaultSession,
      role: selectedRole,
      name,
      badgeNumber: badgeNum,
      token: `mock-jwt-token-for-ksp-catalyst-${selectedRole}`
    });
    window.location.href = '/app/dashboard.html';
  };

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'en' ? 'kn' : 'en';
    changeLanguage(nextLang);
  };

  const socialLoginBlock = (
    <div className="space-y-4 pt-2">
      <div id="loginDivElementId" className="w-full min-h-[10px]"></div>
      <div className="flex items-center gap-3 text-[9px] text-[#8595a4] font-bold uppercase tracking-wider">
        <div className="h-px flex-1 bg-[#dee3e9]"></div>
        <span className="shrink-0 font-mono">OR CONTINUE WITH</span>
        <div className="h-px flex-1 bg-[#dee3e9]"></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleGoogleSSO}
          className="group flex items-center justify-center gap-2.5 h-11 px-5 border border-[#dee3e9] hover:border-slate-300 bg-white active:scale-[0.98] rounded-full text-xs font-bold text-[#0a1317] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0064e0] transition-all duration-150 shadow-2xs"
        >
          <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <button
          type="button"
          onClick={handleGoogleSSO}
          className="group flex items-center justify-center gap-2.5 h-11 px-5 border border-[#dee3e9] hover:border-slate-300 bg-white active:scale-[0.98] rounded-full text-xs font-bold text-[#0a1317] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0064e0] transition-all duration-150 shadow-2xs"
        >
          <div className="w-4 h-4 bg-amber-500 rounded flex items-center justify-center text-white font-black text-[9px] leading-none select-none shrink-0 transition-transform group-hover:rotate-12 group-hover:scale-110">Z</div>
          Zoho
        </button>
      </div>
    </div>
  );

  const availableRoles: {
    role: UserRole;
    badge: string;
    icon: React.ReactNode;
  }[] = [
    {
      role: 'admin',
      badge: 'KSP-001',
      icon: <Shield className="w-4 h-4" />
    },
    {
      role: 'investigator',
      badge: 'KSP-4589',
      icon: <Eye className="w-4 h-4" />
    },
    {
      role: 'analyst',
      badge: 'KSP-2114',
      icon: <Database className="w-4 h-4" />
    },
    {
      role: 'viewer',
      badge: 'KSP-009',
      icon: <Lock className="w-4 h-4" />
    }
  ];

  const headingStyle = {
    fontFeatureSettings: '"ss01" on, "ss02" on'
  };

  return (
    <div className="flex min-h-[100dvh] w-full font-sans bg-[#fbfbfd] text-[#0a1317] selection:bg-primary-soft selection:text-primary-deep">
      
      {/* ================= LEFT BRAND HERO PANEL ================= */}
      <div className="hidden lg:flex flex-col justify-between w-[46%] bg-[#080d1a] text-white p-12 lg:p-16 relative overflow-hidden select-none border-r border-[#dee3e9]/10">
        
        {/* Glow ambient background lights */}
        <div className="absolute top-1/4 -left-1/4 w-[80%] h-[50%] rounded-full bg-[#0064e0]/15 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[80%] h-[50%] rounded-full bg-[#0064e0]/10 blur-[120px] pointer-events-none"></div>

        {/* Subtle grid mesh background */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Top Header Logo Seal */}
        <div className="relative z-10 flex items-center gap-3.5 shrink-0">
          <img src="/app/karnataka_emblem.png" alt="Karnataka State Emblem" className="w-10 h-10 object-contain brightness-[1.08]" width="40" height="40" />
          <div className="flex flex-col text-left">
            <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-slate-400 uppercase leading-none">
              {t('nav.govKarnataka')}
            </span>
            <span className="text-base font-extrabold text-white tracking-tight mt-1 font-display" style={headingStyle}>
              KSP-ConAI
            </span>
          </div>
        </div>

        {/* Center Content Section */}
        <div className="relative z-10 space-y-8 max-w-md my-auto flex flex-col justify-center">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-sm text-[9.5px] font-bold tracking-widest text-blue-300 uppercase font-mono w-fit">
              <Shield className="w-3.5 h-3.5 text-[#0064e0]" />
              <span>CORE GATEWAY</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-medium text-white leading-[1.12] tracking-tight font-display text-left" style={headingStyle}>
              {currentLanguage === 'en' ? (
                <>
                  Real-time intelligence.<br/>
                  <span className="text-[#0064e0] font-medium">Smarter policing.</span>
                </>
              ) : (
                <>
                  ನೈಜ-ಸಮಯದ ಗುಪ್ತಚರ ಮಾಹಿತಿ.<br/>
                  <span className="text-[#0064e0] font-medium">ಚುರುಕಾದ ಪೊಲೀಸಿಂಗ್.</span>
                </>
              )}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-[1.60] text-left font-medium">
              {t('hero.description')}
            </p>
          </div>

          {/* 3 Pill Feature Items matching reference screenshot */}
          <div className="space-y-3.5 w-full">
            {[
              { icon: Shield, text: t('login.bullet1') },
              { icon: Database, text: t('login.bullet2') },
              { icon: MapPin, text: t('login.bullet3') }
            ].map(({ icon: Icon, text }, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] transition-all duration-200 text-xs text-slate-200 font-medium"
              >
                <div className="w-7 h-7 rounded-xl bg-[#0064e0]/20 border border-[#0064e0]/30 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info line */}
        <div className="relative z-10 text-[9px] text-slate-500 font-mono tracking-widest uppercase">
          OFFICIAL LAW ENFORCEMENT PORTAL · KSP DATATHON 2026
        </div>
      </div>

      {/* ================= RIGHT FORM PANEL ================= */}
      <div className="flex-1 flex flex-col justify-between px-6 py-8 md:px-12 lg:px-16 relative bg-[#fbfbfd]">
        
        {/* Top Right Language Switcher */}
        <div className="flex justify-end relative z-10">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#dee3e9] hover:border-slate-300 rounded-full text-xs font-bold text-[#0a1317] hover:bg-slate-50 transition duration-150 cursor-pointer shadow-2xs font-display"
          >
            <Globe className="w-3.5 h-3.5 text-[#5d6c7b]" />
            <span>{currentLanguage === 'en' ? 'English' : 'ಕನ್ನಡ'}</span>
          </button>
        </div>

        {/* Form Container Card */}
        <div className="flex-grow flex items-center justify-center my-6 relative z-10">
          <div className="w-full max-w-md space-y-6 bg-white p-8 md:p-10 rounded-3xl border border-[#dee3e9] shadow-md">
            
            {/* ======== LOGIN VIEW ======== */}
            {view === 'login' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Header Titles */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-widest text-[#0064e0] uppercase font-mono block">CORE GATEWAY</span>
                  <h2 className="text-2xl font-bold text-[#0a1317] tracking-tight font-display" style={headingStyle}>{t('login.title')}</h2>
                  <p className="text-xs text-[#5d6c7b] font-medium">{t('login.subtitle')}</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  
                  {/* Security Role Selector Grid (matching image exactly) */}
                  <div className="space-y-2">
                    <label className="text-[9.5px] font-bold text-[#5d6c7b] uppercase tracking-wider font-mono block">
                      {currentLanguage === 'en' ? 'SELECT SECURITY ROLE' : 'ಸುರಕ್ಷತಾ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆಮಾಡಿ'}
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {availableRoles.map((roleConfig) => {
                        const isSelected = selectedRole === roleConfig.role;
                        const title = t(`roles.${roleConfig.role}.title`);
                        const badge = t(`roles.${roleConfig.role}.badge`) || roleConfig.badge;
                        return (
                          <button
                            key={roleConfig.role}
                            type="button"
                            onClick={() => setSelectedRole(roleConfig.role)}
                            className={`group relative flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer select-none ${
                              isSelected
                                ? 'border-[#0064e0] bg-[#0064e0]/5 ring-1 ring-[#0064e0]'
                                : 'border-[#dee3e9] hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#0064e0] text-white shadow-2xs' : 'bg-slate-100 text-[#5d6c7b]'}`}>
                              {React.cloneElement(roleConfig.icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className={`text-[11px] font-bold truncate leading-tight ${isSelected ? 'text-[#0064e0]' : 'text-[#0a1317]'}`}>
                                {title}
                              </div>
                              <div className="text-[8.5px] text-[#8595a4] font-semibold tracking-wider mt-0.5 uppercase font-mono">
                                {badge}
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#0064e0] absolute top-2 right-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Username / Official Email Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="login-username" className="text-[9.5px] font-bold text-[#5d6c7b] uppercase tracking-wider font-mono block">
                      OFFICIAL EMAIL / USERNAME
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8595a4] group-focus-within:text-[#0064e0] transition-colors" />
                      <input
                        type="text"
                        id="login-username"
                        required
                        value={loginUser}
                        onChange={(e) => setLoginUser(e.target.value)}
                        placeholder="officer.name@ksp.gov.in"
                        className="w-full pl-10 pr-4 bg-white border border-[#dee3e9] hover:border-slate-350 focus:border-[#0064e0] focus:ring-2 focus:ring-[#0064e0]/20 rounded-2xl text-xs text-[#0a1317] placeholder-[#8595a4] h-11 transition-all duration-150 outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="login-password" className="text-[9.5px] font-bold text-[#5d6c7b] uppercase tracking-wider font-mono block">
                      PASSWORD
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8595a4] group-focus-within:text-[#0064e0] transition-colors" />
                      <input
                        type={showLoginPass ? "text" : "password"}
                        id="login-password"
                        required
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full pl-10 pr-10 bg-white border border-[#dee3e9] hover:border-slate-350 focus:border-[#0064e0] focus:ring-2 focus:ring-[#0064e0]/20 rounded-2xl text-xs text-[#0a1317] placeholder-[#8595a4] h-11 transition-all duration-150 outline-none font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPass(!showLoginPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#8595a4] hover:text-[#0a1317] focus:outline-none rounded"
                        aria-label={showLoginPass ? "Hide password" : "Show password"}
                      >
                        {showLoginPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <button
                    type="submit"
                    className="w-full h-12 bg-[#0064e0] hover:bg-[#0457cb] active:scale-[0.98] text-white font-bold rounded-full text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0064e0] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-md font-display mt-2"
                  >
                    <span>Sign In</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {socialLoginBlock}

                <div className="h-px bg-[#dee3e9]"></div>

                <p className="text-center text-xs text-[#5d6c7b] font-medium">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setView('register')}
                    className="text-[#0064e0] hover:underline font-bold focus:outline-none cursor-pointer bg-transparent border-0 p-0 ml-1"
                  >
                    Request access
                  </button>
                </p>
              </div>
            )}

            {/* ======== REQUEST ACCESS VIEW (REGISTER) ======== */}
            {view === 'register' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                
                {/* Header Titles */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-widest text-[#0064e0] uppercase font-mono block">CORE GATEWAY</span>
                  <h2 className="text-2xl font-bold text-[#0a1317] tracking-tight font-display" style={headingStyle}>Request access</h2>
                  <p className="text-xs text-[#5d6c7b] font-medium">Submit your details for administrator review.</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  
                  {/* Security Role Selector Grid */}
                  <div className="space-y-2">
                    <label className="text-[9.5px] font-bold text-[#5d6c7b] uppercase tracking-wider font-mono block">
                      SELECT SECURITY ROLE
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {availableRoles.map((roleConfig) => {
                        const isSelected = selectedRole === roleConfig.role;
                        const title = t(`roles.${roleConfig.role}.title`);
                        const badge = t(`roles.${roleConfig.role}.badge`) || roleConfig.badge;
                        return (
                          <button
                            key={roleConfig.role}
                            type="button"
                            onClick={() => setSelectedRole(roleConfig.role)}
                            className={`group relative flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all duration-150 cursor-pointer select-none ${
                              isSelected
                                ? 'border-[#0064e0] bg-[#0064e0]/5 ring-1 ring-[#0064e0]'
                                : 'border-[#dee3e9] hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#0064e0] text-white shadow-2xs' : 'bg-slate-100 text-[#5d6c7b]'}`}>
                              {React.cloneElement(roleConfig.icon as React.ReactElement, { className: 'w-3.5 h-3.5' })}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className={`text-[11px] font-bold truncate leading-tight ${isSelected ? 'text-[#0064e0]' : 'text-[#0a1317]'}`}>
                                {title}
                              </div>
                              <div className="text-[8.5px] text-[#8595a4] font-semibold tracking-wider mt-0.5 uppercase font-mono">
                                {badge}
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#0064e0] absolute top-2 right-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Full Name field */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-name" className="text-[9.5px] font-bold text-[#5d6c7b] uppercase tracking-wider font-mono block">
                      FULL NAME
                    </label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8595a4] group-focus-within:text-[#0064e0] transition-colors" />
                      <input
                        type="text"
                        id="reg-name"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Officer Full Name"
                        className="w-full pl-10 pr-4 bg-white border border-[#dee3e9] hover:border-slate-350 focus:border-[#0064e0] focus:ring-2 focus:ring-[#0064e0]/20 rounded-2xl text-xs text-[#0a1317] placeholder-[#8595a4] h-11 transition-all duration-150 outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* Official Email field */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-email" className="text-[9.5px] font-bold text-[#5d6c7b] uppercase tracking-wider font-mono block">
                      OFFICIAL EMAIL
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8595a4] group-focus-within:text-[#0064e0] transition-colors" />
                      <input
                        type="email"
                        id="reg-email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="officer.name@ksp.gov.in"
                        className="w-full pl-10 pr-4 bg-white border border-[#dee3e9] hover:border-slate-350 focus:border-[#0064e0] focus:ring-2 focus:ring-[#0064e0]/20 rounded-2xl text-xs text-[#0a1317] placeholder-[#8595a4] h-11 transition-all duration-150 outline-none font-medium"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-password" className="text-[9.5px] font-bold text-[#5d6c7b] uppercase tracking-wider font-mono block">
                      SET PASSWORD
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8595a4] group-focus-within:text-[#0064e0] transition-colors" />
                      <input
                        type={showRegPass ? "text" : "password"}
                        id="reg-password"
                        required
                        value={regPass}
                        onChange={(e) => setRegPass(e.target.value)}
                        placeholder="Min. 8 characters"
                        className="w-full pl-10 pr-10 bg-white border border-[#dee3e9] hover:border-slate-350 focus:border-[#0064e0] focus:ring-2 focus:ring-[#0064e0]/20 rounded-2xl text-xs text-[#0a1317] placeholder-[#8595a4] h-11 transition-all duration-150 outline-none font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPass(!showRegPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#8595a4] hover:text-[#0a1317] focus:outline-none rounded"
                        aria-label={showRegPass ? "Hide password" : "Show password"}
                      >
                        {showRegPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <button
                    type="submit"
                    className="w-full h-12 bg-[#0064e0] hover:bg-[#0457cb] active:scale-[0.98] text-white font-bold rounded-full text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0064e0] transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 shadow-md font-display mt-2"
                  >
                    <span>Create Account</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {socialLoginBlock}

                <div className="h-px bg-[#dee3e9]"></div>

                <p className="text-center text-xs text-[#5d6c7b] font-medium">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-[#0064e0] hover:underline font-bold focus:outline-none cursor-pointer bg-transparent border-0 p-0 ml-1"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Footer Notice */}
        <div className="text-center text-[9.5px] text-[#8595a4] font-semibold uppercase tracking-wider relative z-10 font-mono">
          {currentLanguage === 'en' 
            ? 'Karnataka State Police · Datathon 2026' 
            : 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ · ದತ್ತಾಂಶ ಹಬ್ಬ ೨೦೨೬'}
        </div>
      </div>
    </div>
  );
};
