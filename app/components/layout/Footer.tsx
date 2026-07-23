import React from 'react';
import { useI18n } from '../../i18n/hooks';

export default function Footer() {
  const { t, currentLanguage } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-canvas border-t border-hairline-soft px-6 md:px-8 py-10 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8">
        {/* Brand Block */}
        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <img src="/app/karnataka_emblem.png" alt="Government Seal" className="w-8 h-8 object-contain" width="32" height="32" />
            <span className="font-display font-bold text-base tracking-tight text-ink-deep">
              KSP-ConAI
            </span>
          </div>
          <p className="text-xs text-steel leading-relaxed max-w-xs">
            {t('footer.desc')}
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">
            {t('footer.resources')}
          </span>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t('footer.lookup')}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t('footer.catalog')}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t('footer.sop')}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t('footer.faq')}</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">
            {t('footer.tools')}
          </span>
          <ul className="flex flex-col gap-2">
            <li><a href="/app/dashboard.html" className="text-xs text-steel hover:text-primary transition">{t('nav.dashboard')}</a></li>
            <li><a href="/app/search.html" className="text-xs text-steel hover:text-primary transition">{t('nav.search')}</a></li>
            <li><a href="/app/map.html" className="text-xs text-steel hover:text-primary transition">{t('nav.map')}</a></li>
            <li><a href="/app/assistant.html" className="text-xs text-steel hover:text-primary transition">{t('nav.assistant')}</a></li>
            <li><a href="/app/graph.html" className="text-xs text-steel hover:text-primary transition">{t('nav.graph')}</a></li>
            <li><a href="/app/reports.html" className="text-xs text-steel hover:text-primary transition">{t('nav.reports')}</a></li>
          </ul>
        </div>

        {/* Links Column 3 */}
        <div>
          <span className="text-[10px] font-bold text-ink-deep uppercase tracking-wider block mb-3">{t('footer.platform')}</span>
          <ul className="space-y-2">
            <li><a href="/app/login.html" className="text-xs text-steel hover:text-primary transition">{t('footer.auth')}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t('footer.quickml')}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t('footer.zia')}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t('footer.smartbrowz')}</a></li>
          </ul>
        </div>

        {/* Links Column 4 */}
        <div>
          <span className="text-[10px] font-bold text-ink-deep uppercase tracking-wider block mb-3">{t('footer.support')}</span>
          <ul className="space-y-2">
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t('footer.helpdesk')}</a></li>
            <li><a href="/app/compliance.html" className="text-xs text-steel hover:text-primary transition">{t('footer.audit')}</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">{t('footer.feedback')}</a></li>
            <li><a href="/app/admin.html" className="text-xs text-steel hover:text-primary transition">{t('footer.admin')}</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="pt-6 border-t border-hairline-soft flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone">
        <div className="space-y-1">
          <p>© 2026 Karnataka State Police — Datathon 2026. All rights reserved.</p>
          <p className="text-[10px] text-steel">CONFIDENTIALITY NOTICE: This system contains sensitive law enforcement intelligence. Access is restricted to authorized personnel only. All queries are audited.</p>
        </div>
        <div className="flex items-center gap-4 shrink-0 font-medium">
          <a href="/app/privacy.html" className="hover:text-primary transition">{t('footer.privacy')}</a>
          <span>·</span>
          <a href="/app/terms.html" className="hover:text-primary transition">{t('footer.terms')}</a>
          <span>·</span>
          <a href="/app/disclaimer.html" className="hover:text-primary transition">{t('footer.disclaimer')}</a>
        </div>
      </div>
    </footer>
  );
}
