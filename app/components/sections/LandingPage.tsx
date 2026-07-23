import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Globe, ArrowRight, Bot, Network, Activity, FileText, CheckCircle2, ChevronRight, Zap, Database, MapPin, Search, Cpu, FileCheck, Layers
} from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import LanguageSwitcher from '../../i18n/components/LanguageSwitcher';

export const LandingPage: React.FC = () => {
  const { t, currentLanguage, formatNumber } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<number>(0);

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
      <div className="w-full bg-[#0a1317] text-white py-2.5 px-6 text-center text-xs font-bold tracking-wide select-none z-50 relative border-b border-white/[0.08]">
        {currentLanguage === 'en' ? (
          <span>
            CONFIDENTIAL LAW-ENFORCEMENT PORTAL: Authorized KSP personnel access only.{' '}
            <a href="/app/disclaimer.html" className="underline hover:text-blue-400 ml-1">Read protocol guidelines →</a>
          </span>
        ) : (
          <span>
            ಗೌಪ್ಯ ಕಾನೂನು ಜಾರಿ ಪೋರ್ಟಲ್: ಅಧಿಕೃತ KSP ಸಿಬ್ಬಂದಿಗೆ ಮಾತ್ರ ಪ್ರವೇಶವಿದೆ.{' '}
            <a href="/app/disclaimer.html" className="underline hover:text-blue-400 ml-1">ಮಾರ್ಗಸೂಚಿಗಳನ್ನು ಓದಿ →</a>
          </span>
        )}
      </div>

      {/* ================= 1. GOVERNMENT HEADER ================= */}
      <header className="sticky top-0 z-40 w-full h-16 bg-white/95 backdrop-blur-md border-b border-[#dee3e9] px-6 md:px-12 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img src="/app/karnataka_emblem.png" alt="Karnataka Coat of Arms" className="w-9 h-9 object-contain" width="36" height="36" />
          <div className="flex flex-col text-left border-l border-[#dee3e9] pl-3">
            <span className="text-[8px] font-sans font-bold tracking-[0.2em] text-slate-500 uppercase leading-none">
              {t('nav.govKarnataka')}
            </span>
            <span className="font-display font-extrabold text-[12px] text-[#0a1317] tracking-tight mt-1" style={headingStyle}>
              KSP-ConAI
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 font-display font-bold text-xs text-slate-650">
          <a href="/app/index.html" className="hover:text-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md transition duration-150">
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
            href="/app/login.html" 
            className="h-10 px-5 bg-black hover:bg-slate-800 text-white rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all duration-150 select-none shadow-sm flex items-center justify-center font-display"
          >
            {t('nav.login')}
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className="space-y-0 bg-[#ffffff]">
        
        {/* ================= 2. HERO SECTION (UNTOUCHED) ================= */}
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
                href="/app/login.html" 
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

        {/* ================= 3. REDESIGNED: STRATEGIC IMPACT & LIVE INTELLIGENCE STATS ================= */}
        <section id="about" className="border-t border-[#dee3e9] bg-[#ffffff] py-20 md:py-28 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            
            {/* Asymmetric Header Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#991b1b]/10 text-[#991b1b] border border-[#991b1b]/20 text-[10px] font-bold uppercase tracking-widest">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Strategic Protocol</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-[#0a1317] leading-tight font-display tracking-tight" style={headingStyle}>
                  Next-Generation Crime Intelligence & Grounded Analytics
                </h2>
              </div>
              <div className="lg:col-span-5 text-left">
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-medium bg-surface-soft p-5 rounded-2xl border border-hairline-soft">
                  {currentLanguage === 'en' 
                    ? 'Engineered exclusively for Karnataka State Police investigators. Converts complex CCTNS records, suspect timelines, and Case Narrative Diaries into actionable, verifiable intelligence.'
                    : 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ತನಿಖಾಧಿಕಾರಿಗಳಿಗಾಗಿ ಪ್ರತ್ಯೇಕವಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ. CCTNS ದಾಖಲೆಗಳು ಮತ್ತು ಕೇಸ್ ಡೈರಿಗಳನ್ನು ಪರಿಶೀಲಿಸಬಹುದಾದ ಗುಪ್ತಚರ ಮಾಹಿತಿಯಾಗಿ ಭಾಷಾಂತರಿಸುತ್ತದೆ.'}
                </p>
              </div>
            </div>

            {/* Asymmetric 3-Tile Live Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  value: formatNumber(45000) + '+', 
                  title: currentLanguage === 'en' ? 'FIR Case Files Ingested' : 'ದಾಖಲಿಸಲಾದ ಒಟ್ಟು ಎಫ್‌ಐಆರ್‌ಗಳು',
                  subtitle: currentLanguage === 'en' ? 'Synced with CCTNS Central Database' : 'CCTNS ಕೇಂದ್ರೀಯ ಡೇಟಾಬೇಸ್‌ನೊಂದಿಗೆ ಸಿಂಕ್ ಮಾಡಲಾಗಿದೆ',
                  badge: 'CCTNS Sync',
                  accent: 'from-blue-600 to-indigo-700'
                },
                { 
                  value: formatNumber(25000) + '+', 
                  title: currentLanguage === 'en' ? 'Criminal Nodes Mapped' : 'ಸಂಪರ್ಕಿತ ಶಂಕಿತ ವ್ಯಕ್ತಿಗಳು',
                  subtitle: currentLanguage === 'en' ? 'Deep suspect graph connection links' : 'ಸಂಪರ್ಕಿತ ಶಂಕಿತ ಅಪರಾಧಿಗಳ ನೆಟ್‌ವರ್ಕ್',
                  badge: 'Graph Engine',
                  accent: 'from-amber-600 to-rose-700'
                },
                { 
                  value: '100%', 
                  title: currentLanguage === 'en' ? 'Audit Accountability' : 'ನಿಖರವಾದ ಪ್ರಶ್ನೆ ಹೊಣೆಗಾರಿಕೆ',
                  subtitle: currentLanguage === 'en' ? 'Deterministic SQL logging & verification' : 'ಡಿಜಿಟಲ್ ಆಡಿಟಿಂಗ್ ಮತ್ತು ದಾಖಲೆ ಪರಿಶೀಲನೆ',
                  badge: 'Audit Verifiable',
                  accent: 'from-emerald-600 to-teal-700'
                }
              ].map((stat, idx) => (
                <div key={idx} className="bg-canvas border border-hairline-soft p-7 rounded-3xl card-product-shadow space-y-4 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-steel px-2.5 py-1 rounded-full bg-surface-soft border border-hairline">
                      {stat.badge}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className={`text-4xl md:text-5xl font-extrabold font-display tracking-tight bg-gradient-to-r ${stat.accent} bg-clip-text text-transparent`} style={headingStyle}>
                    {stat.value}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-ink-deep font-display" style={headingStyle}>{stat.title}</h3>
                    <p className="text-xs text-steel mt-1 font-medium">{stat.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. REDESIGNED: BENTO 2.0 CAPABILITIES SHOWCASE ================= */}
        <section id="capabilities" className="border-t border-[#dee3e9] py-20 md:py-32 bg-[#fbfbfd]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em] block font-display" style={headingStyle}>
                Core Modules
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a1317] font-display tracking-tight" style={headingStyle}>
                {t('capabilities.sectionTitle')}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                {t('capabilities.sectionSubtitle')}
              </p>
            </div>

            {/* Asymmetric Bento 2.0 Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Bento Card 1: Relational Link Graph (Large 7 Columns) */}
              <div className="lg:col-span-7 bg-[#080d1a] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800 flex flex-col justify-between min-h-[360px] group">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
                
                {/* Card Header Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                    <Network className="w-3.5 h-3.5" />
                    <span>Suspect Relational Graph</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">Node Engine v2.4</span>
                </div>

                {/* Simulated Graph Mockup Display */}
                <div className="relative z-10 my-6 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3 backdrop-blur-md">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      Gang Network #KA-BC-812
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">5 Suspects Linked</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
                    <div className="bg-slate-800/80 border border-rose-500/30 p-2.5 rounded-xl flex flex-col">
                      <span className="text-[9px] text-rose-400 font-bold uppercase">Prime Suspect</span>
                      <span className="font-bold text-white mt-0.5">Ramesh @ Tiger</span>
                      <span className="text-[9px] text-slate-400 mt-1">3 Cases • FIR #812</span>
                    </div>

                    <div className="bg-slate-800/80 border border-amber-500/30 p-2.5 rounded-xl flex flex-col">
                      <span className="text-[9px] text-amber-400 font-bold uppercase">Associate</span>
                      <span className="font-bold text-white mt-0.5">Siddappa K.</span>
                      <span className="text-[9px] text-slate-400 mt-1">CDR Match (0.94)</span>
                    </div>

                    <div className="bg-slate-800/80 border border-blue-500/30 p-2.5 rounded-xl flex flex-col col-span-2 sm:col-span-1">
                      <span className="text-[9px] text-blue-400 font-bold uppercase">Vehicle Node</span>
                      <span className="font-bold text-white mt-0.5">KA-01-MJ-8819</span>
                      <span className="text-[9px] text-slate-400 mt-1">Toll Gate Pin</span>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Copy */}
                <div className="relative z-10 space-y-1">
                  <h3 className="text-lg font-bold text-white font-display" style={headingStyle}>
                    {t('capabilities.card2Title')}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    {t('capabilities.card2Desc')}
                  </p>
                </div>
              </div>

              {/* Bento Card 2: AI Assistant Query Workspace (5 Columns) */}
              <div className="lg:col-span-5 bg-canvas border border-hairline-soft rounded-3xl p-6 sm:p-8 card-product-shadow flex flex-col justify-between min-h-[360px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-steel tracking-wider block">Natural Language SQL</span>
                      <h3 className="text-base font-bold text-ink-deep font-display" style={headingStyle}>
                        {t('capabilities.card1Title')}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-steel font-medium leading-relaxed">
                    {t('capabilities.card1Desc')}
                  </p>

                  {/* Interactive Query Stream Mockup */}
                  <div className="p-3.5 bg-surface-soft rounded-2xl border border-hairline-soft space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-steel">
                      <span className="flex items-center gap-1.5">
                        <Cpu className="w-3 h-3 text-primary" /> Copilot Stream
                      </span>
                      <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        99.4% Grounded
                      </span>
                    </div>
                    <div className="bg-canvas p-2.5 rounded-xl border border-hairline text-xs font-semibold text-ink-deep">
                      "Show all robbery FIRs registered in Mysuru City during 2026."
                    </div>
                    <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 text-xs font-semibold text-primary-deep flex items-center justify-between">
                      <span>✓ 4 Matching Cases Found</span>
                      <a href="/app/search.html" className="text-[10px] underline font-bold">View List →</a>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-hairline-soft flex items-center justify-between text-[9px] font-mono text-stone font-bold uppercase">
                  <span>SQL TRANSLATION LOGGED</span>
                  <span>ZERO HALLUCINATION</span>
                </div>
              </div>

              {/* Bento Card 3: Geocoded Hotspot Radar (5 Columns) */}
              <div className="lg:col-span-5 bg-canvas border border-hairline-soft rounded-3xl p-6 sm:p-8 card-product-shadow flex flex-col justify-between min-h-[320px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-steel tracking-wider block">Geospatial Analytics</span>
                      <h3 className="text-base font-bold text-ink-deep font-display" style={headingStyle}>
                        {t('capabilities.card3Title')}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-steel font-medium leading-relaxed">
                    {t('capabilities.card3Desc')}
                  </p>

                  {/* Animated Radar Sweep */}
                  <div className="h-28 rounded-2xl bg-slate-950 relative overflow-hidden flex items-center justify-center border border-slate-800">
                    <div className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
                    <div className="w-16 h-16 rounded-full border border-sky-500/30 animate-ping" />
                    <div className="absolute w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-sky-400 animate-pulse" />
                    </div>
                    <div className="absolute top-2.5 left-3 text-[8px] font-mono text-sky-400 font-bold uppercase tracking-widest">
                      Bengaluru City • 12 Hotspot Pins Active
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-hairline-soft flex items-center justify-between text-[9px] font-mono text-stone font-bold uppercase">
                  <span>GPS COORDINATES</span>
                  <a href="/app/map.html" className="text-primary hover:underline font-bold">Open Map →</a>
                </div>
              </div>

              {/* Bento Card 4: Executive Document Vault (7 Columns) */}
              <div className="lg:col-span-7 bg-canvas border border-hairline-soft rounded-3xl p-6 sm:p-8 card-product-shadow flex flex-col justify-between min-h-[320px]">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-steel tracking-wider block">Judicial Intelligence Export</span>
                      <h3 className="text-base font-bold text-ink-deep font-display" style={headingStyle}>
                        {t('capabilities.card4Title')}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-steel font-medium leading-relaxed">
                    {t('capabilities.card4Desc')}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {[
                      { name: 'KA-BC-2026-00812_Brief.pdf', size: '1.4 MB', time: 'Generated 2m ago' },
                      { name: 'KA-MY-2026-00124_Brief.pdf', size: '2.8 MB', time: 'Generated 1h ago' }
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-hairline-soft bg-surface-soft hover:border-steel transition">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-primary shrink-0" />
                          <div className="flex flex-col text-left">
                            <span className="text-[11px] font-bold text-ink-deep">{doc.name}</span>
                            <span className="text-[9px] text-steel">{doc.time} • {doc.size}</span>
                          </div>
                        </div>
                        <a href="/app/reports.html" className="text-[9px] font-bold text-primary hover:underline">VIEW</a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-hairline-soft flex items-center justify-between text-[9px] font-mono text-stone font-bold uppercase">
                  <span>AUDIT STAMPED PDF</span>
                  <span>LEGAL TESTIMONY READY</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 5. REDESIGNED: OPERATIONAL PROTOCOL & WORKFLOW ================= */}
        <section id="workflow" className="border-t border-[#dee3e9] bg-[#ffffff] py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-[10px] font-bold text-[#991b1b] uppercase tracking-[0.25em] block font-display" style={headingStyle}>
                Standard Operating Procedure
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a1317] font-display tracking-tight" style={headingStyle}>
                {t('workflow.sectionTitle')}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                {t('workflow.sectionSubtitle')}
              </p>
            </div>

            {/* Interactive Step Switcher Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {[
                { step: '01', title: t('workflow.step1'), desc: t('workflow.step1Desc'), icon: Database },
                { step: '02', title: t('workflow.step2'), desc: t('workflow.step2Desc'), icon: Layers },
                { step: '03', title: t('workflow.step3'), desc: t('workflow.step3Desc'), icon: Search },
                { step: '04', title: t('workflow.step4'), desc: t('workflow.step4Desc'), icon: FileCheck }
              ].map((item, idx) => {
                const IconComponent = item.icon;
                const isSelected = activeWorkflowTab === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => setActiveWorkflowTab(idx)}
                    className={`p-6 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 ${
                      isSelected 
                        ? 'bg-ink-deep text-white border-ink-deep shadow-lg scale-[1.02]' 
                        : 'bg-canvas text-ink-deep border-hairline-soft hover:border-steel hover:bg-surface-soft/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full ${
                        isSelected ? 'bg-white/15 text-white' : 'bg-surface-soft text-steel'
                      }`}>
                        STEP {item.step}
                      </span>
                      <IconComponent className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-stone'}`} />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <h3 className={`text-sm font-bold font-display ${isSelected ? 'text-white' : 'text-ink-deep'}`} style={headingStyle}>
                        {item.title}
                      </h3>
                      <p className={`text-xs leading-relaxed ${isSelected ? 'text-slate-300' : 'text-steel'}`}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 6. REDESIGNED: SECURITY, AUDIT & COMPLIANCE ================= */}
        <section className="border-t border-[#dee3e9] py-20 md:py-32 bg-[#080d1a] text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.25em] block font-display" style={headingStyle}>
                Compliance Engine
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white font-display tracking-tight" style={headingStyle}>
                {t('privacy.sec4Title')}
              </h2>
              <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-medium">
                {t('privacy.sec4Desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { title: t('privacy.sec3Title'), desc: t('privacy.sec3Desc'), icon: Shield },
                { title: t('privacy.sec4Title'), desc: t('privacy.sec4Desc'), icon: Lock },
                { title: t('terms.sec1Title'), desc: t('terms.sec1Desc'), icon: FileText }
              ].map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={idx} className="bg-slate-900/90 border border-slate-800 p-7 rounded-3xl space-y-4 hover:border-slate-700 transition duration-200">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider" style={headingStyle}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= 7. REDESIGNED: ACCORDION FAQ ================= */}
        <section id="faq" className="border-t border-[#dee3e9] bg-[#ffffff] py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em] block font-display" style={headingStyle}>
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a1317] font-display tracking-tight" style={headingStyle}>
                {t('faq.sectionTitle')}
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { q: t('faq.q1'), a: t('faq.a1') },
                { q: t('faq.q2'), a: t('faq.a2') },
                { q: t('faq.q3'), a: t('faq.a3') }
              ].map((item, idx) => (
                <details key={idx} className="group bg-canvas border border-hairline-soft rounded-2xl overflow-hidden card-product-shadow transition duration-200">
                  <summary className="px-6 py-5 text-xs font-bold text-[#0a1317] flex items-center justify-between cursor-pointer select-none font-display" style={headingStyle}>
                    <span>{item.q}</span>
                    <svg className="w-4 h-4 text-slate-400 transition-transform duration-200 group-open:rotate-180 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 border-t border-hairline-soft pt-4 text-xs text-steel leading-relaxed bg-surface-soft/40 font-medium">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 8. REDESIGNED: COMMAND CENTER CALL TO ACTION ================= */}
        <section className="border-t border-[#dee3e9] py-16 bg-[#fbfbfd] px-6">
          <div className="max-w-4xl mx-auto bg-[#0a1317] text-white p-10 sm:p-16 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden border border-slate-800">
            {/* Glowing ambient orb */}
            <div className="absolute top-0 right-0 w-[60%] h-[100%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

            <span className="relative z-10 text-[10px] font-bold text-blue-400 uppercase tracking-[0.25em] block font-display" style={headingStyle}>
              {t('login.regTitle')}
            </span>
            <h2 className="relative z-10 text-2xl sm:text-4xl font-extrabold text-white leading-tight font-display tracking-tight" style={headingStyle}>
              Ready to Access Crime Intelligence?
            </h2>
            <p className="relative z-10 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto font-medium">
              {t('login.subtitle')}
            </p>
            <a 
              href="/app/login.html" 
              className="relative z-10 inline-flex items-center justify-center h-11 px-8 bg-white hover:bg-slate-100 text-[#080d1a] rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none transition-all duration-150 shadow-md select-none active:scale-[0.98] font-display"
            >
              {t('hero.launch')} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </a>
          </div>
        </section>

        {/* ================= 9. REDESIGNED: OFFICIAL FOOTER ================= */}
        <footer className="bg-white border-t border-[#dee3e9] px-6 md:px-12 py-14 text-xs space-y-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center gap-3">
              <img src="/app/karnataka_emblem.png" alt="Government Seal" className="w-8 h-8 object-contain" width="32" height="32" />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-[#0a1317] leading-tight font-display" style={headingStyle}>
                  {t('nav.govKarnataka')}
                </span>
                <span className="text-slate-500 font-bold leading-none mt-0.5 uppercase tracking-wider text-[8px]">
                  {t('nav.statePolice')}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-medium text-slate-650">
              <a href="#about" className="hover:text-primary transition">
                {t('nav.about')}
              </a>
              <span aria-hidden="true" className="text-slate-350">•</span>
              <a href="/app/privacy.html" className="hover:text-primary transition">
                {t('footer.privacy')}
              </a>
              <span aria-hidden="true" className="text-slate-350">•</span>
              <a href="/app/terms.html" className="hover:text-primary transition">
                {t('footer.terms')}
              </a>
              <span aria-hidden="true" className="text-slate-350">•</span>
              <a href="/app/disclaimer.html" className="hover:text-primary transition">
                {t('footer.disclaimer')}
              </a>
            </div>

            <div className="text-center md:text-right text-slate-400 font-bold font-mono text-[10px]">
              <span>KSP-ConAI Platform (v1.1)</span>
            </div>
          </div>
          
          <div className="max-w-7xl mx-auto border-t border-[#dee3e9] pt-6 text-center text-[10px] text-slate-400 leading-relaxed font-medium">
            {currentLanguage === 'en' 
              ? '© 2026 Government of Karnataka. All Rights Reserved. Confidential law-enforcement tool. Access and actions are governed under official information security guidelines.'
              : '© 2026 ಕರ್ನಾಟಕ ಸರ್ಕಾರ. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಗೌಪ್ಯ ಕಾನೂನು ಜಾರಿ ಸಾಧನ. ಪ್ರವೇಶ ಮತ್ತು ಕ್ರಮಗಳನ್ನು ಅಧಿಕೃತ ಮಾಹಿತಿ ಭದ್ರತಾ ಮಾರ್ಗಸೂಚಿಗಳ ಅಡಿಯಲ್ಲಿ ನಿಯಂತ್ರಿಸಲಾಗುತ್ತದೆ.'}
          </div>
        </footer>
      </div>
    </div>
  );
};
