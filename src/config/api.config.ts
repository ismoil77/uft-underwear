// config/api.config.ts

export const API_URL = 'https://dfe9a3e83bdc7f15.mokky.dev';

export const TELEGRAM_CONFIG = {
  enabled: true,
};

// Языки
export const LOCALES = ['ru', 'en', 'uz', 'tj'] as const;
export type Locale = typeof LOCALES[number];
export const DEFAULT_LOCALE: Locale = 'ru';
