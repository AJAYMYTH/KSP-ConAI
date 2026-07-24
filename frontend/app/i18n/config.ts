import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import knTranslations from './locales/kn.json';

const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ksp_language');
    if (saved === 'KN' || saved === 'kn') return 'kn';
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      kn: { translation: knTranslations }
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  });

// Handle custom event from legacy elements or direct state changes
if (typeof window !== 'undefined') {
  window.addEventListener('ksp-language-change', (e: Event) => {
    const customEvent = e as CustomEvent<'EN' | 'KN' | 'en' | 'kn'>;
    const newLang = customEvent.detail.toLowerCase();
    if (newLang === 'en' || newLang === 'kn') {
      i18n.changeLanguage(newLang);
    }
  });
}

export default i18n;
