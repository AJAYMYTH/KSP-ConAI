import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';

export const TermsPage: React.FC = () => {
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
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">KSP-ConAI Compliance</span>
            <h1 className="text-xl font-bold text-ink-deep">
              {t('terms.title')}
            </h1>
          </div>
        </div>

        <div className="text-[11px] text-stone font-medium">
          {t('terms.lastUpdated')} | {currentLanguage === 'en' ? 'Authority: Karnataka State Police Command Centre' : 'ಪ್ರಾಧಿಕಾರ: ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ನಿಯಂತ್ರಣ ಕೊಠಡಿ'}
        </div>

        <div className="space-y-5 text-xs text-steel leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {currentLanguage === 'en' ? '1. Acceptance of Terms' : '೧. ನಿಯಮಗಳ ಸ್ವೀಕಾರ'}
            </h2>
            <p>
              {t('terms.sec1Desc')}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {currentLanguage === 'en' ? '2. Authorized Use Only' : '೨. ಅಧಿಕೃತ ಬಳಕೆಗೆ ಮಾತ್ರ'}
            </h2>
            <p>
              {currentLanguage === 'en' 
                ? 'This portal is exclusively for the official use of personnel belonging to the Karnataka State Police. Access by any other person, or use for non-official purposes (including personal curiosity, tracking acquaintances, or unauthorized research), is strictly prohibited and constitutes a punishable offense under Section 66 of the Information Technology Act.' 
                : 'ಈ ಪೋರ್ಟಲ್ ಪ್ರತ್ಯೇಕವಾಗಿ ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಸಿಬ್ಬಂದಿಯ ಅಧಿಕೃತ ಬಳಕೆಗಾಗಿ ಮಾತ್ರ. ಯಾವುದೇ ಇತರ ವ್ಯಕ್ತಿಯ ಪ್ರವೇಶ, ಅಥವಾ ಅನಧಿಕೃತ ಉದ್ದೇಶಗಳಿಗಾಗಿ ಬಳಕೆ (ವೈಯಕ್ತಿಕ ಕುತೂಹಲ ಅಥವಾ ಅನಧಿಕೃತ ಸಂಶೋಧನೆ ಸೇರಿದಂತೆ) ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ ಮತ್ತು ಮಾಹಿತಿ ತಂತ್ರಜ್ಞಾನ ಕಾಯ್ದೆಯ ಸೆಕ್ಷನ್ 66 ರ ಅಡಿಯಲ್ಲಿ ಶಿಕ್ಷಾರ್ಹ ಅಪರಾಧವಾಗಿದೆ.'}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {t('terms.sec2Title')}
            </h2>
            <p>
              {t('terms.sec2Desc')}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {currentLanguage === 'en' ? '4. Prohibited Activities' : '೪. ನಿಷೇಧಿತ ಚಟುವಟಿಕೆಗಳು'}
            </h2>
            <p>
              {currentLanguage === 'en' ? 'Users are strictly forbidden from:' : 'ಬಳಕೆದಾರರಿಗೆ ಈ ಕೆಳಗಿನವುಗಳನ್ನು ಕಟ್ಟುನಿಟ್ಟಾಗಿ ನಿಷೇಧಿಸಲಾಗಿದೆ:'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {currentLanguage === 'en' 
                  ? 'Exporting raw database files, suspect graph mappings, or hotspot overlays without an authorized supervisor signature.' 
                  : 'ಅಧಿಕೃತ ಮೇಲ್ವಿಚಾರಕರ ಸಹಿ ಇಲ್ಲದೆ ಕಚ್ಚಾ ಡೇಟಾಬೇಸ್ ಫೈಲ್‌ಗಳನ್ನು, ನಕ್ಷೆಗಳನ್ನು ಅಥವಾ ಹಾಟ್‌ಸ್ಪಾಟ್ ಮೇಲ್ಪದರಗಳನ್ನು ರಫ್ತು ಮಾಡುವುದು.'}
              </li>
              <li>
                {currentLanguage === 'en' 
                  ? 'Inputting non-police files or queries containing malicious payloads into the AI Assistant.' 
                  : 'AI ಸಹಾಯಕಕ್ಕೆ ಹಾನಿಕಾರಕ ಪ್ರೋಗ್ರಾಂಗಳು ಅಥವಾ ಫೈಲ್‌ಗಳನ್ನು ಇನ್‌ಪುಟ್ ಮಾಡುವುದು.'}
              </li>
              <li>
                {currentLanguage === 'en' 
                  ? 'Sharing or copying KSP-ConAI screenshots onto public networks or personal devices.' 
                  : 'KSP-ConAI ಸ್ಕ್ರೀನ್‌ಶಾಟ್‌ಗಳನ್ನು ಸಾರ್ವಜನಿಕ ನೆಟ್‌ವರ್ಕ್‌ಗಳು ಅಥವಾ ವೈಯಕ್ತಿಕ ಸಾಧನಗಳಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳುವುದು ಅಥವಾ ನಕಲಿಸುವುದು.'}
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {t('terms.sec4Title')}
            </h2>
            <p>
              {t('terms.sec4Desc')}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {currentLanguage === 'en' ? '6. Term Violations & Penalties' : '೬. ನಿಯಮ ಉಲ್ಲಂಘನೆ ಮತ್ತು ದಂಡಗಳು'}
            </h2>
            <p>
              {currentLanguage === 'en' 
                ? 'Violations of these terms will lead to immediate revocation of access permissions, disciplinary inquiry under the Karnataka Civil Services Rules, suspension, and legal prosecution under the Indian Penal Code (IPC) or relevant cybercrime laws.' 
                : 'ಈ ನಿಯಮಗಳ ಉಲ್ಲಂಘನೆಯು ಪ್ರವೇಶದ ತಕ್ಷಣದ ರದ್ದತಿಗೆ, ಕರ್ನಾಟಕ ನಾಗರಿಕ ಸೇವಾ ನಿಯಮಗಳ ಅಡಿಯಲ್ಲಿ ಶಿಸ್ತು ಕ್ರಮಕ್ಕೆ, ಅಮಾನತು ಮತ್ತು ಸಂಬಂಧಿತ ಸೈಬರ್ ಅಪರಾಧ ಕಾನೂನುಗಳ ಅಡಿಯಲ್ಲಿ ಕಾನೂನು ಕ್ರಮಕ್ಕೆ ಕಾರಣವಾಗುತ್ತದೆ.'}
            </p>
          </section>
        </div>

        <div className="border-t border-hairline-soft pt-4 flex justify-between items-center text-[10px] text-stone">
          <span>KSP-ConAI Protocol V1.0</span>
          <button onClick={() => window.print()} className="text-primary hover:underline font-bold cursor-pointer bg-transparent border-0 p-0">
            {currentLanguage === 'en' ? 'Print Document' : 'ದಾಖಲೆಯನ್ನು ಪ್ರಿಂಟ್ ಮಾಡಿ'}
          </button>
        </div>
      </div>
    </div>
  );
};
