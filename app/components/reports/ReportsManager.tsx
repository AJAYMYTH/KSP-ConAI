import React, { useState, useEffect } from 'react';
import { generateReport } from '../../lib/api';
import type { CaseDetail } from '../../types';
import { MOCK_CASES } from '../../lib/mockData';
import { FileText, Calendar, Download, ShieldCheck, Loader2, Check, ChevronDown, Search, X } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { translateCrimeHead, translateDistrict } from '../../i18n/utils';

interface ReportHistoryItem {
  id: string;
  firNumber: string;
  caseId: string;
  dateGenerated: string;
  generatedBy: string;
  pdfUrl: string;
}

export default function ReportsManager() {
  const { t, currentLanguage } = useI18n();
  const [selectedCaseId, setSelectedCaseId] = useState(MOCK_CASES[0].caseId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  // Sync searchQuery when selectedCaseId or language changes
  useEffect(() => {
    const selectedCase = MOCK_CASES.find(c => c.caseId === selectedCaseId);
    if (selectedCase) {
      setSearchQuery(`${selectedCase.firNumber} - ${translateCrimeHead(selectedCase.crimeHead, currentLanguage)}`);
    }
  }, [selectedCaseId, currentLanguage]);

  // Filter cases matching user query
  const filteredCases = MOCK_CASES.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.firNumber.toLowerCase().includes(q) ||
      c.caseId.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.crimeHead.toLowerCase().includes(q)
    );
  });

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    const selectedCase = MOCK_CASES.find(c => c.caseId === caseId);
    if (selectedCase) {
      setSearchQuery(`${selectedCase.firNumber} - ${translateCrimeHead(selectedCase.crimeHead, currentLanguage)}`);
    }
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsDropdownOpen(true);

    const exactMatch = MOCK_CASES.find(
      c => c.firNumber.toLowerCase() === value.trim().toLowerCase() ||
           c.caseId.toLowerCase() === value.trim().toLowerCase()
    );
    if (exactMatch) {
      setSelectedCaseId(exactMatch.caseId);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text').trim();
    const exactMatch = MOCK_CASES.find(
      c => c.firNumber.toLowerCase().includes(pastedText.toLowerCase()) ||
           c.caseId.toLowerCase().includes(pastedText.toLowerCase())
    );
    if (exactMatch) {
      setSelectedCaseId(exactMatch.caseId);
      setSearchQuery(`${exactMatch.firNumber} - ${translateCrimeHead(exactMatch.crimeHead, currentLanguage)}`);
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCases.length > 0) {
        handleSelectCase(filteredCases[0].caseId);
      }
    }
  };

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

  return (
    <div className="p-3.5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 w-full max-w-none animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-steel font-bold">{t('reports.pdfEngine')}</span>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-ink-deep">{t('reports.title')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">
        {/* Report Generator Controls */}
        <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-5">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-primary font-bold">{t('reports.newDoc')}</span>
            <h3 className="text-sm font-bold text-ink-deep border-b border-hairline-soft pb-1.5">
              {t('reports.draftBrief')}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor="case-select-report" className="text-[10px] font-bold text-steel uppercase">{t('reports.selectTarget')}</label>
              
              {/* Interactive Search & Paste Input */}
              <div className="relative w-full">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone shrink-0 pointer-events-none" aria-hidden="true" />
                  <input
                    id="case-select-report"
                    type="text"
                    placeholder={currentLanguage === 'en' ? "Paste or search FIR number..." : "ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ ಹುಡುಕಿ..."}
                    value={searchQuery}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full pl-9 pr-14 py-2 bg-canvas border border-hairline hover:border-steel focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-xs text-ink placeholder-stone h-10 transition-all outline-none font-semibold shadow-xs truncate"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-canvas pl-1">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setIsDropdownOpen(true);
                        }}
                        className="p-1 text-stone hover:text-ink transition rounded-full cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="p-1 text-stone hover:text-ink transition cursor-pointer"
                      title="Toggle options list"
                    >
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                    <ul
                      role="listbox"
                      className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-canvas border border-hairline-soft rounded-lg shadow-lg py-1 z-50 text-xs font-medium text-ink divide-y divide-hairline-soft animate-in fade-in slide-in-from-top-1 duration-100"
                    >
                      {filteredCases.length === 0 ? (
                        <li className="px-4 py-3 text-stone text-center text-xs font-medium">
                          {currentLanguage === 'en' ? 'No matching FIR found. Try pasting exact FIR number (e.g. FIR-0812/2026).' : 'ಯಾವುದೇ ಎಫ್‌ಐಆರ್ ದಾಖಲೆ ಕಂಡುಬಂದಿಲ್ಲ.'}
                        </li>
                      ) : (
                        filteredCases.map(c => {
                          const isSelected = c.caseId === selectedCaseId;
                          return (
                            <li
                              key={c.caseId}
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => handleSelectCase(c.caseId)}
                              className={`px-3.5 py-2 hover:bg-surface-soft cursor-pointer transition-colors duration-150 flex items-center justify-between gap-2 ${
                                isSelected ? 'bg-primary/5 text-primary font-bold' : ''
                              }`}
                            >
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-ink-deep truncate">{c.firNumber} — {translateCrimeHead(c.crimeHead, currentLanguage)}</span>
                                <span className="text-[10px] text-steel font-medium truncate">{translateDistrict(c.district, currentLanguage)} • {c.station}</span>
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                            </li>
                          );
                        })
                      )}
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
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> {t('reports.draftingBtn')}
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" /> {t('reports.compileBtn')}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Generated Reports History Log */}
        <div className="lg:col-span-2 bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('reports.vaultTitle')}</span>
            <h3 className="text-sm font-bold text-ink-deep border-b border-hairline-soft pb-1.5">
              {t('reports.vaultHistory')}
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
                    <span>{t('reports.generatedBy')} {item.generatedBy}</span>
                  </div>
                </div>

                <a
                  href={item.pdfUrl}
                  download
                  className="flex items-center gap-1 px-3 py-1.5 bg-ink-deep text-canvas rounded-full text-[10px] font-bold hover:bg-charcoal focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition cursor-pointer"
                >
                  <Download className="w-3 h-3" aria-hidden="true" /> {t('reports.downloadBtn')}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
