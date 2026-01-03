// ╔════════════════════════════════════════════════════════════════╗
// ║                  ГЛАВНЫЙ КОНФИГ                                ║
// ║         Импортируй этот файл везде где нужен конфиг            ║
// ╚════════════════════════════════════════════════════════════════╝

import { siteConfig } from './site.config';
import { themeConfig, generateCSSVariables } from './theme.config';
import { productConfig } from './product.config';
import { featuresConfig } from './features.config';
import { AppConfig } from '@/types/config';

// Полный конфиг приложения
export const config: AppConfig = {
  site: siteConfig,
  theme: themeConfig,
  product: productConfig,
  features: featuresConfig,
};

// Экспорт отдельных конфигов
export { siteConfig, themeConfig, productConfig, featuresConfig, generateCSSVariables };

// Экспорт по умолчанию
export default config;
