import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './config';

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Sync initial state from localStorage if available
    const saved = localStorage.getItem('ksp_language');
    if (saved === 'KN' || saved === 'kn') {
      i18n.changeLanguage('kn');
    } else {
      i18n.changeLanguage('en');
    }
    setInitialized(true);
  }, []);

  // During SSR or before hydration, render children with initialized config
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
};
