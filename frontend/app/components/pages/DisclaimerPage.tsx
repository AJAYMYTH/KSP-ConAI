import React from 'react';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useI18n } from '../../i18n/hooks';

export const DisclaimerPage: React.FC = () => {
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
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider text-steel font-bold">KSP-ConAI Compliance</span>
            <h1 className="text-xl font-bold text-ink-deep">
              {t('disclaimer.title')}
            </h1>
          </div>
        </div>

        <div className="text-[11px] text-stone font-medium">
          {t('disclaimer.lastUpdated')} | {currentLanguage === 'en' ? 'Authority: Karnataka State Police Director General' : 'ಪ್ರಾಧಿಕಾರ: ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಮಹಾನಿರ್ದೇಶಕರು'}
        </div>

        <div className="space-y-5 text-xs text-steel leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {currentLanguage === 'en' ? '1. Advisory Nature of AI Tools' : '೧. AI ಪರಿಕರಗಳ ಸಲಹಾತ್ಮಕ ಸ್ವರೂಪ'}
            </h2>
            <p>
              {currentLanguage === 'en' 
                ? 'The Karnataka State Police Crime Intelligence Copilot (KSP-ConAI) utilizes Large Language Models (LLMs), machine learning algorithms, and natural language processing to assist officers in analyzing Case Narrative Diaries, establishing suspect timelines, and generating suspect relationship graphs.' 
                : 'ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಅಪರಾಧ ಗುಪ್ತಚರ ಸಹಾಯಕ (KSP-ConAI) ಪ್ರಕಟಿತ ಕೇಸ್ ಡೈರಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಲು, ಆರೋಪಿಗಳ ಟೈಮ್‌ಲೈನ್‌ಗಳನ್ನು ಸ್ಥಾಪಿಸಲು ಮತ್ತು ಆರೋಪಿಗಳ ಸಂಬಂಧ ನಕ್ಷೆಗಳನ್ನು ರಚಿಸಲು ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ನೈಸರ್ಗಿಕ ಭಾಷಾ ಸಂಸ್ಕರಣೆಯನ್ನು ಬಳಸಿಕೊಳ್ಳುತ್ತದೆ.'}
            </p>
            <p className="font-bold text-ink-deep">
              {currentLanguage === 'en' 
                ? 'All AI-generated summaries, chat responses, and relationship links are advisory in nature. They do NOT constitute official legal testimony, final evidence, or deterministic assertions of guilt.' 
                : 'ಎಲ್ಲಾ AI-ರಚಿತ ಸಾರಾಂಶಗಳು, ಚಾಟ್ ಪ್ರತಿಕ್ರಿಯೆಗಳು ಮತ್ತು ಸಂಬಂಧದ ಕೊಂಡಿಗಳು ಕೇವಲ ಸಲಹಾತ್ಮಕ ಸ್ವರೂಪದ್ದಾಗಿರುತ್ತವೆ. ಅವು ಅಧಿಕೃತ ಕಾನೂನು ಸಾಕ್ಷ್ಯ, ಅಂತಿಮ ಸಾಕ್ಷ್ಯ ಅಥವಾ ಅಪರಾಧದ ನಿರ್ಣಾಯಕ ಪ್ರತಿಪಾದನೆಗಳನ್ನು ರೂಪಿಸುವುದಿಲ್ಲ.'}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {t('disclaimer.sec1Title')}
            </h2>
            <p>
              {t('disclaimer.sec1Desc')}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                {currentLanguage === 'en' 
                  ? 'Cross-checked against the official signed paper Case Diaries and CCTNS records.' 
                  : 'ಅಧಿಕೃತ ಸಹಿ ಮಾಡಿದ ಕೇಸ್ ಡೈರಿಗಳು ಮತ್ತು CCTNS ದಾಖಲೆಗಳೊಂದಿಗೆ ಕ್ರಾಸ್-ವೆರಿಫೈ ಮಾಡಬೇಕು.'}
              </li>
              <li>
                {currentLanguage === 'en' 
                  ? 'Verified with original witness statements and forensic reports before submission to a court of law.' 
                  : 'ನ್ಯಾಯಾಲಯಕ್ಕೆ ಸಲ್ಲಿಸುವ ಮುನ್ನ ಮೂಲ ಸಾಕ್ಷಿ ಹೇಳಿಕೆಗಳು ಮತ್ತು ಫೋರೆನ್ಸಿಕ್ ವರದಿಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಬೇಕು.'}
              </li>
              <li>
                {currentLanguage === 'en' 
                  ? 'Confirmed for accuracy in names, dates, sections, and recovery amounts.' 
                  : 'ಹೆಸರುಗಳು, ದಿನಾಂಕಗಳು, ಸೆಕ್ಷನ್‌ಗಳು ಮತ್ತು ವಶಪಡಿಸಿಕೊಂಡ ಮೊತ್ತಗಳ ನಿಖರತೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಬೇಕು.'}
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {currentLanguage === 'en' ? '3. Geolocation and Mapping Limitations' : '೩. ಜಿಯೋಲೋಕಲೈಸೇಶನ್ ಮತ್ತು ಮ್ಯಾಪಿಂಗ್ ಮಿತಿಗಳು'}
            </h2>
            <p>
              {currentLanguage === 'en' 
                ? 'Hotspots maps, cluster zones, and coordinate pins rendered on this platform are based on available address texts and mobile tower records. They represent statistical approximations rather than exact physical locations. Discrepancies in street maps or boundaries should be resolved using official municipal records.' 
                : 'ಈ ವೇದಿಕೆಯಲ್ಲಿ ನಿರೂಪಿಸಲಾದ ಹಾಟ್‌ಸ್ಪಾಟ್‌ಗಳ ನಕ್ಷೆಗಳು, ಕ್ಲಸ್ಟರ್ ವಲಯಗಳು ಮತ್ತು ನಿರ್ದೇಶಾಂಕ ಪಿನ್‌ಗಳು ಲಭ್ಯವಿರುವ ವಿಳಾಸ ಪಠ್ಯಗಳು ಮತ್ತು ಮೊಬೈಲ್ ಟವರ್ ದಾಖಲೆಗಳನ್ನು ಆಧರಿಸಿವೆ. ಅವು ನಿಖರವಾದ ಭೌತಿಕ ಸ್ಥಳಗಳಿಗಿಂತ ಹೆಚ್ಚಾಗಿ ಅಂಕಿಅಂಶಗಳ ಅಂದಾಜುಗಳನ್ನು ಪ್ರತಿನಿಧಿಸುತ್ತವೆ. ರಸ್ತೆ ನಕ್ಷೆಗಳು ಅಥವಾ ಗಡಿಗಳಲ್ಲಿನ ವ್ಯತ್ಯಾಸಗಳನ್ನು ಅಧಿಕೃತ ಮುನ್ಸಿಪಲ್ ದಾಖಲೆಗಳನ್ನು ಬಳಸಿ ಬಗೆಹರಿಸಿಕೊಳ್ಳಬೇಕು.'}
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-ink-deep">
              {currentLanguage === 'en' ? '4. No Legal Liability' : '೪. ಯಾವುದೇ ಕಾನೂನು ಹೊಣೆಗಾರಿಕೆ ಇಲ್ಲ'}
            </h2>
            <p>
              {currentLanguage === 'en' 
                ? "The Government of Karnataka and the Karnataka State Police Command Centre decline all liability for errors, processing offsets, or procedural delays caused by reliance on KSP-ConAI's automated intelligence feeds." 
                : 'KSP-ConAI ನ ಸ್ವಯಂಚಾಲಿತ ಗುಪ್ತಚರ情報の ಮೇಲಿನ ಅವಲಂಬನೆಯಿಂದ ಉಂಟಾಗುವ ತಪ್ಪುಗಳು, ವಿಳಂಬಗಳು ಅಥವಾ ಕಾರ್ಯವಿಧಾನದ ವ್ಯತ್ಯಾಸಗಳಿಗೆ ಕರ್ನಾಟಕ ಸರ್ಕಾರ ಮತ್ತು ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ನಿಯಂತ್ರಣ ಕೊಠಡಿ ಯಾವುದೇ ಜವಾಬ್ದಾರಿಯನ್ನು ಹೊರುವುದಿಲ್ಲ.'}
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
