export type Lang = 'en' | 'kn';

export interface I18nState {
  currentLanguage: Lang;
  t: (key: string, options?: any) => string;
  changeLanguage: (lang: Lang) => void;
  formatDate: (date: Date | string) => string;
  formatNumber: (num: number | string) => string;
  formatCurrency: (num: number | string) => string;
  formatTime: (time: Date | string) => string;
  aiInstruction: string;
}
