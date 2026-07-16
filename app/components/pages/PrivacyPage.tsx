import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';

export const PrivacyPage: React.FC = () => {
  const { t, currentLanguage } = useI18n();

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
      {/* Navigation header */}
      <div className="flex items-center justify-between border-b border-hairline-soft pb-4">
        <a href="/dashboard" className="flex items-center gap-1 text-xs font-bold text-steel hover:text-primary transition">
          <ArrowLeft className="w-3.5 h-3.5" /> 
          <span>{currentLanguage === 'en' ? 'Back to Dashboard' : 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ'}</span>
        </a>
        <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
          {currentLanguage === 'en' ? 'Classified // Internal Use Only' : 'ವರ್ಗೀಕೃತ // ಆಂತರಿಕ ಬಳಕೆಗೆ ಮಾತ್ರ'}
        </span>
      </div>

      {/* Document Container */}
      <div className="bg-canvas border border-hairline-soft p-6 md:p-10 rounded-xxxl card-product-shadow space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-circle bg-primary/10 flex items-center justify-center text-primary">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">KSP-ConAI Compliance</span>
            <h1 className="text-xl font-bold text-ink-deep">
              {t('privacy.title')}
            </h1>
          </div>
        </div>

        <div className="text-[11px] text-stone font-medium">
          {t('privacy.lastUpdated')} | {currentLanguage === 'en' ? 'Authority: Karnataka State Police IT Cell' : 'ಪ್ರಾಧಿಕಾರ: ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಐಟಿ ಸೆಲ್'}
        </div>

        <div className="space-y-5 text-xs text-steel leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {t('privacy.sec1Title')}
            </h2>
            <p>
              {t('privacy.sec1Desc')}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {t('privacy.sec2Title')}
            </h2>
            <p>
              {t('privacy.sec2Desc')}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>{currentLanguage === 'en' ? 'Officer Activities:' : 'ಅಧಿಕಾರಿ ಚಟುವಟಿಕೆಗಳು:'}</strong>{' '}
                {currentLanguage === 'en' 
                  ? 'All queries, searches, generated summaries, and chat history entered by officers are securely logged.' 
                  : 'ಅಧಿಕಾರಿಗಳು ನಮೂದಿಸಿದ ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳು, ಹುಡುಕಾಟಗಳು, ರಚಿಸಲಾದ ಸಾರಾಂಶಗಳು ಮತ್ತು ಚಾಟ್ ಇತಿಹಾಸವನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಲಾಗ್ ಮಾಡಲಾಗುತ್ತದೆ.'}
              </li>
              <li>
                <strong>{currentLanguage === 'en' ? 'Session Metadata:' : 'ಸೆಷನ್ ಮೆಟಾಡೇಟಾ:'}</strong>{' '}
                {currentLanguage === 'en' 
                  ? 'Device IPs, login timestamps, active badges, and role capabilities are collected for compliance audits.' 
                  : 'ಅನುಸರಣೆ ಆಡಿಟ್‌ಗಳಿಗಾಗಿ ಸಾಧನದ ಐಪಿಗಳು, ಲಾಗಿನ್ ಟೈಮ್‌ಸ್ಟ್ಯಾಂಪ್‌ಗಳು, ಸಕ್ರಿಯ ಬ್ಯಾಡ್ಜ್‌ಗಳು ಮತ್ತು ಪಾತ್ರದ ಸಾಮರ್ಥ್ಯಗಳನ್ನು ಸಂಗ್ರಹಿಸಲಾಗುತ್ತದೆ.'}
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {t('privacy.sec3Title')}
            </h2>
            <p>
              {t('privacy.sec3Desc')}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {t('privacy.sec4Title')}
            </h2>
            <p>
              {t('privacy.sec4Desc')}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {t('privacy.sec5Title')}
            </h2>
            <p>
              {t('privacy.sec5Desc')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
