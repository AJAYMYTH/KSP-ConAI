import React, { useState, useEffect } from 'react';
import { getCaseDetails, generateReport } from '../../lib/api';
import type { CaseDetail } from '../../types';
import CaseTimeline from './CaseTimeline';
import NetworkGraph from './NetworkGraph';
import { Shield, FileText, Calendar, MapPin, Loader2, Download, Check } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';

interface Props {
  caseId: string;
}

export default function CaseDetailView({ caseId }: Props) {
  const { t, currentLanguage, formatDate } = useI18n();
  const [details, setDetails] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'network'>('details');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      try {
        const data = await getCaseDetails(caseId);
        setDetails(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [caseId]);

  const handleGenerateReport = async () => {
    setReportLoading(true);
    setReportSuccess(false);
    try {
      const result = await generateReport(caseId);
      setPdfUrl(result.pdfUrl);
      setReportSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setReportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
        {/* Banner Skeleton */}
        <div className="bg-white border border-gov-border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-2.5 flex-1">
            <div className="flex items-center gap-2.5">
              <div className="h-3.5 w-16 animate-shimmer rounded-full"></div>
              <div className="h-1.5 w-1.5 rounded-circle animate-shimmer"></div>
              <div className="h-4.5 w-40 animate-shimmer rounded"></div>
              <div className="h-4 w-12 animate-shimmer rounded-full"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-32 animate-shimmer rounded"></div>
              <div className="h-3 w-36 animate-shimmer rounded"></div>
            </div>
          </div>
          <div className="h-8 w-32 animate-shimmer rounded-full shrink-0"></div>
        </div>

        {/* Tab Buttons Skeleton */}
        <div className="flex gap-2 border-b border-gov-border pb-3">
          <div className="h-8 w-24 animate-shimmer rounded-full"></div>
          <div className="h-8 w-24 animate-shimmer rounded-full"></div>
          <div className="h-8 w-24 animate-shimmer rounded-full"></div>
        </div>

        {/* Content Box Skeleton */}
        <div className="bg-white border border-gov-border p-6 rounded-xxxl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-4 w-1/3 animate-shimmer rounded"></div>
              <div className="space-y-3 pt-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gov-border pb-2.5 last:border-0">
                    <div className="h-3 w-24 animate-shimmer rounded"></div>
                    <div className="h-3 w-40 animate-shimmer rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-1/3 animate-shimmer rounded"></div>
              <div className="space-y-3 pt-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gov-border pb-2.5 last:border-0">
                    <div className="h-3 w-24 animate-shimmer rounded"></div>
                    <div className="h-3 w-40 animate-shimmer rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const translateDistrict = (district: string, lang: 'en' | 'kn') => {
    if (lang === 'en') return district;
    const mapping: Record<string, string> = {
      'Bengaluru City': 'ಬೆಂಗಳೂರು ನಗರ',
      'Mysuru City': 'ಮೈಸೂರು ನಗರ',
      'Hubballi-Dharwad City': 'ಹುಬ್ಬಳ್ಳಿ-ಧಾರವಾಡ ನಗರ',
      'Mangaluru City': 'ಮಂಗಳೂರು ನಗರ',
      'Belagavi City': 'ಬೆಳಗಾವಿ ನಗರ',
      'Kalaburagi City': 'ಕಲಬುರಗಿ ನಗರ',
      'Bengaluru': 'ಬೆಂಗಳೂರು',
      'Mysuru': 'ಮೈಸೂರು'
    };
    return mapping[district] || district;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'Disposed') return t('caseDetail.disposed');
    if (status === 'Under Investigation') return t('caseDetail.underInvestigation');
    if (status === 'Chargesheeted') return t('caseDetail.chargesheetSubmitted');
    return status;
  };

  if (!details) {
    return (
      <div className="p-12 text-center flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-circle bg-critical/10 flex items-center justify-center text-critical">
          <Shield className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-ink-deep">
          {currentLanguage === 'en' ? 'Case File Not Resolved' : 'ಪ್ರಕರಣದ ವಿವರ ಕಂಡುಬಂದಿಲ್ಲ'}
        </h3>
        <p className="text-xs text-steel max-w-xs">
          {currentLanguage === 'en' 
            ? 'The requested Case ID does not exist in the police registry or your role lacks permission.' 
            : 'ಕೋರಿದ ಪ್ರಕರಣದ ಐಡಿ ಪೊಲೀಸ್ ನೋಂದಣಿಯಲ್ಲಿ ಅಸ್ತಿತ್ವದಲ್ಲಿಲ್ಲ ಅಥವಾ ನಿಮ್ಮ ಪಾತ್ರಕ್ಕೆ ಅನುಮತಿಯಿಲ್ಲ.'}
        </p>
        <a href="/search" className="mt-2 px-6 py-2 bg-primary text-canvas rounded-full text-xs font-bold hover:bg-primary-deep cursor-pointer">
          {currentLanguage === 'en' ? 'Return to Database Search' : 'ಡೇಟಾಬೇಸ್ ಹುಡುಕಾಟಕ್ಕೆ ಹಿಂತಿರುಗಿ'}
        </a>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full animate-in fade-in duration-300">
      {/* Sticky Identity Banner */}
      <div className="sticky top-16 z-30 bg-canvas border border-hairline-soft p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-product-shadow">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-steel font-bold uppercase tracking-wider">{t('caseDetail.firRecord')}</span>
            <span className="w-1.5 h-1.5 rounded-circle bg-stone" />
            <h1 className="text-base font-bold text-ink-deep">{details.firNumber}</h1>
            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
              details.status === 'Disposed' ? 'bg-success/15 text-success' : 'bg-attention/15 text-attention'
            }`}>
              {getStatusLabel(details.status)}
            </span>
          </div>
          <div className="text-[10px] text-steel font-medium flex items-center gap-3">
            <span className="flex items-center gap-0.5"><MapPin className="w-3.5 h-3.5 text-stone" aria-hidden="true" /> {details.station}, {translateDistrict(details.district, currentLanguage)}</span>
            <span className="flex items-center gap-0.5">
              <Calendar className="w-3.5 h-3.5 text-stone" aria-hidden="true" /> 
              {t('caseDetail.registeredLabel', { date: formatDate(details.registeredDate) })}
            </span>
          </div>
        </div>

        {/* Generate Report Button */}
        <div className="flex gap-2">
          {reportSuccess && pdfUrl ? (
            <a
              href={pdfUrl}
              download
              className="flex items-center gap-1.5 px-5 py-2 bg-success text-canvas rounded-full text-xs font-bold shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> {t('caseDetail.downloadPdf')}
            </a>
          ) : (
            <button
              onClick={handleGenerateReport}
              disabled={reportLoading}
              className="flex items-center gap-1.5 px-5 py-2 bg-primary text-canvas rounded-full text-xs font-bold hover:bg-primary-deep disabled:bg-primary-deep/50 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none shadow-sm cursor-pointer transition"
            >
              {reportLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> {t('caseDetail.draftingPdf')}
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" aria-hidden="true" /> {t('caseDetail.generatePdf')}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-1.5 bg-surface-soft p-1 rounded-full border border-hairline-soft max-w-sm">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
            activeTab === 'details' ? 'bg-ink-deep text-canvas' : 'text-ink hover:bg-hairline-soft'
          }`}
        >
          {t('caseDetail.tab360')}
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
            activeTab === 'timeline' ? 'bg-ink-deep text-canvas' : 'text-ink hover:bg-hairline-soft'
          }`}
        >
          {t('caseDetail.tabTimeline')}
        </button>
        <button
          onClick={() => setActiveTab('network')}
          className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
            activeTab === 'network' ? 'bg-ink-deep text-canvas' : 'text-ink hover:bg-hairline-soft'
          }`}
        >
          {t('caseDetail.tabNetwork')}
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
          {/* Main Case details (Left 2 columns) */}
          <div className="md:col-span-2 space-y-6">
            {/* Case Narrative */}
            <div className="bg-canvas border border-hairline-soft p-6 rounded-xxxl card-product-shadow space-y-3">
              <h3 className="text-sm font-bold text-ink-deep uppercase tracking-wider border-b border-hairline-soft pb-2">
                {t('caseDetail.narrativeSummary')}
              </h3>
              <p className="text-xs text-steel leading-relaxed font-normal whitespace-pre-wrap">
                {details.summaryText || (currentLanguage === 'en' ? 'No custom narrative summary recorded for this case.' : 'ಈ ಪ್ರಕರಣಕ್ಕೆ ಯಾವುದೇ ಕಸ್ಟಮ್ ನಿರೂಪಣಾ ಸಾರಾಂಶವನ್ನು ದಾಖಲಿಸಲಾಗಿಲ್ಲ.')}
              </p>
            </div>

            {/* People Involved (Accused, Victims, Complainants) */}
            <div className="bg-canvas border border-hairline-soft p-6 rounded-xxxl card-product-shadow space-y-4">
              <h3 className="text-sm font-bold text-ink-deep uppercase tracking-wider border-b border-hairline-soft pb-2">
                {t('caseDetail.partiesLog')}
              </h3>
              
              <div className="space-y-4">
                {/* Accused List */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-attention font-bold">{t('caseDetail.accused')}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {details.accused.map((person, idx) => {
                      const arrest = details.arrests.find(a => a.person.toLowerCase().includes(person.split(' ')[0].toLowerCase()));
                      return (
                        <div key={idx} className="p-3 bg-surface-soft/60 border border-hairline-soft rounded-lg text-xs font-bold text-ink-deep flex flex-col justify-between">
                          <span>{person}</span>
                          {/* Arrest Details */}
                          {arrest ? (
                            <span className="text-[9px] text-success font-medium mt-1">
                              ✓ {t('caseDetail.arrestedOn', { date: formatDate(arrest.date) })}
                            </span>
                          ) : (
                            <span className="text-[9px] text-stone font-medium mt-1">
                              {t('caseDetail.pendingArrest')}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Victims & Complainants */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-success font-bold">{t('caseDetail.victims')}</span>
                    <ul className="list-disc pl-4 text-xs text-steel space-y-0.5">
                      {details.victims.map((v, i) => <li key={i}>{v}</li>)}
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-primary font-bold">{t('caseDetail.complainants')}</span>
                    <ul className="list-disc pl-4 text-xs text-steel space-y-0.5">
                      {details.complainants.map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Info (Right column) */}
          <div className="space-y-6">
            {/* Act and Sections */}
            <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('caseDetail.legalClassifications')}</span>
              <h3 className="text-xs font-bold text-ink-deep border-b border-hairline-soft pb-2">
                {t('caseDetail.actsSections')}
              </h3>
              <div className="space-y-2">
                {details.actsSections.map((item, i) => (
                  <div key={i} className="p-3 bg-surface-soft/60 border border-hairline-soft rounded-lg text-xs">
                    <div className="font-bold text-ink-deep">{item.section}</div>
                    <div className="text-[10px] text-stone font-medium mt-0.5">{item.act}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trial & Administrative details */}
            <div className="bg-canvas border border-hairline-soft p-5 rounded-xxxl card-product-shadow space-y-3">
              <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('caseDetail.adminDetails')}</span>
              <h3 className="text-xs font-bold text-ink-deep border-b border-hairline-soft pb-2">
                {t('caseDetail.trialJurisdiction')}
              </h3>
              <div className="space-y-2.5 text-xs text-steel">
                <div>
                  <span className="font-bold text-ink block">{t('caseDetail.prosecutingCourt')}</span>
                  <span className="text-stone">{details.court}</span>
                </div>
                <div>
                  <span className="font-bold text-ink block">{t('caseDetail.caseGravity')}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-block mt-0.5 ${
                    details.gravity === 'Grave' ? 'bg-critical/10 text-critical' : 'bg-surface-soft text-steel'
                  }`}>
                    {details.gravity === 'Grave' ? t('caseDetail.grave') : t('caseDetail.nonGrave')}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-ink block">{t('caseDetail.chargesheetStatus')}</span>
                  <span className="text-stone">
                    {details.chargesheeted ? t('caseDetail.chargesheetSubmitted') : t('caseDetail.underInvestigation')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-canvas border border-hairline-soft p-6 rounded-xxxl card-product-shadow">
          <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('caseDetail.milestones')}</span>
          <h3 className="text-sm font-bold text-ink-deep border-b border-hairline-soft pb-2.5 mb-4">
            {t('caseDetail.timelineTitle')}
          </h3>
          <CaseTimeline caseId={caseId} />
        </div>
      )}

      {activeTab === 'network' && (
        <div className="bg-canvas border border-hairline-soft p-6 rounded-xxxl card-product-shadow">
          <span className="text-[10px] uppercase tracking-wider text-steel font-bold">{t('caseDetail.relationalIntel')}</span>
          <h3 className="text-sm font-bold text-ink-deep border-b border-hairline-soft pb-2.5 mb-4">
            {t('caseDetail.networkTitle')}
          </h3>
          <NetworkGraph caseId={caseId} />
        </div>
      )}
    </div>
  );
}
