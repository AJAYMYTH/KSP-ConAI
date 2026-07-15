import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
            An advanced, retrieval-grounded crime intelligence workspace built for Karnataka State Police investigators and analysts.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">
            Resources
          </span>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">Crime Head Lookup</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">Act & Section Catalog</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">Standard Operating Proc.</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">FAQ</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">
            Tools
          </span>
          <ul className="flex flex-col gap-2">
            <li><a href="/dashboard" className="text-xs text-steel hover:text-primary transition">Analytics Dashboard</a></li>
            <li><a href="/search" className="text-xs text-steel hover:text-primary transition">FIR Database</a></li>
            <li><a href="/map" className="text-xs text-steel hover:text-primary transition">Hotspot Mapping</a></li>
            <li><a href="/assistant" className="text-xs text-steel hover:text-primary transition">AI Assistant</a></li>
          </ul>
        </div>

        {/* Links Column 3 */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">
            Catalyst Services
          </span>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">Authentication</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">QuickML</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">Zia Engine</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">SmartBrowz PDF</a></li>
          </ul>
        </div>

        {/* Links Column 4 */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-bold text-ink uppercase tracking-wider">
            Support
          </span>
          <ul className="flex flex-col gap-2">
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">Technical Helpdesk</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">Audit Log Requests</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">Feedback Form</a></li>
            <li><a href="#" className="text-xs text-steel hover:text-primary transition">Admin Console</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="max-w-7xl mx-auto border-t border-hairline-soft mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-stone">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span>
            © {currentYear} Karnataka State Police — Datathon 2026. All rights reserved.
          </span>
          <span className="text-[9px] text-stone/80">
            CONFIDENTIALITY NOTICE: This system contains sensitive law enforcement intelligence. Access is restricted to authorized personnel only. All queries are audited.
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-primary transition">Privacy Policy</a>
          <span>·</span>
          <a href="/terms" className="hover:text-primary transition">Terms of Service</a>
          <span>·</span>
          <a href="/disclaimer" className="hover:text-primary transition">Usage Disclaimer</a>
        </div>
      </div>
    </footer>
  );
}
