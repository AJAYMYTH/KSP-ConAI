import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, ArrowRight, Bot, Network, Activity, FileText, Download
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
    <div className="bg-[#ffffff] min-h-[100dvh] text-slate-900 font-sans antialiased selection:bg-primary-soft selection:text-primary-deep overflow-x-hidden">
      {/* Page Curtain Wipe transition on mount */}
      <div 
        className={`fixed inset-0 z-[100] bg-[#080d1a] pointer-events-none transition-transform duration-700 ease-out origin-left ${
          mounted ? 'scale-x-0' : 'scale-x-100'
        }`}
      />

      {/* ================= 0. PROMO BANNER ================= */}
      <div className="w-full bg-[#0a1317] text-white py-3 px-6 text-center text-xs font-bold tracking-wide select-none z-50 relative border-b border-white/[0.08]">
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
            className="h-11 px-6 bg-black hover:bg-slate-800 text-white rounded-full text-xs font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all duration-150 select-none shadow-sm flex items-center justify-center font-display"
          >
            {t('nav.login')}
          </a>
        </div>
      </header>

      {/* Main Container */}
      <div className="space-y-0 bg-[#ffffff]">
        
        {/* ================= 2. HERO SECTION (EXTENDED & ADJUSTED TO MATCH REFERENCE IMAGE) ================= */}
        <section className="relative w-full pt-16 pb-20 md:pt-28 md:pb-32 min-h-[520px] md:min-h-[580px] flex flex-col items-center justify-center text-center px-6 overflow-hidden border-b border-[#dee3e9] bg-[#ffffff]">
          {/* Extended subtle blue dotted background grid pattern matching reference image */}
          <div 
            className="absolute inset-0 opacity-[0.28] pointer-events-none" 
            style={{ 
              backgroundImage: 'radial-gradient(#0064e0 1.5px, transparent 1.5px)', 
              backgroundSize: '40px 40px' 
            }}
          />
          
          <div className="max-w-5xl mx-auto space-y-6 relative z-10 flex flex-col items-center justify-center">
            {/* Red Eyebrow Badge */}
            <span 
              className={`font-display font-bold text-[11px] md:text-xs tracking-[0.25em] text-[#b91c1c] uppercase block transition-all duration-700 delay-100 ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={headingStyle}
            >
              {t('hero.badge')}
            </span>
            
            {/* Hero Main Headline */}
            <h1 
              className={`text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-medium text-[#0a1317] leading-[1.08] tracking-tight text-center max-w-5xl font-display transition-all duration-750 delay-200 ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={headingStyle}
            >
              KSP-ConAI: <br/>
              <span className="text-[#0064e0] font-medium block mt-1">
                {t('hero.title')}
              </span>
            </h1>

            {/* Subtitle lead paragraph */}
            <p className={`text-base md:text-xl text-[#5d6c7b] leading-[1.55] max-w-2xl text-center font-normal transition-all duration-700 delay-300 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              {t('hero.description')}
            </p>
            
            {/* Dual CTA buttons */}
            <div className={`flex flex-wrap justify-center gap-4 pt-4 transition-all duration-700 delay-400 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <a 
                href="/app/login.html" 
                className="h-12 px-8 bg-[#0a1317] hover:bg-slate-800 text-white rounded-full text-xs md:text-sm font-bold focus-visible:ring-2 focus-visible:ring-[#0064e0] focus-visible:outline-none transition-all duration-200 shadow-md flex items-center justify-center gap-2 select-none font-display active:scale-[0.98]"
              >
                {t('hero.launch')} <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#capabilities" 
                className="h-12 px-8 bg-white border-2 border-[#0a1317] text-[#0a1317] hover:bg-slate-50 rounded-full text-xs md:text-sm font-bold focus-visible:ring-2 focus-visible:ring-[#0064e0] focus-visible:outline-none transition-all duration-200 select-none flex items-center justify-center font-display active:scale-[0.98]"
              >
                {t('hero.explore')}
              </a>
            </div>
          </div>
        </section>

        {/* ================= 3. META DESIGN SYSTEM: STRATEGIC MISSION & STATS ================= */}
        <section id="about" className="border-t border-[#dee3e9] bg-[#ffffff] py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            
            {/* Section Eyebrow & Title */}
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0064e0]/10 border border-[#0064e0]/20 text-[#0064e0] text-[10px] font-bold tracking-widest uppercase font-mono">
                <Shield className="w-3.5 h-3.5" />
                <span>STATE SECURITY PROTOCOL</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-medium text-[#0a1317] leading-[1.18] tracking-tight font-display" style={headingStyle}>
                Empowering Law Enforcement via Responsible Intelligence
              </h2>
              <p className="text-sm md:text-base text-[#5d6c7b] leading-[1.55] max-w-2xl mx-auto font-medium">
                {currentLanguage === 'en' 
                  ? '"Providing explainable analytics, relation mapping, and natural language query capability to support state investigators, accelerate prosecution parameters, and ensure complete digital auditing compliance."'
                  : '"ತನಿಖಾಧಿಕಾರಿಗಳಿಗೆ ಸಹಾಯ ಮಾಡಲು, ತನಿಖಾ ಪ್ರಕ್ರಿಯೆಗಳನ್ನು ವೇಗಗೊಳಿಸಲು ಮತ್ತು ಡಿಜಿಟಲ್ ಆಡಿಟಿಂಗ್ ಅನುಸರಣೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ಸಂಬಂಧ ನಕ್ಷೆಗಳು ಮತ್ತು ಪ್ರಶ್ನೆ ಸಾಮರ್ಥ್ಯ ಒದಗಿಸುವುದು."'}
              </p>
            </div>

            {/* Meta Design System Stat Tiles: 32px Rounding, Stark White Canvas, Border Hairline-Soft */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { 
                  value: formatNumber(45000) + '+', 
                  label: currentLanguage === 'en' ? 'FIR Case Files Ingested' : 'ದಾಖಲಿಸಲಾದ ಒಟ್ಟು ಎಫ್‌ಐಆರ್‌ಗಳು', 
                  sub: currentLanguage === 'en' ? 'Indexed across 31 Districts' : '31 ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಇಂಡೆಕ್ಸ್ ಮಾಡಲಾಗಿದೆ',
                  accent: 'text-[#0064e0]' 
                },
                { 
                  value: formatNumber(25000) + '+', 
                  label: currentLanguage === 'en' ? 'Criminal Nodes Linked' : 'ಸಂಪರ್ಕಿತ ಶಂಕಿತ ವ್ಯಕ್ತಿಗಳು', 
                  sub: currentLanguage === 'en' ? 'Multi-degree Associate Graph' : 'ಬಹು-ಹಂತದ ಶಂಕಿತ ಜಾಲ',
                  accent: 'text-[#991b1b]' 
                },
                { 
                  value: '100%', 
                  label: currentLanguage === 'en' ? 'Query Accountability' : 'ನಿಖರವಾದ ಪ್ರಶ್ನೆ ಹೊಣೆಗಾರಿಕೆ', 
                  sub: currentLanguage === 'en' ? 'Immutable Audit Logs' : 'ಬದಲಾಯಿಸಲಾಗದ ಆಡಿಟ್ ಲಾಗ್‌ಗಳು',
                  accent: 'text-[#31a24c]' 
                }
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className="p-8 border border-[#dee3e9] bg-[#ffffff] rounded-3xl shadow-xs hover:border-[#0064e0]/40 hover:shadow-md transition-all duration-300 text-left space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className={`text-4xl md:text-5xl font-bold font-display tracking-tight tabular-nums ${stat.accent}`} style={headingStyle}>
                      {stat.value}
                    </div>
                    <div className="text-xs font-bold text-[#0a1317] tracking-tight pt-1">
                      {stat.label}
                    </div>
                  </div>
                  <div className="text-[10px] text-[#5d6c7b] font-medium pt-2 border-t border-[#dee3e9]/60 flex items-center justify-between">
                    <span>{stat.sub}</span>
                    <span className="w-2 h-2 rounded-full bg-[#0064e0]"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 4. META BENTO GRID CAPABILITIES ================= */}
        <section id="capabilities" className="border-t border-[#dee3e9] py-20 md:py-28 bg-[#f1f4f7]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-14">
            
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-[10px] font-bold text-[#0064e0] uppercase tracking-[0.25em] block font-mono">
                PLATFORM CAPABILITIES
              </span>
              <h2 className="text-3xl md:text-4xl font-medium text-[#0a1317] font-display tracking-tight" style={headingStyle}>
                {t('capabilities.sectionTitle')}
              </h2>
              <p className="text-xs md:text-sm text-[#5d6c7b] leading-relaxed font-medium">
                {t('capabilities.sectionSubtitle')}
              </p>
            </div>

            {/* Meta Bento Grid: Generous Card Rounding (32px), Sleek Visual Overlays */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              
              {/* Card 1: Full Bleed Photo Card with Dark Gradient Overlay */}
              <div className="md:col-span-2 bg-[#0a1317] rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden min-h-[320px] group border border-[#dee3e9]/40 flex flex-col justify-end">
                <img 
                  src="/app/network_mockup.png" 
                  alt="Network Graph Link Analysis" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1317] via-[#0a1317]/60 to-transparent p-8 md:p-10 flex flex-col justify-end text-left z-10 space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-800/60 text-red-300 text-[9px] font-bold uppercase tracking-widest font-mono w-fit">
                    <Network className="w-3 h-3" />
                    <span>INTELLIGENCE ENGINE</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight font-display" style={headingStyle}>
                    {t('capabilities.card2Title')}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 leading-[1.55] font-medium max-w-xl">
                    {t('capabilities.card2Desc')}
                  </p>
                </div>
              </div>

              {/* Card 2: Interactive AI Copilot Mockup */}
              <div className="bg-[#ffffff] border border-[#dee3e9] p-8 rounded-3xl shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[320px] space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0064e0]/10 flex items-center justify-center text-[#0064e0] shrink-0">
                      <Bot className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#0a1317] tracking-tight font-display" style={headingStyle}>
                      {t('capabilities.card1Title')}
                    </h3>
                  </div>
                  <p className="text-xs text-[#5d6c7b] leading-[1.50] font-medium">
                    {t('capabilities.card1Desc')}
                  </p>

                  <div className="p-3.5 bg-[#f1f4f7] rounded-2xl border border-[#dee3e9] space-y-2.5">
                    <div className="text-[9px] text-[#5d6c7b] font-bold flex justify-between tracking-wider font-mono">
                      <span>SECURE COPILOT STREAM</span>
                      <span className="text-[#0064e0] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#0064e0] animate-pulse"></span>LIVE</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2.5 bg-white rounded-xl border border-[#dee3e9] text-[11px] font-medium text-[#0a1317] leading-tight shadow-xs">
                        "Find phone links for Case KA-BC-2026-00812."
                      </div>
                      <div className="p-2.5 bg-[#0064e0]/10 rounded-xl border border-[#0064e0]/20 text-[11px] font-medium text-[#0457cb] leading-tight">
                        "Analysis complete: Linked 2 active phone numbers to suspect group."
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-[#dee3e9] flex gap-3 text-[9px] text-[#8595a4] font-mono font-bold tracking-widest uppercase">
                  <span>SSE STREAMING</span>
                  <span>•</span>
                  <span>SQL LOG AUDITABLE</span>
                </div>
              </div>

              {/* Card 3: Geospatial Radar Sweep */}
              <div className="bg-[#ffffff] border border-[#dee3e9] p-8 rounded-3xl shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[320px] space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#0a1317] tracking-tight font-display" style={headingStyle}>
                      {t('capabilities.card3Title')}
                    </h3>
                  </div>
                  <p className="text-xs text-[#5d6c7b] leading-[1.50] font-medium">
                    {t('capabilities.card3Desc')}
                  </p>

                  <div className="h-32 rounded-2xl bg-[#0a1317] relative overflow-hidden flex items-center justify-center border border-[#dee3e9]/20">
                    <div className="absolute inset-0 bg-[radial-gradient(#0064e0_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
                    <div className="w-16 h-16 rounded-full border border-[#0064e0]/30 flex items-center justify-center animate-ping duration-1000"></div>
                    <div className="absolute w-9 h-9 rounded-full bg-[#0064e0]/30 border border-[#0064e0]/60 flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#0064e0] animate-pulse"></div>
                    </div>
                    <div className="absolute top-3 left-3 text-[8px] text-[#0064e0] font-mono tracking-widest font-bold uppercase">
                      RADAR SWEEP ACTIVE
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-[#dee3e9] text-[9px] text-[#8595a4] font-mono font-bold tracking-widest uppercase">
                  <span>GEOSPATIAL COORDINATES</span>
                </div>
              </div>

              {/* Card 4: Executive Document Intelligence */}
              <div className="md:col-span-2 bg-[#ffffff] border border-[#dee3e9] p-8 rounded-3xl shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-h-[320px] space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#f1f4f7] border border-[#dee3e9] flex items-center justify-center text-[#0a1317] shrink-0">
                      <FileText className="w-6 h-6 text-[#0064e0]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0a1317] font-display tracking-tight" style={headingStyle}>
                        {t('capabilities.card4Title')}
                      </h3>
                      <span className="text-[10px] text-[#5d6c7b] font-mono uppercase tracking-wider">Automated Case Briefing Output</span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-[#5d6c7b] leading-[1.60] font-medium max-w-2xl">
                    {t('capabilities.card4Desc')}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {[
                      { name: 'KA-BC-2026-00812_Brief.pdf', size: '1.4 MB', time: 'Generated 2m ago' },
                      { name: 'KA-MY-2026-00124_Brief.pdf', size: '2.8 MB', time: 'Generated 1h ago' }
                    ].map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl border border-[#dee3e9] bg-[#ffffff] hover:border-[#0064e0] transition duration-150 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-[#0064e0] shrink-0" />
                          <div className="flex flex-col text-left">
                            <span className="text-[11px] font-bold text-[#0a1317] tracking-tight">{doc.name}</span>
                            <span className="text-[9px] text-[#8595a4]">{doc.time} • {doc.size}</span>
                          </div>
                        </div>
                        <a href="/app/login.html" className="text-[9px] font-bold text-[#0064e0] hover:underline flex items-center gap-0.5">
                          <Download className="w-3 h-3" /> EXPORT
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#dee3e9] flex gap-4 text-[9px] text-[#8595a4] font-mono font-bold tracking-widest uppercase">
                  <span>PDF COMPILED</span>
                  <span>•</span>
                  <span>TEMPORAL METRICS</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= 5. PROCEDURAL WORKFLOW PIPELINE ================= */}
        <section id="workflow" className="border-t border-[#dee3e9] bg-[#ffffff] py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-[10px] font-bold text-[#991b1b] uppercase tracking-[0.25em] block font-mono">
                OPERATIONAL PIPELINE
              </span>
              <h2 className="text-3xl md:text-4xl font-medium text-[#0a1317] font-display tracking-tight" style={headingStyle}>
                {t('workflow.sectionTitle')}
              </h2>
              <p className="text-xs md:text-sm text-[#5d6c7b] leading-relaxed font-medium">
                {t('workflow.sectionSubtitle')}
              </p>
            </div>

            {/* Horizontal 4-Step Pipeline */}
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-6 left-1/8 right-1/8 h-0.5 bg-[#dee3e9] z-0"></div>

                {[
                  { title: t('workflow.step1'), desc: t('workflow.step1Desc') },
                  { title: t('workflow.step2'), desc: t('workflow.step2Desc') },
                  { title: t('workflow.step3'), desc: t('workflow.step3Desc') },
                  { title: t('workflow.step4'), desc: t('workflow.step4Desc') }
                ].map((step, idx) => (
                  <div key={idx} className="relative flex flex-col items-center text-center space-y-4 z-10">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-[#0064e0] text-[#0064e0] font-display font-bold text-sm flex items-center justify-center shadow-xs transition-transform duration-300 hover:scale-110">
                      {idx + 1}
                    </div>
                    <h3 className="text-xs font-bold text-[#0a1317] uppercase tracking-wider font-display" style={headingStyle}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#5d6c7b] leading-relaxed max-w-[200px] font-medium">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. SECURITY & AUDIT COMPLIANCE ================= */}
        <section className="border-t border-[#dee3e9] py-20 md:py-28 bg-[#f1f4f7]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-14">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <span className="text-[10px] font-bold text-[#0064e0] uppercase tracking-[0.25em] block font-mono">
                SECURITY STANDARDS
              </span>
              <h2 className="text-3xl md:text-4xl font-medium text-[#0a1317] font-display tracking-tight" style={headingStyle}>
                {t('privacy.sec4Title')}
              </h2>
              <p className="text-xs md:text-sm text-[#5d6c7b] leading-relaxed font-medium">
                {t('privacy.sec4Desc')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { title: t('privacy.sec3Title'), desc: t('privacy.sec3Desc') },
                { title: t('privacy.sec4Title'), desc: t('privacy.sec4Desc') },
                { title: t('terms.sec1Title'), desc: t('terms.sec1Desc') }
              ].map((item, idx) => (
                <div key={idx} className="bg-white border border-[#dee3e9] p-6 rounded-3xl space-y-3 shadow-xs hover:border-[#0064e0]/40 transition duration-200">
                  <div className="flex items-center gap-2.5 text-[#991b1b]">
                    <Lock className="w-4 h-4" />
                    <h3 className="text-xs font-bold text-[#0a1317] uppercase tracking-wider font-display" style={headingStyle}>
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[#5d6c7b] leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 7. FAQ ACCORDION ================= */}
        <section id="faq" className="border-t border-[#dee3e9] bg-[#ffffff] py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-6 space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-bold text-[#0064e0] uppercase tracking-[0.25em] block font-mono">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="text-3xl md:text-4xl font-medium text-[#0a1317] font-display tracking-tight" style={headingStyle}>
                {t('faq.sectionTitle')}
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { q: t('faq.q1'), a: t('faq.a1') },
                { q: t('faq.q2'), a: t('faq.a2') },
                { q: t('faq.q3'), a: t('faq.a3') }
              ].map((item, idx) => (
                <details key={idx} className="group bg-white border border-[#dee3e9] rounded-2xl overflow-hidden shadow-2xs transition duration-200">
                  <summary className="px-6 py-5 text-xs font-bold text-[#0a1317] flex items-center justify-between cursor-pointer select-none font-display" style={headingStyle}>
                    <span>{item.q}</span>
                    <svg className="w-4 h-4 text-[#8595a4] transition-transform duration-200 group-open:rotate-180 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 border-t border-[#dee3e9] pt-4 text-xs text-[#5d6c7b] leading-relaxed bg-[#f1f4f7]/40 font-medium">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ================= 8. META CTA STRIP ================= */}
        <section className="border-t border-[#dee3e9] py-16 bg-[#f1f4f7] px-6">
          <div className="max-w-4xl mx-auto bg-[#080d1a] text-white p-12 md:p-16 rounded-3xl text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[50%] h-[100%] rounded-full bg-[#0064e0]/10 blur-[100px] pointer-events-none"></div>

            <span className="relative z-10 text-[10px] font-bold text-[#0064e0] uppercase tracking-[0.25em] block font-mono">
              {t('login.regTitle')}
            </span>
            <h2 className="relative z-10 text-2xl md:text-4xl font-medium text-white leading-tight font-display tracking-tight" style={headingStyle}>
              Ready to begin an investigation?
            </h2>
            <p className="relative z-10 text-xs md:text-sm text-slate-400 leading-relaxed max-w-md mx-auto font-medium">
              {t('login.subtitle')}
            </p>
            <a 
              href="/app/login.html" 
              className="relative z-10 inline-flex items-center justify-center h-12 px-8 bg-white hover:bg-slate-100 text-[#080d1a] rounded-full text-xs font-bold transition-all duration-150 shadow-md select-none active:scale-[0.98] font-display"
            >
              {t('hero.launch')}
            </a>
          </div>
        </section>

        {/* ================= 9. EXECUTIVE META-STYLE GOVERNMENT FOOTER ================= */}
        <footer className="bg-[#ffffff] border-t border-[#dee3e9] pt-16 pb-12 px-6 md:px-12 text-xs">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Top Multi-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
              
              {/* Column 1: Official Brand Identity & Seal */}
              <div className="lg:col-span-2 space-y-4 pr-0 lg:pr-6">
                <div className="flex items-center gap-3">
                  <img src="/app/karnataka_emblem.png" alt="Karnataka State Emblem" className="w-10 h-10 object-contain shrink-0" width="40" height="40" />
                  <div className="flex flex-col text-left">
                    <span className="font-display font-bold text-lg leading-tight tracking-tight text-[#0a1317]" style={headingStyle}>
                      KSP-ConAI
                    </span>
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#5d6c7b]">
                      {currentLanguage === 'en' ? 'Karnataka State Police' : 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#5d6c7b] leading-relaxed max-w-sm font-medium">
                  {currentLanguage === 'en' 
                    ? 'An official, retrieval-grounded crime intelligence workspace built for Karnataka State Police investigators and analysts.'
                    : 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ತನಿಖಾಧಿಕಾರಿಗಳು ಮತ್ತು ವಿಶ್ಲೇಷಕರಿಗಾಗಿ ನಿರ್ಮಿಸಲಾದ ಅಧಿಕೃತ ಅಪರಾಧ ಗುಪ್ತಚರ ವೇದಿಕೆ.'}
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f1f4f7] border border-[#dee3e9] text-[9.5px] font-bold text-[#0a1317] font-mono select-none">
                  <span className="w-2 h-2 rounded-full bg-[#31a24c] animate-pulse"></span>
                  <span>OFFICIAL KSP GATEWAY (v1.1)</span>
                </div>
              </div>

              {/* Column 2: Core Platform Tools */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#0a1317] uppercase tracking-widest font-mono block">
                  {t('footer.tools')}
                </span>
                <ul className="space-y-2.5 font-medium text-[#5d6c7b]">
                  <li><a href="/app/dashboard.html" className="hover:text-[#0064e0] transition">{t('nav.dashboard')}</a></li>
                  <li><a href="/app/search.html" className="hover:text-[#0064e0] transition">{t('nav.search')}</a></li>
                  <li><a href="/app/map.html" className="hover:text-[#0064e0] transition">{t('nav.map')}</a></li>
                  <li><a href="/app/assistant.html" className="hover:text-[#0064e0] transition">{t('nav.assistant')}</a></li>
                  <li><a href="/app/graph.html" className="hover:text-[#0064e0] transition">{t('nav.graph')}</a></li>
                  <li><a href="/app/reports.html" className="hover:text-[#0064e0] transition">{t('nav.reports')}</a></li>
                </ul>
              </div>

              {/* Column 3: Legal & Compliance */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#0a1317] uppercase tracking-widest font-mono block">
                  LEGAL & POLICY
                </span>
                <ul className="space-y-2.5 font-medium text-[#5d6c7b]">
                  <li><a href="/app/privacy.html" className="hover:text-[#0064e0] transition">{t('footer.privacy')}</a></li>
                  <li><a href="/app/terms.html" className="hover:text-[#0064e0] transition">{t('footer.terms')}</a></li>
                  <li><a href="/app/disclaimer.html" className="hover:text-[#0064e0] transition">{t('footer.disclaimer')}</a></li>
                  <li><a href="/app/compliance.html" className="hover:text-[#0064e0] transition">{t('footer.audit')}</a></li>
                  <li><a href="/app/admin.html" className="hover:text-[#0064e0] transition">{t('footer.admin')}</a></li>
                </ul>
              </div>

              {/* Column 4: Support & Contact */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#0a1317] uppercase tracking-widest font-mono block">
                  {t('footer.support')}
                </span>
                <ul className="space-y-2.5 font-medium text-[#5d6c7b]">
                  <li><a href="mailto:itcell@ksp.gov.in" className="hover:text-[#0064e0] transition">KSP IT Support Cell</a></li>
                  <li><a href="/app/disclaimer.html" className="hover:text-[#0064e0] transition">SOP Guidelines</a></li>
                  <li><a href="mailto:support@ksp.gov.in" className="hover:text-[#0064e0] transition">Technical Helpdesk</a></li>
                  <li><a href="/app/login.html" className="hover:text-[#0064e0] transition">Officer Single Sign-On</a></li>
                </ul>
              </div>

            </div>

            {/* Bottom Divider & Confidentiality Disclaimer */}
            <div className="border-t border-[#dee3e9] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-[#8595a4]">
              <div className="space-y-1 text-center md:text-left">
                <p className="font-semibold text-[#5d6c7b]">
                  © 2026 Karnataka State Police — Datathon 2026. All rights reserved.
                </p>
                <p className="text-[9.5px] max-w-3xl leading-relaxed">
                  CONFIDENTIALITY NOTICE: This portal contains sensitive law enforcement intelligence. Access is restricted to authorized personnel. All queries and exports are audited under Section 66 of the Information Technology Act.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 font-mono font-bold text-[#5d6c7b]">
                <a href="/app/privacy.html" className="hover:text-[#0064e0] transition">{t('footer.privacy')}</a>
                <span>·</span>
                <a href="/app/terms.html" className="hover:text-[#0064e0] transition">{t('footer.terms')}</a>
                <span>·</span>
                <a href="/app/disclaimer.html" className="hover:text-[#0064e0] transition">{t('footer.disclaimer')}</a>
              </div>
            </div>

          </div>
        </footer>
      </div>
    </div>
  );
};
