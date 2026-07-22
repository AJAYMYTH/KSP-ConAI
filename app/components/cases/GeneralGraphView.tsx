import React, { useState, useEffect } from 'react';
import CriminalNetworkGraph from './CriminalNetworkGraph';
import { MOCK_CASES } from '../../lib/mockData';
import { Network, Search, ChevronDown, X, Check } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { translateDistrict } from '../../i18n/utils';

export default function GeneralGraphView() {
  const { t, currentLanguage } = useI18n();
  const [selectedCaseId, setSelectedCaseId] = useState(MOCK_CASES[0].caseId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sync initial query with default case
  useEffect(() => {
    const defaultCase = MOCK_CASES.find(c => c.caseId === selectedCaseId);
    if (defaultCase) {
      setSearchQuery(`${defaultCase.firNumber} (${translateDistrict(defaultCase.district, currentLanguage)})`);
    }
  }, [selectedCaseId, currentLanguage]);

  // Filter cases matching the pasted/typed query
  const filteredCases = MOCK_CASES.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const currentCase = MOCK_CASES.find(sc => sc.caseId === selectedCaseId);
    if (currentCase && (searchQuery.includes(currentCase.firNumber) || searchQuery === `${currentCase.firNumber} (${translateDistrict(currentCase.district, currentLanguage)})`)) {
      return true;
    }
    const cleanQ = q.replace(/[^a-z0-9]/g, '');
    const cleanFir = c.firNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanId = c.caseId.toLowerCase().replace(/[^a-z0-9]/g, '');

    return (
      cleanFir.includes(cleanQ) ||
      cleanId.includes(cleanQ) ||
      c.district.toLowerCase().includes(q) ||
      c.station.toLowerCase().includes(q) ||
      c.crimeHead.toLowerCase().includes(q) ||
      c.accused.some(a => a.toLowerCase().includes(q))
    );
  });

  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    const selectedCase = MOCK_CASES.find(c => c.caseId === caseId);
    if (selectedCase) {
      setSearchQuery(`${selectedCase.firNumber} (${translateDistrict(selectedCase.district, currentLanguage)})`);
    }
    setIsDropdownOpen(false);
  };

  // Flexible FIR search matcher helper
  const findMatchingCase = (inputVal: string) => {
    const clean = inputVal.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!clean) return null;
    return MOCK_CASES.find(c => {
      const cleanFir = c.firNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanId = c.caseId.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanDist = c.district.toLowerCase();
      const cleanCrime = c.crimeHead.toLowerCase();
      return (
        cleanFir.includes(clean) ||
        clean.includes(cleanFir) ||
        cleanId.includes(clean) ||
        cleanDist.includes(inputVal.trim().toLowerCase()) ||
        cleanCrime.includes(inputVal.trim().toLowerCase()) ||
        c.accused.some(a => a.toLowerCase().includes(inputVal.trim().toLowerCase()))
      );
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsDropdownOpen(true);

    const match = findMatchingCase(value);
    if (match && value.trim().length >= 3) {
      setSelectedCaseId(match.caseId);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text').trim();
    setSearchQuery(pastedText);
    const match = findMatchingCase(pastedText);
    if (match) {
      setSelectedCaseId(match.caseId);
      setSearchQuery(`${match.firNumber} (${translateDistrict(match.district, currentLanguage)})`);
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

  return (
    <div className="p-3.5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 w-full max-w-none animate-in fade-in duration-200">
      {/* Header with Search Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-steel font-bold">{t('caseDetail.relationalIntel')}</span>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-ink-deep">{t('caseDetail.networkTitle')}</h1>
        </div>

        {/* FIR Search & Selection Input Bar */}
        <div className="relative w-[280px] sm:w-[340px] max-w-full">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone shrink-0 pointer-events-none" aria-hidden="true" />
            <input
              type="text"
              placeholder={currentLanguage === 'en' ? "Paste or search FIR number..." : "ಎಫ್‌ಐಆರ್ ಸಂಖ್ಯೆ ಹುಡುಕಿ..."}
              value={searchQuery}
              onChange={handleInputChange}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full pl-9 pr-14 py-2 bg-canvas border border-hairline hover:border-steel focus:border-primary focus:ring-1 focus:ring-primary rounded-full text-xs text-ink placeholder-stone h-10 transition-all outline-none font-semibold shadow-xs truncate"
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

          {/* Live Auto-Complete Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
              <ul
                role="listbox"
                className="absolute right-0 left-0 mt-1.5 max-h-64 overflow-y-auto bg-canvas border border-hairline-soft rounded-2xl shadow-xl py-1.5 z-50 text-xs font-medium text-ink divide-y divide-hairline-soft/60 animate-in fade-in slide-in-from-top-1 duration-100"
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
                        className={`px-4 py-2.5 hover:bg-surface-soft cursor-pointer transition-colors duration-150 flex items-center justify-between gap-2 ${
                          isSelected ? 'bg-primary/5 text-primary font-bold' : ''
                        }`}
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-ink-deep truncate">{c.firNumber} — {c.crimeHead}</span>
                          <span className="text-[10px] text-steel font-medium truncate">
                            {translateDistrict(c.district, currentLanguage)} • {c.station}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                      </li>
                    );
                  })
                )}
              </ul>
            </>
          )}
        </div>
      </div>

      {/* Graph Area */}
      <div className="bg-canvas border border-hairline-soft p-4 sm:p-5 rounded-2xl sm:rounded-[32px] card-product-shadow">
        <CriminalNetworkGraph caseId={selectedCaseId} key={selectedCaseId} />
      </div>
    </div>
  );
}
