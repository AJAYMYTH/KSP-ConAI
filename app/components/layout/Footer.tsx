import React, { useState, useEffect } from 'react';

export default function Footer() {
  const [language, setLanguage] = useState<'EN' | 'KN'>('EN');

  useEffect(() => {
    const stored = localStorage.getItem('ksp_language') as 'EN' | 'KN';
    if (stored) setLanguage(stored);

    const handleLanguageChange = (e: CustomEvent<'EN' | 'KN'>) => {
      setLanguage(e.detail);
    };

    window.addEventListener('ksp-language-change' as any, handleLanguageChange);
    return () => {
      window.removeEventListener('ksp-language-change' as any, handleLanguageChange);
    };
  }, []);

  const currentYear = new Date().getFullYear();

  const t = {
    EN: {
      desc: 'An advanced, retrieval-grounded crime intelligence workspace built for Karnataka State Police investigators and analysts.',
      resources: 'Resources',
      lookup: 'Crime Head Lookup',
      catalog: 'Act & Section Catalog',
      sop: 'Standard Operating Proc.',
      faq: 'FAQ',
      tools: 'Tools',
      dashboard: 'Analytics Dashboard',
      fir: 'FIR Database',
      map: 'Hotspot Mapping',
      assistant: 'AI Assistant',
      graph: 'Relationship Network Graph',
      reports: 'Intelligence Reports',
      catalyst: 'Catalyst Services',
      auth: 'Authentication',
      quickml: 'QuickML',
      zia: 'Zia Engine',
      smartbrowz: 'SmartBrowz PDF',
      support: 'Support',
      helpdesk: 'Technical Helpdesk',
      audit: 'Audit Log Requests',
      feedback: 'Feedback Form',
      admin: 'Admin Console',
      copyright: `© ${currentYear} Karnataka State Police — Datathon 2026. All rights reserved.`,
      confidentiality: 'CONFIDENTIALITY NOTICE: This system contains sensitive law enforcement intelligence. Access is restricted to authorized personnel only. All queries are audited.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      disclaimer: 'Usage Disclaimer'
    },
    KN: {
      desc: 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ತನಿಖಾಧಿಕಾರಿಗಳು ಮತ್ತು ವಿಶ್ಲೇಷಕರಿಗಾಗಿ ನಿರ್ಮಿಸಲಾದ ಸುಧಾರಿತ ಅಪರಾಧ ಗುಪ್ತಚರ ಕಾರ್ಯಕ್ಷೇತ್ರ.',
      resources: 'ಸಂಪನ್ಮೂಲಗಳು',
      lookup: 'ಅಪರಾಧ ಶೀರ್ಷಿಕೆ ಹುಡುಕಾಟ',
      catalog: 'ಕಾಯ್ದೆ ಮತ್ತು ಸೆಕ್ಷನ್ ಕ್ಯಾಟಲಾಗ್',
      sop: 'ಪ್ರಮಾಣಿತ ಕಾರ್ಯಾಚರಣೆ ವಿಧಾನ',
      faq: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು',
      tools: 'ಪರಿಕರಗಳು',
      dashboard: 'ವಿಶ್ಲೇಷಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      fir: 'ಎಫ್‌ಐಆರ್ ಡೇಟಾಬೇಸ್',
      map: 'ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳ ನಕ್ಷೆ',
      assistant: 'AI ಸಹಾಯಕ',
      graph: 'ಸಂಬಂಧಗಳ ಜಾಲ ನಕ್ಷೆ',
      reports: 'ತನಿಖಾ ವರದಿಗಳು',
      catalyst: 'ಕ್ಯಾಟಲಿಸ್ಟ್ ಸೇವೆಗಳು',
      auth: 'ದೃಢೀಕರಣ',
      quickml: 'QuickML',
      zia: 'ಜಿಯಾ ಎಂಜಿನ್',
      smartbrowz: 'SmartBrowz PDF',
      support: 'ಬೆಂಬಲ',
      helpdesk: 'ತಾಂತ್ರಿಕ ಸಹಾಯ ಕೇಂದ್ರ',
      audit: 'ಆಡಿಟ್ ಲಾಗ್ ವಿನಂತಿಗಳು',
      feedback: 'ಪ್ರತಿಕ್ರಿಯೆ ಫಾರ್ಮ್',
      admin: 'ನಿರ್ವಾಹಕ ಕನ್ಸೋಲ್',
      copyright: `© ${currentYear} ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ — ದತ್ತಾಂಶ ಹಬ್ಬ 2026. ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.`,
      confidentiality: 'ಗೌಪ್ಯತೆ ಸೂಚನೆ: ಈ ವ್ಯವಸ್ಥೆಯು ಸೂಕ್ಷ್ಮ ಕಾನೂನು ಜಾರಿ ಮಾಹಿತಿಯನ್ನು ಒಳಗೊಂಡಿದೆ. ಪ್ರವೇಶವನ್ನು ಅಧಿಕೃತ ಸಿಬ್ಬಂದಿಗೆ ಮಾತ್ರ ಸೀಮಿತಗೊಳಿಸಲಾಗಿದೆ. ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಆಡಿಟ್ ಮಾಡಲಾಗುತ್ತದೆ.',
      privacy: 'ಗೌಪ್ಯತಾ ನೀತಿ',
      terms: 'ಸೇವೆಯ ನಿಯಮಗಳು',
      disclaimer: 'ಬಳಕೆಯ ಹಕ್ಕುತ್ಯಾಗ'
    }
  }[language];

  return (
    <footer className="w-full bg-canvas border-t border-hairline-soft px-6 md:px-8 py-10 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8">
        {/* Brand Block */}
        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <img src="/karnataka_emblem.png" alt="Government Seal" className="w-8 h-8 object-contain" width="32" height="32" />
            <span className="font-display font-bold text-base tracking-tight text-ink-deep">
              KSP-ConAI
            </span>
          </div>
          <p className="text-xs text-steel leading-relaxed max-w-xs">
            {t.desc}
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">
            {t.resources}
          </span>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t.lookup}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t.catalog}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t.sop}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t.faq}</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">
            {t.tools}
          </span>
          <ul className="flex flex-col gap-2">
            <li><a href="/dashboard" className="text-xs text-steel hover:text-primary transition">{t.dashboard}</a></li>
            <li><a href="/search" className="text-xs text-steel hover:text-primary transition">{t.fir}</a></li>
            <li><a href="/map" className="text-xs text-steel hover:text-primary transition">{t.map}</a></li>
            <li><a href="/assistant" className="text-xs text-steel hover:text-primary transition">{t.assistant}</a></li>
            <li><a href="/graph" className="text-xs text-steel hover:text-primary transition">{t.graph}</a></li>
            <li><a href="/reports" className="text-xs text-steel hover:text-primary transition">{t.reports}</a></li>
          </ul>
        </div>

        {/* Links Column 3 */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">
            {t.catalyst}
          </span>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t.auth}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t.quickml}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t.zia}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t.smartbrowz}</a></li>
          </ul>
        </div>

        {/* Links Column 4 */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">
            {t.support}
          </span>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t.helpdesk}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t.audit}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t.feedback}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t.admin}</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-7xl mx-auto border-t border-hairline-soft mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-stone">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span>
            {t.copyright}
          </span>
          <span className="text-[9px] text-stone/80">
            {t.confidentiality}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-primary transition">{t.privacy}</a>
          <span>·</span>
          <a href="/terms" className="hover:text-primary transition">{t.terms}</a>
          <span>·</span>
          <a href="/disclaimer" className="hover:text-primary transition">{t.disclaimer}</a>
        </div>
      </div>
    </footer>
  );
}
