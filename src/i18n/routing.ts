import { defineRouting } from 'next-intl/routing';

// ╔════════════════════════════════════════════════════════════════╗
// ║                   МАРШРУТИЗАЦИЯ i18n                           ║
// ║        Добавляй языки по мере необходимости                    ║
// ╚════════════════════════════════════════════════════════════════╝

export const routing = defineRouting({
  // Поддерживаемые языки
  locales: ['ru', 'en', 'uz', 'tj'],

  // Язык по умолчанию
  defaultLocale: 'ru',

  // Стратегия локализации URL
  localePrefix: 'as-needed', // Не показывать /ru для дефолтного языка
});

// Типы локалей для TypeScript
export type Locale = (typeof routing.locales)[number];
