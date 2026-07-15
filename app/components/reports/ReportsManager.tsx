import React, { useState, useEffect } from 'react';
import { generateReport } from '../../lib/api';
import type { CaseDetail } from '../../types';
import { MOCK_CASES } from '../../lib/mockData';
import { FileText, Calendar, Download, ShieldCheck, Loader2, Check, ChevronDown } from 'lucide-react';

const TRANSLATIONS = {
  EN: {
    pdfEngine: "SmartBrowz PDF Engine",
    pageTitle: "Case Intelligence Reports",
    newDoc: "New Document",
    draftBrief: "Draft Case Brief",
    selectTarget: "Select Target Case",
    compileBtn: "Compile Report",
    draftingBtn: "Drafting PDF…",
    vaultTitle: "Generated Vault",
    vaultHistory: "Report Logs History",
    downloadBtn: "Download",
    generatedBy: "By:"
  },
  KN: {
    pdfEngine: "ಸ್ಮಾರ್ಟ್ ಬ್ರೌಸ್ ಪಿಡಿಎಫ್ ಎಂಜಿನ್",
    pageTitle: "ಪ್ರಕರಣದ ಗುಪ್ತಚರ ವರದಿಗಳು",
    newDoc: "ಹೊಸ ದಾಖಲೆ",
    draftBrief: "ಕರಡು ಪ್ರಕರಣದ ಮಾಹಿತಿ",
    selectTarget: "ಗುರಿ ಪ್ರಕರಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    compileBtn: "ವರದಿ ಕ್ರೋಢೀಕರಿಸಿ",
    draftingBtn: "ಪಿಡಿಎಫ್ ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ...",
    vaultTitle: "ರಚಿಸಲಾದ ದಾಖಲೆಗಳು",
    vaultHistory: "ವರದಿ ಲಾಗ್‌ಗಳ ಇತಿಹಾಸ",
    downloadBtn: "ಡೌನ್‌ಲೋಡ್",
    generatedBy: "ರಚಿಸಿದವರು:"
  }
};

const translateCrimeHead = (head: string, lang: 'EN' | 'KN') => {
  if (lang === 'EN') return head;
  const mapping: Record<string, string> = {
    'House Breaking by Night': 'ರಾತ್ರಿ ಮನೆ ಕನ್ನಗಳ್ಳತನ',
    'Highway Robbery': 'ಹೆದ್ದಾರಿ ದರೋಡೆ',
    'Corporate Bank Fraud': 'ಕಾರ್ಪೊರೇಟ್ ಬ್ಯಾಂಕ್ ವಂಚನೆ',
    'Domestic Violence': 'ಕೌಟುಂಬಿಕ ಹಿಂಸಾಚಾರ',
    'Commercial Theft': 'ವಾಣಿಜ್ಯ ಕಳ್ಳತನ'
  };
  return mapping[head] || head;
};

interface ReportHistoryItem {
  id: string;
  firNumber: string;
  caseId: string;
  dateGenerated: string;
  generatedBy: string;
  pdfUrl: string;
}

export default function ReportsManager() {
  const [selectedCaseId, setSelectedCaseId] = useState(MOCK_CASES[0].caseId);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'KN'>('EN');

  useEffect(() => {
    const saved = localStorage.getItem('ksp_language') as 'EN' | 'KN';
    if (saved === 'EN' || saved === 'KN') {
      setLanguage(saved);
    }

    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<'EN' | 'KN'>;
      setLanguage(customEvent.detail);
    };

    window.addEventListener('ksp-language-change', handleLangChange);
    return () => {
      window.removeEventListener('ksp-language-change', handleLangChange);
    };
  }, []);
  const [history, setHistory] = useState<ReportHistoryItem[]>([
    {
      id: 'REP-001',
      firNumber: 'FIR-0124/2026',
      caseId: 'KA-MY-2026-00124',
      dateGenerated: '2026-07-05T14:30:00Z',
      generatedBy: 'Mahesh Kumar (IO)',
      pdfUrl: '/reports/pdf_mock_KA-MY-2026-00124.pdf'
    },
    {
      id: 'REP-002',
      firNumber: 'FIR-0055/2026',
      caseId: 'KA-KA-2026-00055',
      dateGenerated: '2026-07-10T11:15:00Z',
      generatedBy: 'Shri B. Dayananda, IPS',
      pdfUrl: '/reports/pdf_mock_KA-KA-2026-00055.pdf'
    }
  ]);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const matchCase = MOCK_CASES.find(c => c.caseId === selectedCaseId);
      if (!matchCase) return;

      const result = await generateReport(selectedCaseId);

      const newItem: ReportHistoryItem = {
        id: `REP-${Math.floor(Math.random() * 900 + 100)}`,
        firNumber: matchCase.firNumber,
        caseId: selectedCaseId,
        dateGenerated: new Date().toISOString(),
        generatedBy: 'Mahesh Kumar (IO)',
        pdfUrl: result.pdfUrl
      };

      setHistory(prev => [newItem, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const t = TRANSLATIONS[language];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t.pdfEngine}</span>
        <h1 className="text-xl md:text-2xl font-bold text-ink-deep">{t.pageTitle}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Generator Controls */}
        <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-5">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-primary font-bold">{t.newDoc}</span>
            <h3 className="text-sm font-bold text-ink-deep border-b border-hairline-soft pb-1.5">
              {t.draftBrief}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor="case-select-report" className="text-[10px] font-bold text-steel uppercase">{t.selectTarget}</label>
              
              <div className="relative">
                <button
                  id="case-select-report"
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isDropdownOpen}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-3.5 py-2 bg-canvas border border-hairline hover:border-steel rounded-lg text-xs text-ink text-left flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span>
                    {(() => {
                      const selectedCase = MOCK_CASES.find(c => c.caseId === selectedCaseId);
                      return selectedCase ? `${selectedCase.firNumber} - ${translateCrimeHead(selectedCase.crimeHead, language)}` : "Select a case";
                    })()}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone shrink-0 transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                    <ul
                      role="listbox"
                      className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-canvas border border-hairline-soft rounded-lg shadow-lg py-1 z-50 text-xs font-medium text-ink divide-y divide-hairline-soft animate-in fade-in slide-in-from-top-1 duration-100"
                    >
                      {MOCK_CASES.map(c => (
                        <li
                          key={c.caseId}
                          role="option"
                          aria-selected={c.caseId === selectedCaseId}
                          onClick={() => {
                            setSelectedCaseId(c.caseId);
                            setIsDropdownOpen(false);
                          }}
                          className={`px-3.5 py-2 hover:bg-surface-soft cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                            c.caseId === selectedCaseId ? 'bg-primary/5 text-primary font-bold' : ''
                          }`}
                        >
                          <span>{c.firNumber} - {translateCrimeHead(c.crimeHead, language)}</span>
                          {c.caseId === selectedCaseId && <div className="w-1.5 h-1.5 rounded-circle bg-primary shrink-0" />}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-2.5 bg-primary text-canvas rounded-full text-xs font-bold hover:bg-primary-deep disabled:bg-primary-deep/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {generating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> {t.draftingBtn}
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" /> {t.compileBtn}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Reports History Log */}
        <div className="lg:col-span-2 bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t.vaultTitle}</span>
            <h3 className="text-sm font-bold text-ink-deep border-b border-hairline-soft pb-1.5">
              {t.vaultHistory}
            </h3>
          </div>

          <div className="space-y-3">
            {history.map((item) => (
              <div key={item.id} className="p-4 bg-surface-soft/60 border border-hairline-soft rounded-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink-deep">{item.firNumber}</span>
                    <span className="text-[9px] text-stone font-medium">| {item.id}</span>
                  </div>
                  <div className="text-[10px] text-steel font-medium flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone" aria-hidden="true" /> {new Date(item.dateGenerated).toLocaleString()}
                    </span>
                    <span>{t.generatedBy} {item.generatedBy}</span>
                  </div>
                </div>

                <a
                  href={item.pdfUrl}
                  download
                  className="flex items-center gap-1 px-3 py-1.5 bg-ink-deep text-canvas rounded-full text-[10px] font-bold hover:bg-charcoal focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition cursor-pointer"
                >
                  <Download className="w-3 h-3" aria-hidden="true" /> {t.downloadBtn}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
