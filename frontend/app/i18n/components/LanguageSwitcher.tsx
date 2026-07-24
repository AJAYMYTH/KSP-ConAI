import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../hooks';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage } = useI18n();

  const handleToggle = () => {
    const nextLang = currentLanguage === 'en' ? 'kn' : 'en';
    changeLanguage(nextLang);
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface-soft border border-hairline hover:bg-surface-mid focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-full text-[10px] font-display font-bold text-ink transition-all cursor-pointer select-none"
      aria-label="Toggle language between English and Kannada"
    >
      <Globe className="w-3.5 h-3.5 text-stone" />
      <span>{currentLanguage === 'en' ? 'English' : 'ಕನ್ನಡ'}</span>
    </button>
  );
};

export default LanguageSwitcher;
