import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// ╔════════════════════════════════════════════════════════════════╗
// ║                    MIDDLEWARE i18n                             ║
// ║         Автоматическое определение языка и редиректы           ║
// ╚════════════════════════════════════════════════════════════════╝

export default createMiddleware(routing);

export const config = {
  // Матчим все пути кроме:
  // - /api, /trpc, /_next, /_vercel
  // - Файлы со статикой (содержат точку, например favicon.ico)
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
