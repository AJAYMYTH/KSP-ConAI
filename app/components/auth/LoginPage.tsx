import React, { useState } from 'react';
import { Lock, User, ArrowRight, Shield, Database, MapPin, Mail, Globe } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { DEMO_USERS, setSession, type UserRole } from '../../lib/auth';

interface LoginPageProps {
  defaultView?: 'login' | 'register';
}

export const LoginPage: React.FC<LoginPageProps> = ({ defaultView = 'login' }) => {
  const { t, currentLanguage, changeLanguage } = useI18n();
  const [view, setView] = useState<'login' | 'register'>(defaultView);
  
  // Login Form states
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register Form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');

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
    setSession({
      ...defaultSession,
      username: userVal || defaultSession.username
    });
    window.location.href = '/dashboard';
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSession({
      role: 'investigator',
      name: regName || 'New Officer',
      username: regEmail || 'new.officer@ksp.gov.in',
      badgeNumber: `KSP-${Math.floor(1000 + Math.random() * 9000)}`
    });
    window.location.href = '/dashboard';
  };

  const handleGoogleSSO = () => {
    setSession(DEMO_USERS.investigator);
    window.location.href = '/dashboard';
  };

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'en' ? 'kn' : 'en';
    changeLanguage(nextLang);
  };

  const socialLoginBlock = (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
        <hr className="w-full border-slate-200" />
        <span className="shrink-0">{t('login.divider')}</span>
        <hr className="w-full border-slate-200" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSSO}
          className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all shadow-xs"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
          className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] rounded-xl text-xs font-semibold text-slate-700 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all shadow-xs"
        >
          <div className="w-4 h-4 bg-amber-500 rounded flex items-center justify-center text-white font-black text-[10px] leading-none select-none shrink-0">Z</div>
          Zoho
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex min-h-[100dvh] w-full font-sans bg-white">
      {/* Left Brand Panel (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] bg-gov-navy text-white p-12 relative overflow-hidden select-none">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        {/* Top brand: Government of Karnataka logo / badge with text */}
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <img src="/karnataka_emblem.png" alt="Karnataka Coat of Arms" className="w-10 h-10 object-contain brightness-[1.1]" width="40" height="40" />
          <div className="border-l border-white/20 pl-3">
            <div className="text-[9px] font-semibold tracking-widest text-white/50 uppercase leading-none">{t('nav.govKarnataka')}</div>
            <div className="text-sm font-bold text-white tracking-tight mt-0.5 font-display">{t('appName')}</div>
          </div>
        </div>

        {/* Center Content in the Blue Section */}
        <div className="relative z-10 space-y-6 max-w-sm my-auto pl-2 flex flex-col items-start justify-center">
          <div className="space-y-3">
            <div className="text-[10px] font-bold tracking-widest text-blue-400/80 uppercase">{t('hero.gateway')}</div>
            <h1 className="text-3xl font-bold text-white leading-tight tracking-tight font-display text-left">
              {currentLanguage === 'en' ? (
                <>
                  Real-time intelligence.<br/>
                  <span className="text-blue-450">Smarter policing.</span>
                </>
              ) : (
                <>
                  ನೈಜ-ಸಮಯದ ಗುಪ್ತಚರ ಮಾಹಿತಿ.<br/>
                  <span className="text-blue-450">ಚುರುಕಾದ ಪೊಲೀಸಿಂಗ್.</span>
                </>
              )}
            </h1>
            <p className="text-xs text-white/50 leading-relaxed text-left">
              {t('hero.description')}
            </p>
          </div>

          {/* Feature bullets */}
          <div className="space-y-4 pt-2">
            {[
              { icon: Shield, text: t('login.bullet1') },
              { icon: Database, text: t('login.bullet2') },
              { icon: MapPin, text: t('login.bullet3') },
            ].map(({ icon: Icon, text }, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs text-white/65">
                <div className="w-6.5 h-6.5 rounded-lg bg-white/[0.06] border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Empty bottom space to balance the top-aligned header and keep content vertically centered */}
        <div className="h-10 shrink-0"></div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col justify-between bg-white px-8 py-12 md:px-16">
        {/* Top Header controls (bilingual toggle) */}
        <div className="flex justify-end">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-700 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition cursor-pointer select-none"
          >
            <Globe className="w-3 h-3 text-slate-400" />
            <span>{currentLanguage === 'en' ? 'English' : 'ಕನ್ನಡ'}</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center my-8">
          <div className="w-full max-w-sm space-y-6">
            {/* ======== LOGIN VIEW ======== */}
            {view === 'login' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">{t('hero.gateway')}</div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">{t('login.title')}</h2>
                  <p className="text-xs text-slate-500 mt-1">{t('login.subtitle')}</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="login-username" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('login.usernameLabel')}</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        id="login-username"
                        required
                        value={loginUser}
                        onChange={(e) => setLoginUser(e.target.value)}
                        placeholder={t('login.usernamePlaceholder')}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl text-xs text-slate-900 placeholder-slate-400 h-10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="login-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('login.passwordLabel')}</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="password"
                        id="login-password"
                        required
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder={t('login.passwordPlaceholder')}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl text-xs text-slate-900 placeholder-slate-400 h-10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-655 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold rounded-full text-xs focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm mt-2 font-display"
                  >
                    {t('login.submitBtn')} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {socialLoginBlock}

                <p className="text-center text-[11px] text-slate-400">
                  {t('login.noAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setView('register')}
                    className="text-blue-600 hover:underline font-bold focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-sm cursor-pointer bg-transparent border-0 p-0"
                  >
                    {t('login.requestAccess')}
                  </button>
                </p>
              </div>
            )}

            {/* ======== REQUEST ACCESS VIEW (REGISTER) ======== */}
            {view === 'register' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div>
                  <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">{t('hero.gateway')}</div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">{t('login.regTitle')}</h2>
                  <p className="text-xs text-slate-500 mt-1">{t('login.regSubtitle')}</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="reg-name" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('login.regNameLabel')}</label>
                    <div className="relative group">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="text"
                        id="reg-name"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={t('login.regNamePlaceholder')}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl text-xs text-slate-900 placeholder-slate-400 h-10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reg-email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('login.regEmailLabel')}</label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="email"
                        id="reg-email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder={t('login.regEmailPlaceholder')}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl text-xs text-slate-900 placeholder-slate-400 h-10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reg-password" className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{t('login.regPasswordLabel')}</label>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="password"
                        id="reg-password"
                        required
                        value={regPass}
                        onChange={(e) => setRegPass(e.target.value)}
                        placeholder={t('login.regPasswordPlaceholder')}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-slate-350 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 rounded-xl text-xs text-slate-900 placeholder-slate-400 h-10 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-655 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold rounded-full text-xs focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm mt-2 font-display"
                  >
                    {t('login.regSubmitBtn')} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>

                {socialLoginBlock}

                <p className="text-center text-[11px] text-slate-400">
                  {t('login.hasAccount')}{' '}
                  <button
                    type="button"
                    onClick={() => setView('login')}
                    className="text-blue-600 hover:underline font-bold focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-sm cursor-pointer bg-transparent border-0 p-0"
                  >
                    {t('login.signInLink')}
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom spacer to balance space */}
        <div className="h-6"></div>
      </div>
    </div>
  );
};
