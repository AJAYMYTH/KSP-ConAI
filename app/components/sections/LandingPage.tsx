import React, { useState, useEffect } from 'react';
import { Shield, Lock, Globe, ArrowRight, Bot, Network, Activity, FileText } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import LanguageSwitcher from '../../i18n/components/LanguageSwitcher';

export const LandingPage: React.FC = () => {
  const { t, currentLanguage, formatNumber } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-[#fbfbfd] min-h-[100dvh] text-slate-900 font-sans antialiased selection:bg-primary-soft selection:text-primary-deep overflow-x-hidden">
      {/* Page Curtain Wipe transition on mount */}
      <div 
        className={`fixed inset-0 z-[100] bg-[#080d1a] pointer-events-none transition-transform duration-700 ease-out origin-left ${
          mounted ? 'scale-x-0' : 'scale-x-100'
        }`}
      />

      {/* ================= 1. GOVERNMENT HEADER ================= */}
      <header className="sticky top-0 z-50 w-full h-16 bg-white/80 backdrop-blur-md border-b border-[#dee3e9] px-6 md:px-12 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <img src="/karnataka_emblem.png" alt="Karnataka Coat of Arms" className="w-9 h-9 object-contain" width="36" height="36" />
          <div className="flex flex-col text-left border-l border-[#dee3e9] pl-3">
            <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-slate-500 uppercase leading-none">
              {t('nav.govKarnataka')}
            </span>
            <span className="font-display font-extrabold text-[12px] text-[#0a1317] tracking-tight mt-1">
              KSP-ConAI
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-display font-bold text-xs text-slate-600">
          <a href="/" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md transition duration-150">
            {t('nav.home')}
          </a>
          <a href="#about" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md transition duration-150">
            {t('nav.about')}
          </a>
          <a href="#capabilities" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md transition duration-150">
            {t('nav.capabilities')}
          </a>
          <a href="#workflow" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md transition duration-150">
            {t('nav.workflow')}
          </a>
          <a href="#faq" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md transition duration-150">
            {t('nav.faq')}
          </a>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <a 
            href="/login" 
            className="h-11 px-6 bg-black hover:bg-slate-800 text-white rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all duration-150 select-none shadow-sm flex items-center justify-center font-display"
          >
            {t('nav.login')}
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className="space-y-0">
        
        {/* ================= 2. HERO SECTION ================= */}
        {/* Generous spacing, clean centered typography, transmission reveal effects */}
        <section className="relative w-full py-28 md:py-44 flex flex-col items-center justify-center text-center px-6 overflow-hidden border-b border-[#dee3e9]">
          {/* Nice ambient radial highlight behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
          {/* Nice dotted background */}
          <div className="absolute inset-0 opacity-[0.22] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-primary) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="max-w-4xl mx-auto space-y-8 relative z-10 flex flex-col items-center">
            <span className={`font-display font-bold text-[10px] tracking-[0.25em] text-[#991b1b] uppercase block transition-all duration-700 delay-100 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              {t('hero.badge')}
            </span>
            
            <h1 className={`text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#0a1317] leading-[1.12] tracking-tight text-center max-w-4xl font-display transition-all duration-750 delay-200 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}>
              KSP-ConAI: <br/>
              <span className="bg-gradient-to-r from-primary via-blue-600 to-primary-deep bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </h1>

            <p className={`text-sm md:text-lg text-slate-550 leading-[1.50] tracking-[-0.15px] max-w-2xl text-center font-medium transition-all duration-700 delay-300 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              {t('hero.description')}
            </p>
            
            {/* Dual CTA buttons */}
            <div className={`flex flex-wrap justify-center gap-4 pt-4 transition-all duration-700 delay-400 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <a 
                href="/login" 
                className="h-11 px-8 bg-black hover:bg-slate-800 text-white rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all duration-150 shadow-md flex items-center justify-center gap-1.5 select-none font-display active:scale-[0.98]"
              >
                {t('hero.launch')} <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <a 
                href="#capabilities" 
                className="h-11 px-8 bg-transparent border-2 border-[#0a1317] text-[#0a1317] hover:bg-slate-50 rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all duration-150 select-none flex items-center justify-center font-display active:scale-[0.98]"
              >
                {t('hero.explore')}
              </a>
            </div>
          </div>
        </section>

        {/* ================= 3. STRATEGIC MISSION & COMPREHENSIVE STATS ================= */}
        <section id="about" className="border-t border-[#dee3e9] bg-white py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="text-[10px] font-bold text-[#991b1b] uppercase tracking-[0.25em] block font-display">
                Strategic Protocol
              </span>
              <h2 className="text-3xl font-extrabold text-[#0a1317] leading-tight font-display tracking-tight">
                Empowering Law Enforcement via Responsible Intelligence
              </h2>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed italic max-w-2xl mx-auto font-medium">
                {currentLanguage === 'en' 
                  ? '"Providing explainable analytics, relation mapping, and natural language query capability to support state investigators, accelerate prosecution parameters, and ensure complete digital auditing compliance."'
                  : '"ತನಿಖಾಧಿಕಾರಿಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು, ತನಿಖಾ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ವೇಗಗೊಳಿಸಲು ಮತ್ತು ಡಿಜಿಟಲ್ ಆಡಿಟಿಂಗ್ ಅನುಸರಣೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಸಂಬಂಧ ನಕ್ಷೆಗಳು ಮತ್ತು ಪ್ರಶ್ನೆ ಸಾಮರ್ಥ್ಯ ಒದಗಿಸುವುದು."'}
              </p>
            </div>

            {/* spaced, clean numbers with light captions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 max-w-5xl mx-auto text-center">
              {[
                { value: formatNumber(45000) + '+', label: currentLanguage === 'en' ? 'FIR Case Files Ingested' : 'ದಾಖಲಿಸಲಾದ ಒಟ್ಟು ಎಫ್‌ಐಆರ್‌ಗಳು', color: 'text-primary' },
                { value: formatNumber(25000) + '+', label: currentLanguage === 'en' ? 'Criminal Nodes Linked' : 'ಸಂಪರ್ಕಿತ ಶಂಕಿತ ವ್ಯಕ್ತಿಗಳು', color: 'text-[#991b1b]' },
                { value: '100%', label: currentLanguage === 'en' ? 'Query Accountability' : 'ನಿಖರವಾದ ಪ್ರಶ್ನೆ ಹೊಣೆಗಾರಿಕೆ', color: 'text-success' }
              ].map((stat, idx) => (
                <div key={idx} className="space-y-2.5 p-6 border-0 bg-transparent rounded-xl transition duration-200">
                  <div className={`text-4xl md:text-5xl font-extrabold font-display tracking-tight tabular-nums ${stat.color}`}>{stat.value}</div>
                  <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. KEY CAPABILITIES (BENTO GRID WITH CUSTOM ICONS) ================= */}
        <section id="capabilities" className="border-t border-[#dee3e9] py-24 md:py-36 bg-[#fbfbfd]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.25em] block font-display">
                Capabilities
              </span>
              <h2 className="text-3xl font-extrabold text-[#0a1317] font-display tracking-tight">
                {t('capabilities.sectionTitle')}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {t('capabilities.sectionSubtitle')}
              </p>
            </div>

            {/* Bento Grid Layout - clean, 32px padding, xxxl rounded cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              
              {/* Card 1: Conversational Assistant (Wide) */}
              <div className="md:col-span-2 bg-white border border-[#dee3e9] p-8 rounded-xxxl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[250px]">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    {/* Custom Vector Icon for AI Copilot */}
                    <div className="w-12 h-12 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        <path d="M2 12h20" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-[#0a1317] font-display tracking-tight">
                      {t('capabilities.card1Title')}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 leading-[1.60] font-medium max-w-2xl">
                    {t('capabilities.card1Desc')}
                  </p>
                </div>
                <div className="pt-6 border-t border-[#dee3e9] flex gap-4 text-[9px] text-slate-400 font-mono font-bold tracking-widest">
                  <span>SQL LOG AUDITABLE</span>
                  <span>•</span>
                  <span>SSE STREAMING ENABLED</span>
                </div>
              </div>

              {/* Card 2: Relationship Networks (Narrow) */}
              <div className="bg-white border border-[#dee3e9] p-8 rounded-xxxl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[250px]">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    {/* Custom Vector Icon for Network Graph */}
                    <div className="w-12 h-12 rounded-xl bg-red-50/50 border border-red-100 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#991b1b]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5v14" />
                        <circle cx="12" cy="5" r="3" fill="currentColor" />
                        <circle cx="5" cy="12" r="3" fill="currentColor" />
                        <circle cx="19" cy="12" r="3" fill="currentColor" />
                        <circle cx="12" cy="19" r="3" fill="currentColor" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-[#0a1317] font-display tracking-tight">
                      {t('capabilities.card2Title')}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 leading-[1.60] font-medium">
                    {t('capabilities.card2Desc')}
                  </p>
                </div>
                <div className="pt-6 border-t border-[#dee3e9] text-[9px] text-slate-400 font-mono font-bold tracking-widest">
                  <span>SVG GRAPH RENDER</span>
                </div>
              </div>

              {/* Card 3: Spatial Heatmaps (Narrow) */}
              <div className="bg-white border border-[#dee3e9] p-8 rounded-xxxl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[250px]">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    {/* Custom Vector Icon for Geospatial map */}
                    <div className="w-12 h-12 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-[#0a1317] font-display tracking-tight">
                      {t('capabilities.card3Title')}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 leading-[1.60] font-medium">
                    {t('capabilities.card3Desc')}
                  </p>
                </div>
                <div className="pt-6 border-t border-[#dee3e9] text-[9px] text-slate-400 font-mono font-bold tracking-widest">
                  <span>REAL-TIME STATISTICS</span>
                </div>
              </div>

              {/* Card 4: Document Intelligence (Wide) */}
              <div className="md:col-span-2 bg-white border border-[#dee3e9] p-8 rounded-xxxl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[250px]">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    {/* Custom Vector Icon for Documents */}
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#0a1317]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-[#0a1317] font-display tracking-tight">
                      {t('capabilities.card4Title')}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 leading-[1.60] font-medium max-w-2xl">
                    {t('capabilities.card4Desc')}
                  </p>
                </div>
                <div className="pt-6 border-t border-[#dee3e9] flex gap-4 text-[9px] text-slate-400 font-mono font-bold tracking-widest">
                  <span>PDF EXPORT ENABLED</span>
                  <span>•</span>
                  <span>TIMELINE VALIDATORS</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 5. PROCEDURAL TIMELINE WORKFLOW ================= */}
        <section id="workflow" className="border-t border-[#dee3e9] bg-white py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-[10px] font-bold text-[#991b1b] uppercase tracking-[0.25em] block font-display">
                Protocol
              </span>
              <h2 className="text-3xl font-extrabold text-[#0a1317] font-display tracking-tight">
                {t('workflow.sectionTitle')}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {t('workflow.sectionSubtitle')}
              </p>
            </div>

            {/* Chronological horizontal timeline - clean & spaced */}
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
                  <div key={idx} className="relative flex flex-col items-center text-center space-y-4 z-10">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border-2 border-primary text-primary font-display font-bold text-sm flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-105">
                      {formatNumber(idx + 1)}
                    </div>
                    <h3 className="text-xs font-bold text-[#0a1317] uppercase tracking-wider font-display">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-550 leading-relaxed max-w-[200px] font-medium">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. SECURITY, AUDIT & COMPLIANCE ================= */}
        {/* card-icon-feature style: rounded-xl (16px), border hairline-soft, padding xl */}
        <section className="border-t border-[#dee3e9] py-24 md:py-32 bg-[#fbfbfd]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.25em] block font-display">
                Audits
              </span>
              <h2 className="text-3xl font-extrabold text-[#0a1317] font-display tracking-tight">
                {t('privacy.sec4Title')}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {t('privacy.sec4Desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { title: t('privacy.sec3Title'), desc: t('privacy.sec3Desc') },
                { title: t('privacy.sec4Title'), desc: t('privacy.sec4Desc') },
                { title: t('terms.sec1Title'), desc: t('terms.sec1Desc') }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-[#dee3e9] p-6 rounded-xl space-y-3 shadow-xs hover:border-slate-300 transition duration-150">
                  <div className="flex items-center gap-2.5 text-[#991b1b]">
                    <Lock className="w-4 h-4" />
                    <h3 className="text-xs font-bold text-[#0a1317] uppercase tracking-wider font-display">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 7. FAQ SECTION ================= */}
        {/* faq-accordion-item style: rounded xl (16px), border hairline-soft */}
        <section id="faq" className="border-t border-[#dee3e9] bg-white py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.25em] block font-display">
                FAQ
              </span>
              <h2 className="text-3xl font-extrabold text-[#0a1317] font-display tracking-tight">
                {t('faq.sectionTitle')}
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { q: t('faq.q1'), a: t('faq.a1') },
                { q: t('faq.q2'), a: t('faq.a2') },
                { q: t('faq.q3'), a: t('faq.a3') }
              ].map((item, idx) => (
                <details key={idx} className="group bg-white border border-[#dee3e9] rounded-xl overflow-hidden shadow-xs transition duration-200">
                  <summary className="px-6 py-5 text-xs font-bold text-[#0a1317] flex items-center justify-between cursor-pointer select-none font-display">
                    <span>{item.q}</span>
                    <svg className="w-4 h-4 text-slate-400 transition-transform duration-200 group-open:rotate-180 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 border-t border-[#dee3e9] pt-4 text-xs text-slate-500 leading-relaxed bg-[#fbfbfd]/40 font-medium">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 8. CALL TO ACTION ================= */}
        {/* card-promo-strip style: background ink-deep (#080d1a), text canvas, rounded xxxl (32px), p-12 */}
        <section className="border-t border-[#dee3e9] py-16 bg-[#fbfbfd] px-6">
          <div className="max-w-4xl mx-auto bg-[#080d1a] text-white p-12 md:p-16 rounded-xxxl text-center space-y-6 shadow-xl relative overflow-hidden">
            {/* Glowing orb */}
            <div className="absolute top-0 right-0 w-[50%] h-[100%] rounded-full bg-blue-600/5 blur-[100px] pointer-events-none"></div>

            <span className="relative z-10 text-[9px] font-bold text-blue-400 uppercase tracking-[0.25em] block font-display">
              {t('login.regTitle')}
            </span>
            <h2 className="relative z-10 text-2xl md:text-3xl font-extrabold text-white leading-tight font-display tracking-tight">
              Ready to begin an investigation?
            </h2>
            <p className="relative z-10 text-xs text-slate-400 leading-relaxed max-w-md mx-auto font-medium">
              {t('login.subtitle')}
            </p>
            {/* Primary button-primary white variant: bg-white, text-black, rounded-full, h-11, hover offset */}
            <a 
              href="/login" 
              className="relative z-10 inline-flex items-center justify-center h-11 px-8 bg-white hover:bg-slate-100 text-[#080d1a] rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-all duration-150 shadow-sm select-none active:scale-[0.98] font-display"
            >
              {t('hero.launch')}
            </a>
          </div>
        </section>

        {/* ================= 9. GOVERNMENT THEMED FOOTER ================= */}
        {/* footer-region style: background canvas (#ffffff), border hairline-soft, padding spacing.section */}
        <footer className="bg-white border-t border-[#dee3e9] px-6 md:px-12 py-16 text-[10px] space-y-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-3">
              <img src="/karnataka_emblem.png" alt="Government Seal" className="w-8 h-8 object-contain" width="32" height="32" />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-[#0a1317] leading-tight font-display">
                  {t('nav.govKarnataka')}
                </span>
                <span className="text-slate-500 font-bold leading-none mt-0.5 uppercase tracking-wider text-[8px]">
                  {t('nav.statePolice')}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-[10px] font-medium text-slate-650">
              <a href="#" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm transition">
                {t('nav.about')}
              </a>
              <span aria-hidden="true" className="text-slate-350">•</span>
              <a href="/privacy" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm transition">
                {t('footer.privacy')}
              </a>
              <span aria-hidden="true" className="text-slate-350">•</span>
              <a href="/terms" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm transition">
                {t('footer.terms')}
              </a>
              <span aria-hidden="true" className="text-slate-355">•</span>
              <a href="/disclaimer" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm transition">
                {t('footer.disclaimer')}
              </a>
              <span aria-hidden="true" className="text-slate-350">•</span>
              <a href="mailto:support@ksp.gov.in" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-sm transition">
                {t('footer.support')}
              </a>
            </div>

            <div className="text-center md:text-right text-slate-400 font-bold font-mono">
              <span>{t('appName')} Portal (v1.1)</span>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto border-t border-[#dee3e9] pt-6 text-center text-[9px] text-slate-400 leading-relaxed font-medium">
            {currentLanguage === 'en' 
              ? '© 2026 Government of Karnataka. All Rights Reserved. Confidential law-enforcement tool. Access and actions are governed under official information security guidelines.'
              : '© 2026 ಕರ್ನಾಟಕ ಸರ್ಕಾರ. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಗೌಪ್ಯ ಕಾನೂನು ಜಾರಿ ಸಾಧನ. ಪ್ರವೇಶ ಮತ್ತು ಕ್ರಮಗಳನ್ನು ಅಧಿಕೃತ ಮಾಹಿತಿ ಭದ್ರತಾ ಮಾರ್ಗಸೂಚಿಗಳ ಅಡಿಯಲ್ಲಿ ನಿಯಂತ್ರಿಸಲಾಗುತ್ತದೆ.'}
          </div>
        </footer>
      </div>
    </div>
  );
};
