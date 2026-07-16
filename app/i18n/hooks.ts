import { useTranslation } from 'react-i18next';
import { 
  formatLocalDate, 
  formatLocalNumber, 
  formatLocalCurrency, 
  formatLocalTime,
  getLanguageInstruction
} from './utils';

export function useI18n() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'en' | 'kn';

  const changeLanguage = (lang: 'en' | 'kn' | 'EN' | 'KN') => {
    const formatted = lang.toLowerCase() as 'en' | 'kn';
    i18n.changeLanguage(formatted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ksp_language', formatted.toUpperCase());
      window.dispatchEvent(
        new CustomEvent('ksp-language-change', { detail: formatted.toUpperCase() })
      );
    }
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    formatDate: (date: Date | string) => formatLocalDate(date, currentLanguage),
    formatNumber: (num: number | string) => formatLocalNumber(num, currentLanguage),
    formatCurrency: (num: number | string) => formatLocalCurrency(num, currentLanguage),
    formatTime: (time: Date | string) => formatLocalTime(time, currentLanguage),
    aiInstruction: getLanguageInstruction(currentLanguage)
  };
}
