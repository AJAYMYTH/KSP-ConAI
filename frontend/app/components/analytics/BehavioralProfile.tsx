import React, { useState, useEffect } from 'react';
import { 
  Search, ShieldAlert, User, Shield, 
  MapPin, Clock, Eye, AlertTriangle, RefreshCw 
} from 'lucide-react';
import { getOffenderProfiles, type OffenderProfile } from '../../lib/api';
import { useI18n } from '../../i18n/hooks';

export default function BehavioralProfile() {
  const { currentLanguage } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [offenders, setOffenders] = useState<OffenderProfile[]>([]);
  const [selectedOffender, setSelectedOffender] = useState<OffenderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffenders = async (query: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const result = await getOffenderProfiles(query);
      setOffenders(result);
      if (result.length > 0 && !selectedOffender) {
        setSelectedOffender(result[0]);
      } else if (result.length > 0) {
        // Keep active selection if it still matches
        const currentMatch = result.find(o => o.id === selectedOffender?.id);
        setSelectedOffender(currentMatch || result[0]);
      } else {
        setSelectedOffender(null);
      }
    } catch (err) {
      setError('Failed to load offender database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffenders(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOffenders(searchQuery);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-hairline-soft pb-5">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-steel font-bold">
            {currentLanguage === 'en' ? 'Intelligence Database' : 'ಇಂಟೆಲಿಜೆನ್ಸ್ ಡೇಟಾಬೇಸ್'}
          </span>
          <h2 className="text-base font-bold text-ink-deep">
            {currentLanguage === 'en' ? 'Behavioral Profiling & Recidivism Registry' : 'ವರ್ತನೆಯ ಪ್ರೊಫೈಲಿಂಗ್ ಮತ್ತು ಪುನರಾವರ್ತಿತ ಅಪರಾಧಿಗಳ ನೋಂದಣಿ'}
          </h2>
          <p className="text-xs text-slate-500">
            {currentLanguage === 'en' 
              ? 'Track repeat offender recidivism indices, MO pattern histories, and suspect-associate clusters.' 
              : 'ಪುನರಾವರ್ತಿತ ಅಪರಾಧಿಗಳ ನಡವಳಿಕೆ ಮಾದರಿ, ಸಹಚರರ ಜಾಲ ಮತ್ತು ಐತಿಹಾಸಿಕ ಪ್ರಕರಣಗಳ ವಿವರ.'}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Side: Offender List & Search */}
        <div className="lg:col-span-1 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder={currentLanguage === 'en' ? 'Search aliases/names...' : 'ಹೆಸರು/ಅಡ್ಡಹೆಸರು ಹುಡುಕಿ...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-hairline-soft bg-canvas rounded-xl text-xs font-medium text-ink-deep placeholder-stone focus:outline-none focus:border-primary shadow-xs"
            />
            <Search className="w-4 h-4 text-stone absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 w-full animate-shimmer rounded-xl border border-hairline-soft bg-canvas"></div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 text-center border border-hairline-soft rounded-xl text-xs text-steel font-bold bg-canvas">
              {currentLanguage === 'en' ? 'Database connection failure.' : 'ಡೇಟಾಬೇಸ್ ಸಂಪರ್ಕ ವಿಫಲವಾಗಿದೆ.'}
            </div>
          ) : offenders.length === 0 ? (
            <div className="p-6 text-center border border-hairline-soft rounded-xl text-xs text-stone font-bold bg-canvas">
              {currentLanguage === 'en' ? 'No history-sheeters found.' : 'ಯಾವುದೇ ಅಪರಾಧಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.'}
            </div>
          ) : (
            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
              {offenders.map((offender) => (
                <button
                  key={offender.id}
                  onClick={() => setSelectedOffender(offender)}
                  className={`w-full text-left p-3 border rounded-xl flex items-center justify-between transition cursor-pointer select-none outline-none ${
                    selectedOffender?.id === offender.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-hairline-soft bg-canvas hover:bg-surface-soft/40 text-ink-deep'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold truncate">{offender.name}</h4>
                    <span className="text-[9px] text-stone font-semibold truncate block">
                      {currentLanguage === 'en' ? 'Alias:' : 'ಅಡ್ಡಹೆಸರು:'} {offender.aliases.join(', ')}
                    </span>
                  </div>
                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border shrink-0 ml-2 ${
                    offender.status === 'in_custody' ? 'bg-success/15 text-success border-success/30' : 'bg-critical/15 text-critical border-critical/30'
                  }`}>
                    {offender.status === 'in_custody' 
                      ? (currentLanguage === 'en' ? 'In Custody' : 'ಬಂಧನದಲ್ಲಿದ್ದಾನೆ') 
                      : (currentLanguage === 'en' ? 'Absconding' : 'ತಲೆಮರೆಸಿಕೊಂಡಿದ್ದಾನೆ')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Offender Details Dashboard */}
        <div className="lg:col-span-3">
          {selectedOffender ? (
            <div className="space-y-6">
              {/* Profile Card Header */}
              <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-circle bg-surface-soft flex items-center justify-center text-ink-deep border border-hairline-soft">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-ink-deep">{selectedOffender.name}</h3>
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${
                        selectedOffender.status === 'in_custody' ? 'bg-success/10 text-success border-success/20' : 'bg-critical/10 text-critical border-critical/20'
                      }`}>
                        {selectedOffender.status === 'in_custody' ? (currentLanguage === 'en' ? 'In Custody' : 'ಬಂಧನದಲ್ಲಿ') : (currentLanguage === 'en' ? 'Active / Alert' : 'ಸಕ್ರಿಯ / ಎಚ್ಚರಿಕೆ')}
                      </span>
                    </div>
                    <span className="text-xs text-steel font-bold block">
                      ID: {selectedOffender.id} | {selectedOffender.age} {currentLanguage === 'en' ? 'years old' : 'ವರ್ಷ'} | {selectedOffender.gender}
                    </span>
                  </div>
                </div>

                {/* Recidivism Score Indicator */}
                <div className="flex items-center gap-3.5 bg-surface-soft/40 border border-hairline-soft px-4 py-3 rounded-2xl w-full md:w-auto">
                  <div className="space-y-0.5 min-w-[120px]">
                    <span className="text-[9px] text-stone font-bold uppercase tracking-wider block">
                      {currentLanguage === 'en' ? 'Recidivism Risk Index' : 'ಮತ್ತೆ ಅಪರಾಧವೆಸಗುವ ಸೂಚ್ಯಂಕ'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-hairline rounded-full flex-1 overflow-hidden">
                        <div 
                          className="h-full bg-critical rounded-full transition-all duration-500" 
                          style={{ width: `${selectedOffender.recidivismScore}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-critical font-mono">{selectedOffender.recidivismScore}%</span>
                    </div>
                  </div>
                  <ShieldAlert className="w-5 h-5 text-critical shrink-0" />
                </div>
              </div>

              {/* MO Pattern & Associate Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* MO Profile Box */}
                <div className="md:col-span-2 bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-3">
                  <h4 className="text-xs font-bold text-ink-deep uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-primary" />
                    {currentLanguage === 'en' ? 'Modus Operandi (MO) Summary' : 'ಅಪರಾಧ ವಿಧಾನದ (MO) ಸಾರಾಂಶ'}
                  </h4>
                  <p className="text-xs text-steel leading-relaxed bg-surface-soft/20 border border-hairline-soft/40 p-4 rounded-xl font-medium">
                    {selectedOffender.moSummary}
                  </p>
                </div>

                {/* Associates and Aliases Box */}
                <div className="md:col-span-1 bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-ink-deep uppercase tracking-wider">
                      {currentLanguage === 'en' ? 'Aliases / Identifiers' : 'ಅಡ್ಡಹೆಸರುಗಳು / ಇತರ ಗುರುತುಗಳು'}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedOffender.aliases.map((alias, idx) => (
                        <span key={idx} className="text-[10px] font-bold text-ink bg-surface-soft px-2 py-0.5 rounded-md border border-hairline-soft/60">
                          "{alias}"
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-hairline-soft pt-3">
                    <h4 className="text-xs font-bold text-ink-deep uppercase tracking-wider">
                      {currentLanguage === 'en' ? 'Known Network Associates' : 'ಪರಿಚಿತ ಸಹಚರರು'}
                    </h4>
                    <div className="space-y-1.5">
                      {selectedOffender.knownAssociates.map((associate, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-steel font-bold bg-surface-soft/20 px-2 py-1 rounded-lg border border-hairline-soft/40">
                          <div className="w-1.5 h-1.5 rounded-full bg-oculus-purple/60" />
                          <span className="truncate">{associate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Case History Timeline */}
              <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-ink-deep uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-stone" />
                    {currentLanguage === 'en' ? 'Associated Cases & History Registry' : 'ಸಂಬಂಧಿತ ಪ್ರಕರಣಗಳು ಮತ್ತು ಇತಿಹಾಸ'}
                  </h4>
                </div>

                <div className="relative border-l-2 border-hairline-soft ml-2 pl-6 space-y-5 py-2">
                  {selectedOffender.casesAssociated.map((c, idx) => (
                    <div key={idx} className="relative">
                      {/* Node bullet */}
                      <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-canvas bg-stone ring-2 ring-hairline-soft" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-ink-deep">{c.caseId}</span>
                          <span className="text-[10px] text-stone font-bold">| {new Date(c.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-steel">{c.role}</p>
                        <a 
                          href={`/app/cases/detail.html?id=${encodeURIComponent(c.caseId)}`}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline mt-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> {currentLanguage === 'en' ? 'Inspect Incident File' : 'ಪ್ರಕರಣ ಪರಿಶೀಲಿಸಿ'}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-canvas border border-hairline-soft rounded-xxxl p-10 text-center flex flex-col items-center justify-center min-h-[300px] gap-3">
              <AlertTriangle className="w-8 h-8 text-stone" />
              <span className="text-xs text-steel font-bold">
                {currentLanguage === 'en' ? 'Please select an offender from the sidebar database.' : 'ದಯವಿಟ್ಟು ಸೈಡ್‌ಬಾರ್‌ನಿಂದ ಒಬ್ಬ ಆರೋಪಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
