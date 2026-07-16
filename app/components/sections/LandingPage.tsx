import React from 'react';
import { 
  Shield, Bot, Network, Activity, FileText, Lock, Globe, ArrowRight, 
  HelpCircle, Cpu, Zap, CheckCircle2, ChevronRight, Terminal, UserCheck
} from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import LanguageSwitcher from '../../i18n/components/LanguageSwitcher';

export const LandingPage: React.FC = () => {
  const { t, currentLanguage, formatNumber } = useI18n();

  return (
    <div>
      {/* ================= 1. GOVERNMENT HEADER ================= */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gov-border px-6 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/karnataka_emblem.png" alt="Karnataka Coat of Arms" className="w-10 h-10 object-contain" width="40" height="40" />
          <div className="flex flex-col text-left border-l border-gov-border pl-3">
            <span className="text-[9px] font-sans font-semibold tracking-wider text-slate-500 uppercase">
              {t('nav.govKarnataka')}
            </span>
            <span className="text-[9px] font-sans font-semibold tracking-wider text-slate-500 uppercase leading-none">
              {t('nav.statePolice')}
            </span>
            <span className="font-display font-semibold text-xs text-gov-navy mt-1 tracking-tight">{t('appName')}</span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 font-display font-medium text-xs text-slate-600">
          <a href="/" className="hover:text-gov-blue focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:outline-none rounded-sm transition">
            {t('nav.home')}
          </a>
          <a href="#about" className="hover:text-gov-blue focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:outline-none rounded-sm transition">
            {t('nav.about')}
          </a>
          <a href="#capabilities" className="hover:text-gov-blue focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:outline-none rounded-sm transition">
            {t('nav.capabilities')}
          </a>
          <a href="#workflow" className="hover:text-gov-blue focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:outline-none rounded-sm transition">
            {t('nav.workflow')}
          </a>
          <a href="#faq" className="hover:text-gov-blue focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:outline-none rounded-sm transition">
            {t('nav.faq')}
          </a>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <a 
            href="/login" 
            className="px-5 py-2 bg-gov-navy text-white hover:bg-gov-blue rounded-full text-xs font-display font-medium focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:outline-none transition select-none shadow-sm"
          >
            {t('nav.login')}
          </a>
        </div>
      </header>

      {/* Main scrollable layout using official governance page background */}
      <div className="bg-gov-bg min-h-[100dvh] text-gov-navy font-sans antialiased selection:bg-slate-200">
        
        {/* ================= 2. HERO SECTION ================= */}
        <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center text-center px-6 overflow-hidden border-b border-gov-border">
          {/* Nice dotted background */}
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#64748b 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}></div>
          
          <div className="max-w-4xl mx-auto space-y-6 relative z-10 flex flex-col items-center">
            <span className="font-display font-semibold text-xs tracking-wider text-gov-red uppercase block">
              {t('hero.badge')}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-gov-navy leading-[1.15] tracking-tight text-center max-w-3xl">
              {t('appName')}: <br/>
              <span className="text-gov-blue">{t('hero.title')}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed max-w-2xl text-center">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-wrap justify-center gap-3.5 pt-4">
              <a href="/login" className="px-6 py-3 bg-gov-navy text-white hover:bg-gov-blue rounded-full text-xs font-display font-medium focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:outline-none transition shadow-sm select-none">
                {t('hero.launch')}
              </a>
              <a href="#capabilities" className="px-6 py-3 bg-white border border-gov-border text-slate-700 hover:bg-slate-50 rounded-full text-xs font-display font-medium focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:outline-none transition select-none">
                {t('hero.explore')}
              </a>
            </div>
          </div>
        </section>

        {/* ================= 3. STRATEGIC MISSION & COMPREHENSIVE STATS ================= */}
        <section id="about" className="border-t border-gov-border bg-white py-16">
          <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="text-[9px] font-display font-bold text-gov-red uppercase tracking-widest block">
                Strategic Protocol
              </span>
              <h2 className="text-2xl font-display font-semibold text-gov-navy leading-tight">
                Empowering Law Enforcement via Responsible Intelligence
              </h2>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed italic max-w-2xl mx-auto">
                {currentLanguage === 'en' 
                  ? '"Providing explainable analytics, relation mapping, and natural language query capability to support state investigators, accelerate prosecution parameters, and ensure complete digital auditing compliance."'
                  : '"ತನಿಖಾಧಿಕಾರಿಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು, ತನಿಖಾ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ವೇಗಗೊಳಿಸಲು ಮತ್ತು ಡಿಜಿಟಲ್ ಆಡಿಟಿಂಗ್ ಅನುಸರಣೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಸಂಬಂಧ ನಕ್ಷೆಗಳು ಮತ್ತು ಪ್ರಶ್ನೆ ಸಾಮರ್ಥ್ಯ ಒದಗಿಸುವುದು."'}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 max-w-5xl mx-auto text-center">
              {[
                { value: formatNumber(45000) + '+', label: currentLanguage === 'en' ? 'FIR Case Files Ingested' : 'ದಾಖಲಿಸಲಾದ ಒಟ್ಟು ಎಫ್‌ಐಆರ್‌ಗಳು', color: 'text-gov-blue' },
                { value: formatNumber(25000) + '+', label: currentLanguage === 'en' ? 'Criminal Nodes Linked' : 'ಸಂಪರ್ಕಿತ ಶಂಕಿತ ವ್ಯಕ್ತಿಗಳು', color: 'text-gov-red' },
                { value: '100%', label: currentLanguage === 'en' ? 'Query Accountability' : 'ನಿಖರವಾದ ಪ್ರಶ್ನೆ ಹೊಣೆಗಾರಿಕೆ', color: 'text-emerald-600' },
                { value: '24/7', label: currentLanguage === 'en' ? 'Tactical On-demand Access' : 'ನಿರಂತರ ಲಭ್ಯತೆ', color: 'text-gov-navy' }
              ].map((stat, idx) => (
                <div key={idx} className="space-y-1.5 p-5 border border-gov-border bg-white rounded-xl card-hover shadow-sm">
                  <div className={`text-2xl md:text-3xl font-display font-bold tabular-nums ${stat.color}`}>{stat.value}</div>
                  <div className="text-[9px] font-sans font-semibold text-slate-500 uppercase tracking-wider leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. KEY CAPABILITIES (CONSOLIDATED BENTO GRID) ================= */}
        <section id="capabilities" className="border-t border-gov-border py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[9px] font-display font-bold text-gov-blue uppercase tracking-widest block">
                {t('capabilities.sectionTitle')}
              </span>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-gov-navy">
                {t('capabilities.sectionTitle')}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('capabilities.sectionSubtitle')}
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
              
              {/* Card 1: Conversational Assistant (Wide) */}
              <div className="md:col-span-2 bg-white border border-gov-border p-6 rounded-xxxl shadow-sm card-hover flex flex-col justify-between min-h-[220px]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-gov-blue shrink-0">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-[13px] font-bold text-gov-navy tracking-tight">
                      {t('capabilities.card1Title')}
                    </h3>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    {t('capabilities.card1Desc')}
                  </p>
                </div>
                <div className="pt-4 border-t border-gov-border flex gap-4 text-[9px] text-slate-400 font-mono">
                  <span>SQL LOG AUDITABLE</span>
                  <span>•</span>
                  <span>SSE STREAMING ENABLED</span>
                </div>
              </div>

              {/* Card 2: Relationship Networks (Narrow) */}
              <div className="bg-white border border-gov-border p-6 rounded-xxxl shadow-sm card-hover flex flex-col justify-between min-h-[220px]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-gov-red shrink-0">
                      <Network className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-[13px] font-bold text-gov-navy tracking-tight">
                      {t('capabilities.card2Title')}
                    </h3>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    {t('capabilities.card2Desc')}
                  </p>
                </div>
                <div className="pt-4 border-t border-gov-border text-[9px] text-slate-400 font-mono">
                  <span>SVG GRAPH RENDER</span>
                </div>
              </div>

              {/* Card 3: Spatio-Temporal (Narrow) */}
              <div className="bg-white border border-gov-border p-6 rounded-xxxl shadow-sm card-hover flex flex-col justify-between min-h-[220px]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-gov-blue shrink-0">
                      <Activity className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-[13px] font-bold text-gov-navy tracking-tight">
                      {t('capabilities.card3Title')}
                    </h3>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    {t('capabilities.card3Desc')}
                  </p>
                </div>
                <div className="pt-4 border-t border-gov-border text-[9px] text-slate-400 font-mono">
                  <span>REAL-TIME STATISTICS</span>
                </div>
              </div>

              {/* Card 4: Document Intelligence (Wide) */}
              <div className="md:col-span-2 bg-white border border-gov-border p-6 rounded-xxxl shadow-sm card-hover flex flex-col justify-between min-h-[220px]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-gov-navy shrink-0">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-[13px] font-bold text-gov-navy tracking-tight">
                      {t('capabilities.card4Title')}
                    </h3>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    {t('capabilities.card4Desc')}
                  </p>
                </div>
                <div className="pt-4 border-t border-gov-border flex gap-4 text-[9px] text-slate-400 font-mono">
                  <span>PDF EXPORT ENABLED</span>
                  <span>•</span>
                  <span>TIMELINE VALIDATORS</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 5. PROCEDURAL TIMELINE WORKFLOW ================= */}
        <section id="workflow" className="border-t border-gov-border bg-white py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[9px] font-display font-bold text-gov-red uppercase tracking-widest block">
                {t('workflow.sectionTitle')}
              </span>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-gov-navy">
                {t('workflow.sectionTitle')}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('workflow.sectionSubtitle')}
              </p>
            </div>

            {/* Chronological horizontal timeline */}
            <div className="max-w-5xl mx-auto pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Horizontal Line background for desktop */}
                <div className="hidden md:block absolute top-6 left-1/8 right-1/8 h-0.5 bg-slate-200 z-0"></div>

                {[
                  { title: t('workflow.step1'), desc: t('workflow.step1Desc') },
                  { title: t('workflow.step2'), desc: t('workflow.step2Desc') },
                  { title: t('workflow.step3'), desc: t('workflow.step3Desc') },
                  { title: t('workflow.step4'), desc: t('workflow.step4Desc') }
                ].map((step, idx) => (
                  <div key={idx} className="relative flex flex-col items-center text-center space-y-3 z-10">
                    <div className="w-12 h-12 rounded-full bg-gov-bg border-2 border-gov-blue text-gov-blue font-display font-bold text-sm flex items-center justify-center shadow-sm">
                      {formatNumber(idx + 1)}
                    </div>
                    <h3 className="text-xs font-display font-bold text-gov-navy uppercase tracking-wider">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-[200px]">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. SECURITY, AUDIT & COMPLIANCE ================= */}
        <section className="border-t border-gov-border py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-[9px] font-display font-bold text-gov-blue uppercase tracking-widest block">
                {t('privacy.sec3Title')}
              </span>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-gov-navy">
                {t('privacy.sec4Title')}
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('privacy.sec4Desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { title: t('privacy.sec3Title'), desc: t('privacy.sec3Desc') },
                { title: t('privacy.sec4Title'), desc: t('privacy.sec4Desc') },
                { title: t('terms.sec1Title'), desc: t('terms.sec1Desc') },
                { title: t('terms.sec3Title'), desc: t('terms.sec3Desc') },
                { title: t('disclaimer.noticeTitle'), desc: t('disclaimer.noticeDesc') },
                { title: t('disclaimer.sec2Title'), desc: t('disclaimer.sec2Desc') }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-gov-border p-5 rounded-xl space-y-2.5 card-hover">
                  <div className="flex items-center gap-2 text-gov-red">
                    <Lock className="w-4 h-4" />
                    <h3 className="text-xs font-display font-bold text-gov-navy uppercase tracking-wider">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 7. FAQ SECTION ================= */}
        <section id="faq" className="border-t border-gov-border bg-white py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 space-y-10">
            <div className="text-center space-y-2">
              <span className="text-[9px] font-display font-bold text-gov-blue uppercase tracking-widest block">
                {t('nav.faq')}
              </span>
              <h2 className="text-xl md:text-2xl font-display font-semibold text-gov-navy">
                {t('faq.sectionTitle')}
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { q: t('faq.q1'), a: t('faq.a1') },
                { q: t('faq.q2'), a: t('faq.a2') },
                { q: t('faq.q3'), a: t('faq.a3') },
                { q: t('faq.q4'), a: t('faq.a4') }
              ].map((item, idx) => (
                <details key={idx} className="group bg-white border border-gov-border rounded-xl overflow-hidden transition">
                  <summary className="px-5 py-4 text-xs font-display font-semibold text-gov-navy flex items-center justify-between cursor-pointer select-none">
                    <span>{item.q}</span>
                    <svg className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-open:rotate-180 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 border-t border-gov-border pt-3 text-xs text-slate-500 leading-relaxed bg-gov-bg/30">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 8. CALL TO ACTION ================= */}
        <section className="border-t border-gov-border py-16 bg-gov-bg/50">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
            <span className="text-[9px] font-display font-bold text-gov-red uppercase tracking-widest block">
              {t('login.regTitle')}
            </span>
            <h2 className="text-xl md:text-2xl font-display font-semibold text-gov-navy leading-tight">
              Ready to begin an investigation?
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              {t('login.subtitle')}
            </p>
            <a 
              href="/login" 
              className="inline-block px-7 py-3.5 bg-gov-navy text-white hover:bg-gov-blue rounded-full text-xs font-display font-semibold focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:outline-none transition shadow-sm select-none"
            >
              {t('hero.launch')}
            </a>
          </div>
        </section>

        {/* ================= 9. GOVERNMENT THEMED FOOTER ================= */}
        <footer className="bg-gov-navy text-slate-400 border-t border-slate-800 px-6 md:px-8 py-12 text-[10px] space-y-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-3">
              <img src="/karnataka_emblem.png" alt="Government Seal" className="w-9 h-9 object-contain" width="36" height="36" />
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-200 leading-tight">
                  {t('nav.govKarnataka')}
                </span>
                <span className="text-slate-450 leading-none mt-0.5">
                  {t('nav.statePolice')}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px]">
              <a href="#" className="hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded-sm transition">
                {t('nav.about')}
              </a>
              <span aria-hidden="true">•</span>
              <a href="/privacy" className="hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded-sm transition">
                {t('footer.privacy')}
              </a>
              <span aria-hidden="true">•</span>
              <a href="/terms" className="hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded-sm transition">
                {t('footer.terms')}
              </a>
              <span aria-hidden="true">•</span>
              <a href="/disclaimer" className="hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded-sm transition">
                {t('footer.disclaimer')}
              </a>
              <span aria-hidden="true">•</span>
              <a href="mailto:support@ksp.gov.in" className="hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none rounded-sm transition">
                {t('footer.support')}
              </a>
            </div>

            <div className="text-center md:text-right text-slate-500">
              <span>{t('appName')} Portal (v1.1)</span>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto border-t border-slate-800 pt-6 text-center text-[9px] text-slate-550 leading-relaxed">
            {currentLanguage === 'en' 
              ? '© 2026 Government of Karnataka. All Rights Reserved. Confidential law-enforcement tool. Access and actions are governed under official information security guidelines.'
              : '© 2026 ಕರ್ನಾಟಕ ಸರ್ಕಾರ. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಗೌಪ್ಯ ಕಾನೂನು ಜಾರಿ ಸಾಧನ. ಪ್ರವೇಶ ಮತ್ತು ಕ್ರಮಗಳನ್ನು ಅಧಿಕೃತ ಮಾಹಿತಿ ಭದ್ರತಾ ಮಾರ್ಗಸೂಚಿಗಳ ಅಡಿಯಲ್ಲಿ ನಿಯಂತ್ರಿಸಲಾಗುತ್ತದೆ.'}
          </div>
        </footer>
      </div>
    </div>
  );
};
