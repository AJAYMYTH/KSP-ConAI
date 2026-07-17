import React, { useState } from 'react';
import NetworkGraph from './NetworkGraph';
import { MOCK_CASES } from '../../lib/mockData';
import { Network, Search, ChevronDown } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { translateDistrict } from '../../i18n/utils';

export default function GeneralGraphView() {
  const { t, currentLanguage } = useI18n();
  const [selectedCaseId, setSelectedCaseId] = useState(MOCK_CASES[0].caseId);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('caseDetail.relationalIntel')}</span>
          <h1 className="text-xl md:text-2xl font-bold text-ink-deep">{t('caseDetail.networkTitle')}</h1>
        </div>

        {/* Case selector custom dropdown */}
        <div className="flex items-center gap-2 relative">
          <Search className="w-4 h-4 text-stone" aria-hidden="true" />
          <div className="relative">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 py-1.5 bg-canvas border border-hairline hover:border-steel rounded-full text-xs text-ink text-left flex items-center justify-between gap-1.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary min-w-[200px]"
            >
              <span>
                {(() => {
                  const selectedCase = MOCK_CASES.find(c => c.caseId === selectedCaseId);
                  return selectedCase ? `${selectedCase.firNumber} (${translateDistrict(selectedCase.district, currentLanguage)})` : t('reports.selectTarget');
                })()}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-stone shrink-0 transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-45" onClick={() => setIsDropdownOpen(false)}></div>
                <ul
                  role="listbox"
                  className="absolute right-0 mt-1.5 min-w-[220px] max-h-60 overflow-y-auto bg-canvas border border-hairline-soft rounded-xl shadow-lg py-1 z-50 text-xs font-medium text-ink divide-y divide-hairline-soft animate-in fade-in slide-in-from-top-1 duration-100"
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
                      className={`px-4 py-2 hover:bg-surface-soft cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                        c.caseId === selectedCaseId ? 'bg-primary/5 text-primary font-bold' : ''
                      }`}
                    >
                      <span>{c.firNumber} ({translateDistrict(c.district, currentLanguage)})</span>
                      {c.caseId === selectedCaseId && <div className="w-1.5 h-1.5 rounded-circle bg-primary shrink-0" />}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Graph Area */}
      <div className="bg-canvas border border-hairline-soft p-5 rounded-[32px] card-product-shadow">
        <NetworkGraph caseId={selectedCaseId} key={selectedCaseId} />
      </div>
    </div>
  );
}
