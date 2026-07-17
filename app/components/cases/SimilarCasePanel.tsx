import React, { useState, useEffect } from 'react';
import { getSimilarCases } from '../../lib/api';
import type { SimilarCase } from '../../types';
import { Shield, Sparkles, FileText, ArrowRight, RefreshCw, AlertTriangle, Layers, Info } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';
import { translateDistrict, translateCategory, translateStatus } from '../../i18n/utils';

interface Props {
  caseId: string;
}

export default function SimilarCasePanel({ caseId }: Props) {
  const { currentLanguage } = useI18n();
  const [cases, setCases] = useState<SimilarCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchSimilar = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getSimilarCases(caseId);
      setCases(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimilar();
  }, [caseId]);

  // Method to highlight critical MO keywords in Amber/Gold
  const highlightMO = (text: string) => {
    const keywords = [
      'MO', 'modus operandi', 'window', 'grill', 'pulsar', 'motorcycle', 
      'family away', 'Karthik', 'Poochi', 'chain', 'snatching', 'night',
      'ಕಾರ್ತಿಕ್', 'ಪೂಚಿ', 'ದರೋಡೆ'
    ];
    
    let highlighted = text;
    keywords.forEach(kw => {
      const regex = new RegExp(`(${kw})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark class="bg-attention/20 text-attention font-semibold px-0.5 rounded">$1</mark>');
    });
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  if (loading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-circle border-4 border-hairline-soft border-t-primary animate-spin" />
        <span className="text-xs text-steel font-bold">
          {currentLanguage === 'en' ? 'Scanning database patterns...' : 'ಡೇಟಾಬೇಸ್ ಮಾದರಿಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...'}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center flex flex-col items-center gap-2">
        <AlertTriangle className="w-8 h-8 text-critical" />
        <span className="text-xs text-critical font-bold">
          {currentLanguage === 'en' ? 'Failed to scan similar cases.' : 'ಸಮಾನ ಪ್ರಕರಣಗಳನ್ನು ಲೋಡ್ ಮಾಡಲು ವಿಫಲವಾಗಿದೆ.'}
        </span>
        <button onClick={fetchSimilar} className="mt-2 text-xs font-bold text-primary hover:underline flex items-center gap-1">
          <RefreshCw className="w-3.5 h-3.5" /> {currentLanguage === 'en' ? 'Retry' : 'ಮರುಪ್ರಯತ್ನಿಸಿ'}
        </button>
      </div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-steel font-bold bg-surface-soft/40 border border-hairline-soft rounded-2xl flex flex-col items-center justify-center gap-2">
        <Info className="w-5 h-5 text-stone" />
        {currentLanguage === 'en' ? 'No intelligence cross-references mapped for this case.' : 'ಈ ಪ್ರಕರಣಕ್ಕೆ ಯಾವುದೇ ಕ್ರಾಸ್-ರೆಫರೆನ್ಸ್ ಇಲ್ಲ.'}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Informative Banner */}
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-ink-deep">
            {currentLanguage === 'en' ? 'Pattern Match Recommendations' : 'ಮಾದರಿ ಹೊಂದಾಣಿಕೆಯ ಶಿಫಾರಸುಗಳು'}
          </h4>
          <p className="text-[10px] text-steel leading-relaxed">
            {currentLanguage === 'en' 
              ? 'The Copilot automatically extracts Modus Operandi (MO) tokens and suspect links to match database incident archives. Target cases below share a high statistical alignment.'
              : 'ಅಪರಾಧದ ನಡವಳಿಕೆ (MO) ಮತ್ತು ಶಂಕಿತರ ಕೊಂಡಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ ಸಮಾನ ಪ್ರಕರಣಗಳನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ.'}
          </p>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cases.map((c) => {
          const isHighMatch = c.similarityScore >= 90;

          return (
            <div 
              key={c.caseId}
              className="bg-canvas border border-hairline-soft hover:border-hairline hover:shadow-sm p-5 rounded-xxxl transition duration-150 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Row */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase tracking-wider text-stone font-bold">
                      {translateDistrict(c.district, currentLanguage)}
                    </span>
                    <h4 className="text-xs font-bold text-ink-deep">{c.firNumber}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isHighMatch 
                      ? 'bg-success/10 text-success border-success/20' 
                      : 'bg-attention/10 text-attention border-attention/20'
                  }`}>
                    {c.similarityScore}% {currentLanguage === 'en' ? 'Match' : 'ಹೊಂದಾಣಿಕೆ'}
                  </span>
                </div>

                {/* Info Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[9px] font-medium px-2 py-0.5 bg-surface-soft border border-hairline-soft rounded text-stone">
                    {translateCategory(c.category, currentLanguage)}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                    c.status === 'Disposed' ? 'bg-success/5 text-success border-success/10' : 'bg-attention/5 text-attention border-attention/10'
                  }`}>
                    {translateStatus(c.status, currentLanguage)}
                  </span>
                </div>

                {/* Match Reason (Highlights MO) */}
                <div className="bg-surface-soft/40 border border-hairline-soft/80 p-3 rounded-xl space-y-1">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-stone block">
                    {currentLanguage === 'en' ? 'Modus Operandi Alignment' : 'ಅಪರಾಧ ನಡವಳಿಕೆಯ ಸಾಮ್ಯತೆ'}
                  </span>
                  <p className="text-[11px] leading-relaxed text-ink">
                    {highlightMO(c.matchReason)}
                  </p>
                </div>
              </div>

              {/* Action Trigger */}
              <a
                href={`/cases/${c.caseId}`}
                className="mt-4 w-full py-2 bg-canvas hover:bg-surface-soft border border-hairline-soft text-ink hover:text-ink-deep text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
              >
                {currentLanguage === 'en' ? 'Cross-Reference File' : 'ಕ್ರಾಸ್-ರೆಫರೆನ್ಸ್ ಫೈಲ್'} 
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
