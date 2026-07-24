import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Globe, ArrowRight, Bot, Network, Activity, FileText, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import LanguageSwitcher from '../../i18n/components/LanguageSwitcher';

export const LandingPage: React.FC = () => {
  const { t, currentLanguage, formatNumber } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const headingStyle = {
    fontFeatureSettings: '"ss01" on, "ss02" on'
  };

  return (
    <div className="bg-[#fbfbfd] min-h-[100dvh] text-slate-900 font-sans antialiased selection:bg-primary-soft selection:text-primary-deep overflow-x-hidden">
      {/* Page Curtain Wipe transition on mount */}
      <div 
        className={`fixed inset-0 z-[100] bg-[#080d1a] pointer-events-none transition-transform duration-700 ease-out origin-left ${
          mounted ? 'scale-x-0' : 'scale-x-100'
        }`}
      />

      {/* ================= 0. PROMO BANNER ================= */}
      {/* promo-banner style: background ink-deep (#0a1317), text canvas, body-sm-bold, padding md xl */}
      <div className="w-full bg-[#0a1317] text-white py-3 px-6 text-center text-xs font-bold tracking-wide select-none z-50 relative border-b border-white/[0.08]">
        {currentLanguage === 'en' ? (
          <span>
            CONFIDENTIAL LAW-ENFORCEMENT PORTAL: Authorized KSP personnel access only.{' '}
            <a href="/disclaimer" className="underline hover:text-blue-400 ml-1">Read protocol guidelines →</a>
          </span>
        ) : (
          <span>
            ಗೌಪ್ಯ ಕಾನೂನು ಜಾರಿ ಪೋರ್ಟಲ್: ಅಧಿಕೃತ KSP ಸಿಬ್ಬಂದಿಗೆ ಮಾತ್ರ ಪ್ರವೇಶವಿದೆ.{' '}
            <a href="/disclaimer" className="underline hover:text-blue-400 ml-1">ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಓದಿ →</a>
          </span>
        )}
      </div>

      {/* ================= 1. GOVERNMENT HEADER ================= */}
      {/* Top Navigation: Sticky white bar with bottom 1px solid hairline-soft, height ~64px */}
      <header className="sticky top-0 z-40 w-full h-16 bg-white/95 backdrop-blur-md border-b border-[#dee3e9] px-6 md:px-12 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img src="/karnataka_emblem.png" alt="Karnataka Coat of Arms" className="w-9 h-9 object-contain" width="36" height="36" />
          <div className="flex flex-col text-left border-l border-[#dee3e9] pl-3">
            <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-slate-500 uppercase leading-none">
              {t('nav.govKarnataka')}
            </span>
            <span className="font-display font-extrabold text-[12px] text-[#0a1317] tracking-tight mt-1" style={headingStyle}>
              KSP-ConAI
            </span>
          </div>
        </div>

        {/* Center Navigation Links: styled using body-sm-bold */}
        <nav className="hidden lg:flex items-center gap-8 font-display font-bold text-xs text-slate-650">
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

          {/* button-primary style: bg-black, text-white, rounded-full, px-5 */}
          <a 
            href="/login" 
            className="h-11 px-6 bg-black hover:bg-slate-800 text-white rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all duration-150 select-none shadow-sm flex items-center justify-center font-display"
          >
            {t('nav.login')}
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className="space-y-0 bg-[#ffffff]">
        
        {/* ================= 2. HERO SECTION ================= */}
        {/* hero-band-marketing style: stark white canvas background, center text layout, dual CTA, full bleed photography */}
        <section className="relative w-full pt-8 pb-10 md:pt-12 md:pb-12 flex flex-col items-center justify-center text-center px-6 overflow-hidden border-b border-[#dee3e9] bg-[#ffffff]">
          {/* Subtle dotted background pattern */}
          <div className="absolute inset-0 opacity-[0.22] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--color-primary) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
          
          <div className="max-w-4xl mx-auto space-y-5 relative z-10 flex flex-col items-center min-h-[280px] sm:min-h-[300px] md:min-h-[320px] justify-center">
            <span 
              className={`font-display font-bold text-[10px] tracking-[0.25em] text-[#991b1b] uppercase block transition-all duration-700 delay-100 ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={headingStyle}
            >
              {t('hero.badge')}
            </span>
            
            {/* Optimistic VF hero-display title */}
            <h1 
              className={`text-4xl md:text-6xl lg:text-7xl font-medium text-[#0a1317] leading-[1.12] tracking-tight text-center max-w-4xl font-display transition-all duration-750 delay-200 ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={headingStyle}
            >
              KSP-ConAI: <br/>
              <span className="bg-gradient-to-r from-primary via-blue-600 to-primary-deep bg-clip-text text-transparent">
                {t('hero.title')}
              </span>
            </h1>

            {/* Subtitle lead paragraph: subtitle-md style */}
            <p className={`text-sm md:text-lg text-slate-500 leading-[1.44] max-w-2xl text-center font-medium transition-all duration-700 delay-300 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              {t('hero.description')}
            </p>
            
            {/* Dual CTA buttons: button-primary (black) + button-secondary (ghost outline) */}
            <div className={`flex flex-wrap justify-center gap-4 pt-2 transition-all duration-700 delay-400 ${
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
        <section id="about" className="border-t border-[#dee3e9] bg-[#ffffff] py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <span className="text-[10px] font-bold text-[#991b1b] uppercase tracking-[0.25em] block font-display" style={headingStyle}>
                Strategic Protocol
              </span>
              <h2 className="text-3xl font-extrabold text-[#0a1317] leading-tight font-display tracking-tight" style={headingStyle}>
                Empowering Law Enforcement via Responsible Intelligence
              </h2>
              <p className="text-sm md:text-base text-slate-500 leading-relaxed italic max-w-2xl mx-auto font-medium">
                {currentLanguage === 'en' 
                  ? '"Providing explainable analytics, relation mapping, and natural language query capability to support state investigators, accelerate prosecution parameters, and ensure complete digital auditing compliance."'
                  : '"ತನಿಖಾಧಿಕಾರಿಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು, ತನಿಖಾ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ವೇಗಗೊಳಿಸಲು ಮತ್ತು ಡಿಜಿಟಲ್ ಆಡಿಟಿಂಗ್ ಅನುಸರಣೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಸಂಬಂಧ ನಕ್ಷೆಗಳು ಮತ್ತು ಪ್ರಶ್ನೆ ಸಾಮರ್ಥ್ಯ ಒದಗಿಸುವುದು."'}
              </p>
            </div>

            {/* why-buy-tile statistics tiles: rounded-xl, py-8, border hairline-soft */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 max-w-5xl mx-auto text-center">
              {[
                { value: formatNumber(45000) + '+', label: currentLanguage === 'en' ? 'FIR Case Files Ingested' : 'ದಾಖಲಿಸಲಾದ ಒಟ್ಟು ಎಫ್‌ಐಆರ್‌ಗಳು', color: 'text-primary' },
                { value: formatNumber(25000) + '+', label: currentLanguage === 'en' ? 'Criminal Nodes Linked' : 'ಸಂಪರ್ಕಿತ ಶಂಕಿತ ವ್ಯಕ್ತಿಗಳು', color: 'text-[#991b1b]' },
                { value: '100%', label: currentLanguage === 'en' ? 'Query Accountability' : 'ನಿಖರವಾದ ಪ್ರಶ್ನೆ ಹೊಣೆಗಾರಿಕೆ', color: 'text-success' }
              ].map((stat, idx) => (
                <div key={idx} className="space-y-3 p-8 border border-[#dee3e9] bg-[#ffffff] rounded-xl shadow-xs transition duration-200">
                  <div className={`text-4xl md:text-5xl font-extrabold font-display tracking-tight tabular-nums ${stat.color}`} style={headingStyle}>{stat.value}</div>
                  <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. KEY CAPABILITIES (BENTO GRID WITH PHOTOS & PRODUCTS) ================= */}
        {/* Uses card-feature-photo (full bleed image with overlay) and card-product-feature (white chrome card) */}
        <section id="capabilities" className="border-t border-[#dee3e9] py-24 md:py-36 bg-[#fbfbfd]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.25em] block font-display" style={headingStyle}>
                Capabilities
              </span>
              <h2 className="text-3xl font-extrabold text-[#0a1317] font-display tracking-tight" style={headingStyle}>
                {t('capabilities.sectionTitle')}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {t('capabilities.sectionSubtitle')}
              </p>
            </div>

            {/* Bento Grid Layout - clean, 32px spacing, xxxl rounded cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              
              {/* Card 1: Relationship Link Analysis (card-feature-photo: full-bleed visual card, copy bottom-left in white) */}
              <div className="md:col-span-2 bg-[#080d1a] rounded-xxxl shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden min-h-[300px] group border border-[#dee3e9]/30">
                <img 
                  src="/network_mockup.png" 
                  alt="Network Graph Link Analysis representation" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-[1.02] transition-transform duration-500"
                />
                {/* Gradient overlay to ensure text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-8 flex flex-col justify-end text-left">
                  <div className="space-y-2 max-w-xl">
                    <span className="text-[9px] font-bold text-red-400 tracking-[0.2em] uppercase">SYSTEM CORE</span>
                    <h3 className="text-lg font-bold text-white tracking-tight font-display" style={headingStyle}>
                      {t('capabilities.card2Title')}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-200 leading-[1.50] font-medium">
                      {t('capabilities.card2Desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Conversational Assistant (card-product-feature: white background, padding 32px, rounded 32px) */}
              <div className="bg-[#ffffff] border border-[#dee3e9] p-8 rounded-xxxl shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[300px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0a1317] tracking-tight font-display" style={headingStyle}>
                      {t('capabilities.card1Title')}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-550 leading-[1.50] font-medium">
                    {t('capabilities.card1Desc')}
                  </p>

                  {/* Interactive mock interface representing conversational workspace */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-2.5">
                    <div className="text-[10px] text-slate-500 font-bold flex justify-between">
                      <span>SECURE COPILOT STREAM</span>
                      <span className="text-primary">LIVE</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="p-2 bg-white rounded border border-slate-150 text-[10px] font-medium text-slate-700 leading-tight">
                        "Find phone links for Case KA-BC-2026-00812."
                      </div>
                      <div className="p-2 bg-primary/5 rounded border border-primary/10 text-[10px] font-medium text-primary-deep leading-tight">
                        "Analysis complete: Linked 2 active phone numbers to suspect group."
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#dee3e9] flex gap-3 text-[8px] text-slate-400 font-mono font-bold tracking-widest uppercase">
                  <span>SSE STREAMING</span>
                  <span>•</span>
                  <span>SQL LOG AUDITABLE</span>
                </div>
              </div>

              {/* Card 3: Spatial Heatmaps (card-product-feature: white background, padding 32px, rounded 32px) */}
              <div className="bg-[#ffffff] border border-[#dee3e9] p-8 rounded-xxxl shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[300px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-primary shrink-0">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0a1317] tracking-tight font-display" style={headingStyle}>
                      {t('capabilities.card3Title')}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-550 leading-[1.50] font-medium">
                    {t('capabilities.card3Desc')}
                  </p>

                  {/* Interactive Heatmap Radar mockup */}
                  <div className="h-28 rounded-lg bg-slate-900 relative overflow-hidden flex items-center justify-center border border-slate-800">
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                    {/* Pulsing Radar center */}
                    <div className="w-14 h-14 rounded-full border border-blue-500/20 flex items-center justify-center animate-ping duration-1000"></div>
                    <div className="absolute w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-primary animate-pulse"></div>
                    </div>
                    <div className="absolute top-3 left-3 text-[8px] text-blue-400 font-mono tracking-widest font-bold">RADAR SWEEP ACTIVE</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#dee3e9] text-[8px] text-slate-400 font-mono font-bold tracking-widest uppercase">
                  <span>GEOSPATIAL COORDINATES</span>
                </div>
              </div>

              {/* Card 4: Document Intelligence (card-feature-photo: wide with interactive layout) */}
              <div className="md:col-span-2 bg-[#ffffff] border border-[#dee3e9] p-8 rounded-xxxl shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[300px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#0a1317] shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#0a1317] font-display tracking-tight" style={headingStyle}>
                      {t('capabilities.card4Title')}
                    </h3>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 leading-[1.60] font-medium max-w-2xl">
                    {t('capabilities.card4Desc')}
                  </p>

                  {/* Mock document generation list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {[
                      { name: 'KA-BC-2026-00812_Brief.pdf', size: '1.4 MB', time: 'Generated 2m ago' },
                      { name: 'KA-MY-2026-00124_Brief.pdf', size: '2.8 MB', time: 'Generated 1h ago' }
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-[#dee3e9] bg-[#ffffff] hover:border-slate-350 transition duration-150">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary shrink-0" />
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] font-bold text-slate-800 tracking-tight">{doc.name}</span>
                            <span className="text-[8px] text-slate-400">{doc.time} • {doc.size}</span>
                          </div>
                        </div>
                        <div className="text-[9px] font-bold text-primary hover:underline cursor-pointer">DOWNLOAD</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-[#dee3e9] flex gap-4 text-[8px] text-slate-400 font-mono font-bold tracking-widest uppercase">
                  <span>PDF COMPILED</span>
                  <span>•</span>
                  <span>TEMPORAL METRICS</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 5. PROCEDURAL TIMELINE WORKFLOW ================= */}
        <section id="workflow" className="border-t border-[#dee3e9] bg-[#ffffff] py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-[10px] font-bold text-[#991b1b] uppercase tracking-[0.25em] block font-display" style={headingStyle}>
                Protocol
              </span>
              <h2 className="text-3xl font-extrabold text-[#0a1317] font-display tracking-tight" style={headingStyle}>
                {t('workflow.sectionTitle')}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
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
                  <div key={idx} className="relative flex flex-col items-center text-center space-y-4 z-10">
                    <div className="w-12 h-12 rounded-full bg-slate-50 border-2 border-primary text-primary font-display font-bold text-sm flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-105">
                      {formatNumber(idx + 1)}
                    </div>
                    <h3 className="text-xs font-bold text-[#0a1317] uppercase tracking-wider font-display" style={headingStyle}>
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
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.25em] block font-display" style={headingStyle}>
                Audits
              </span>
              <h2 className="text-3xl font-extrabold text-[#0a1317] font-display tracking-tight" style={headingStyle}>
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
                <div key={idx} className="bg-white border border-[#dee3e9] p-6 rounded-xl space-y-3 shadow-xs hover:border-slate-350 transition duration-150">
                  <div className="flex items-center gap-2.5 text-[#991b1b]">
                    <Lock className="w-4 h-4" />
                    <h3 className="text-xs font-bold text-[#0a1317] uppercase tracking-wider font-display" style={headingStyle}>
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
        <section id="faq" className="border-t border-[#dee3e9] bg-[#ffffff] py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[9px] font-bold text-primary uppercase tracking-[0.25em] block font-display" style={headingStyle}>
                FAQ
              </span>
              <h2 className="text-3xl font-extrabold text-[#0a1317] font-display tracking-tight" style={headingStyle}>
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
                  <summary className="px-6 py-5 text-xs font-bold text-[#0a1317] flex items-center justify-between cursor-pointer select-none font-display" style={headingStyle}>
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

            <span className="relative z-10 text-[9px] font-bold text-blue-400 uppercase tracking-[0.25em] block font-display" style={headingStyle}>
              {t('login.regTitle')}
            </span>
            <h2 className="relative z-10 text-2xl md:text-3xl font-extrabold text-white leading-tight font-display tracking-tight" style={headingStyle}>
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
                <span className="font-extrabold text-[#0a1317] leading-tight font-display" style={headingStyle}>
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
