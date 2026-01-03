// ╔════════════════════════════════════════════════════════════════╗
// ║                    API & TELEGRAM CONFIG                       ║
// ╚════════════════════════════════════════════════════════════════╝

// API Mokky.dev
export const API_URL = 'https://dfe9a3e83bdc7f15.mokky.dev';

// Telegram Bot настройки
// Получить токен: @BotFather в Telegram
// Получить chat_id: @userinfobot или @getmyid_bot
export const TELEGRAM_CONFIG = {
  botToken: '8358479907:AAHffnkmtncGAJzo8B4JSTxVl-Z3LzHD-4w', // Вставь токен бота
  chatId: '5964446374',   // Вставь chat_id куда слать заявки
  enabled: true,
};

// Поддерживаемые языки
export const LOCALES = ['ru', 'en', 'uz', 'tj'] as const;
export type Locale = typeof LOCALES[number];

// Дефолтный язык
export const DEFAULT_LOCALE: Locale = 'ru';
