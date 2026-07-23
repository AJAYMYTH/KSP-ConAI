import React, { useState, useEffect } from 'react';
import { searchCases } from '../../lib/api';
import type { CaseSummary } from '../../types';
import { Search, MapPin, Calendar, ArrowRight, SlidersHorizontal, Download, ChevronDown } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { 
  translateDistrict, 
  translateCategory, 
  translateCrimeHead, 
  translateStatus 
} from '../../i18n/utils';

export default function SearchInterface() {
  const { t, currentLanguage } = useI18n();
  const [query, setQuery] = useState('');
  const [district, setDistrict] = useState('all');
  const [category, setCategory] = useState('all');
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchResults();
    }, 200);
    return () => clearTimeout(timer);
  }, [query, page, district, category]);

  const fetchResults = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const result = await searchCases({
        query,
        district,
        category,
        page: page.toString(),
        limit: '10'
      });
      setCases(result.items);
      setTotal(result.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuery('');
    setDistrict('all');
    setCategory('all');
    setPage(1);
  };

  const exportCSV = () => {
    const headers = ['Case ID', 'FIR Number', 'District', 'Station', 'Registered Date', 'Category', 'Status', 'Crime Head'];
    const rows = cases.map(c => [c.caseId, c.firNumber, c.district, c.station, c.registeredDate, c.category, c.status, c.crimeHead]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `KSP_FIR_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3.5 sm:p-6 md:p-8 space-y-4 sm:space-y-6 w-full max-w-none animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-steel font-bold">
            {currentLanguage === 'en' ? 'Investigative Database' : 'ತನಿಖಾ ಡೇಟಾಬೇಸ್'}
          </span>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-ink-deep">{t('search.title')}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-canvas border border-hairline-soft focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-full text-[11px] sm:text-xs font-bold text-ink hover:bg-surface-soft cursor-pointer transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" /> 
            {currentLanguage === 'en' ? 'Export Data (CSV)' : 'ಸಿಎಸ್‌ವಿ ರಫ್ತು ಮಾಡಿ'}
          </button>
        </div>
      </div>

      {/* Search and Filters Panel */}
      <form onSubmit={fetchResults} className="bg-canvas border border-hairline-soft p-3.5 sm:p-5 rounded-2xl sm:rounded-xxxl card-product-shadow space-y-4">
        <div className="flex gap-2 sm:gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" aria-hidden="true" />
            <input
              type="text"
              name="query"
              autoComplete="off"
              aria-label="Search FIR by keywords"
              placeholder={t('search.searchPlaceholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-surface-soft border border-hairline-soft focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-full text-xs sm:text-sm text-ink placeholder-stone focus:outline-none focus:border-fb-blue focus:ring-1 focus:ring-fb-blue transition h-10 sm:h-11"
            />
          </div>
          <button 
            type="submit"
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-ink-button text-on-ink-button rounded-full text-xs sm:text-sm font-bold hover:bg-charcoal transition cursor-pointer"
          >
            {currentLanguage === 'en' ? 'Search' : 'ಹುಡುಕಿ'}
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-circle border border-hairline-soft flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer transition ${
              showFilters ? 'bg-ink-deep text-canvas' : 'bg-canvas hover:bg-surface-soft text-ink'
            }`}
            aria-label="Toggle advanced filters"
          >
            <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Collapsible Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-hairline-soft animate-in slide-in-from-top-2 duration-150">
            {/* District Filter */}
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor="district-select" className="text-[10px] font-bold text-steel uppercase">{t('search.district')}</label>
              <div className="relative">
                <button
                  id="district-select"
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isDistrictOpen}
                  onClick={() => { setIsDistrictOpen(!isDistrictOpen); setIsCategoryOpen(false); }}
                  className="w-full px-3.5 py-2 bg-canvas border border-hairline hover:border-steel rounded-lg text-xs text-ink text-left flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span>
                    {translateDistrict(district, currentLanguage)}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone shrink-0 transition-transform duration-200" style={{ transform: isDistrictOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {isDistrictOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDistrictOpen(false)}></div>
                    <ul
                      role="listbox"
                      className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-canvas border border-hairline-soft rounded-lg shadow-lg py-1 z-50 text-xs font-medium text-ink divide-y divide-hairline-soft animate-in fade-in slide-in-from-top-1 duration-100"
                    >
                      {[
                        { val: 'all', label: translateDistrict('all', currentLanguage) },
                        { val: 'Bengaluru City', label: translateDistrict('Bengaluru City', currentLanguage) },
                        { val: 'Mysuru City', label: translateDistrict('Mysuru City', currentLanguage) },
                        { val: 'Mangaluru City', label: translateDistrict('Mangaluru City', currentLanguage) },
                        { val: 'Belagavi', label: translateDistrict('Belagavi', currentLanguage) },
                        { val: 'Kalaburagi', label: translateDistrict('Kalaburagi', currentLanguage) }
                      ].map(item => (
                        <li
                          key={item.val}
                          role="option"
                          aria-selected={item.val === district}
                          onClick={() => {
                            setDistrict(item.val);
                            setPage(1);
                            setIsDistrictOpen(false);
                          }}
                          className={`px-3.5 py-2 hover:bg-surface-soft cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                            item.val === district ? 'bg-primary/5 text-primary font-bold' : ''
                          }`}
                        >
                          <span>{item.label}</span>
                          {item.val === district && <div className="w-1.5 h-1.5 rounded-circle bg-primary shrink-0" />}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor="category-select" className="text-[10px] font-bold text-steel uppercase">{t('search.category')}</label>
              <div className="relative">
                <button
                  id="category-select"
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isCategoryOpen}
                  onClick={() => { setIsCategoryOpen(!isCategoryOpen); setIsDistrictOpen(false); }}
                  className="w-full px-3.5 py-2 bg-canvas border border-hairline hover:border-steel rounded-lg text-xs text-ink text-left flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span>
                    {translateCategory(category, currentLanguage)}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone shrink-0 transition-transform duration-200" style={{ transform: isCategoryOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {isCategoryOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsCategoryOpen(false)}></div>
                    <ul
                      role="listbox"
                      className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-canvas border border-hairline-soft rounded-lg shadow-lg py-1 z-50 text-xs font-medium text-ink divide-y divide-hairline-soft animate-in fade-in slide-in-from-top-1 duration-100"
                    >
                      {[
                        { val: 'all', label: translateCategory('all', currentLanguage) },
                        { val: 'Theft / Burglary', label: translateCategory('Theft / Burglary', currentLanguage) },
                        { val: 'Robbery', label: translateCategory('Robbery', currentLanguage) },
                        { val: 'Cheating / Fraud', label: translateCategory('Cheating / Fraud', currentLanguage) },
                        { val: 'Assault', label: translateCategory('Assault', currentLanguage) }
                      ].map(item => (
                        <li
                          key={item.val}
                          role="option"
                          aria-selected={item.val === category}
                          onClick={() => {
                            setCategory(item.val);
                            setPage(1);
                            setIsCategoryOpen(false);
                          }}
                          className={`px-3.5 py-2 hover:bg-surface-soft cursor-pointer transition-colors duration-150 flex items-center justify-between ${
                            item.val === category ? 'bg-primary/5 text-primary font-bold' : ''
                          }`}
                        >
                          <span>{item.label}</span>
                          {item.val === category && <div className="w-1.5 h-1.5 rounded-circle bg-primary shrink-0" />}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>

            {/* Reset Button Column */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2 bg-surface-soft hover:bg-hairline text-ink text-xs font-bold rounded-lg transition cursor-pointer"
              >
                {currentLanguage === 'en' ? 'Reset Filters' : 'ಫಿಲ್ಟರ್ ಮರುಹೊಂದಿಸಿ'}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Results Section */}
      <div className="bg-canvas border border-hairline-soft rounded-xxxl card-product-shadow p-6 space-y-4" aria-live="polite">
        {loading ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-canvas border border-hairline-soft gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-28 animate-shimmer rounded"></div>
                    <div className="h-3.5 w-16 animate-shimmer rounded"></div>
                    <div className="h-4 w-12 animate-shimmer rounded-full"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-3 w-32 animate-shimmer rounded"></div>
                    <div className="h-3 w-36 animate-shimmer rounded"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-5">
                  <div className="space-y-1.5 text-right">
                    <div className="h-3.5 w-24 animate-shimmer rounded ml-auto"></div>
                    <div className="h-3 w-16 animate-shimmer rounded ml-auto"></div>
                  </div>
                  <div className="h-8 w-24 animate-shimmer rounded-full shrink-0"></div>
                </div>
              </div>
            ))}
          </div>
        ) : cases.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center gap-3 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-circle bg-surface-soft flex items-center justify-center text-stone">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-ink-deep">
              {currentLanguage === 'en' ? 'No FIR Records Found' : 'ಯಾವುದೇ ಎಫ್‌ಐಆರ್ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ'}
            </h3>
            <p className="text-xs text-steel max-w-xs">
              {currentLanguage === 'en' 
                ? 'No records matched your query. Try broadening your keyword search or resetting active filters.' 
                : 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಹೊಂದಾಣಿಕೆ ಇಲ್ಲ. ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಕೀವರ್ಡ್ ಬದಲಾಯಿಸಿ ಅಥವಾ ಫಿಲ್ಟರ್ ಮರುಹೊಂದಿಸಿ.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {cases.map((c) => (
              <div
                key={c.caseId}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-canvas border border-hairline-soft hover:border-hairline hover:bg-surface-soft/40 transition duration-150 gap-4"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-ink-deep">{c.firNumber}</span>
                    <span className="text-[10px] text-stone font-medium">| {c.caseId}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      c.status === 'Disposed' ? 'bg-success/15 text-success' : 'bg-attention/15 text-attention'
                    }`}>
                      {translateStatus(c.status, currentLanguage)}
                    </span>
                  </div>
                  <div className="text-[10px] text-steel flex flex-wrap items-center gap-3 gap-y-1">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-stone" aria-hidden="true" /> {c.station}, {translateDistrict(c.district, currentLanguage)}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-stone" aria-hidden="true" /> {currentLanguage === 'en' ? 'Incident:' : 'ಪ್ರಕರಣ ಸಂಭವಿಸಿದ ದಿನಾಂಕ:'} {new Date(c.incidentDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5">
                  <div className="text-right">
                    <div className="text-xs font-bold text-ink-deep">{translateCrimeHead(c.crimeHead, currentLanguage)}</div>
                    <div className="text-[10px] text-stone font-medium">{translateCategory(c.category, currentLanguage)}</div>
                  </div>
                  <a
                    href={`/app/cases/detail.html?id=${encodeURIComponent(c.caseId)}`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary text-canvas rounded-full text-xs font-bold hover:bg-primary-deep focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition cursor-pointer"
                  >
                    {currentLanguage === 'en' ? 'View File' : 'ಪ್ರಕರಣ ವೀಕ್ಷಿಸಿ'} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {total > 10 && (
          <div className="flex items-center justify-between border-t border-hairline-soft pt-4 mt-2">
            <span className="text-[10px] text-stone font-bold">
              {currentLanguage === 'en' 
                ? `Showing ${cases.length} of ${total} Records`
                : `ಒಟ್ಟು ${total} ದಾಖಲೆಗಳಲ್ಲಿ ${cases.length} ತೋರಿಸಲಾಗುತ್ತಿದೆ`}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 bg-canvas border border-hairline-soft hover:bg-surface-soft rounded-lg text-xs font-bold text-ink disabled:opacity-40 transition cursor-pointer"
              >
                {t('search.prev')}
              </button>
              <button
                disabled={page * 10 >= total}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 bg-canvas border border-hairline-soft hover:bg-surface-soft rounded-lg text-xs font-bold text-ink disabled:opacity-40 transition cursor-pointer"
              >
                {t('search.next')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
