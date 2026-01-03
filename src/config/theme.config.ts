import { ThemeConfig } from '@/types/config'

// ╔════════════════════════════════════════════════════════════════╗
// ║                    ТЕМА / ДИЗАЙН                               ║
// ║         UFT — Элегантные, нежные тона                       ║
// ╚════════════════════════════════════════════════════════════════╝

export const themeConfig: ThemeConfig = {
	// ===== ЦВЕТА =====
	colors: {
		// Основной цвет — нежный розовый/пудровый
		primary: '#D4A5A5',
		primaryHover: '#C48B8B',
		primaryLight: '#FAF0F0',

		// Вторичный — элегантный тёмный
		secondary: '#2D2D2D',
		secondaryHover: '#1A1A1A',

		// Акцент — золотой
		accent: '#C9A962',
		accentHover: '#B8964A',

		// Фоны — светлые, чистые
		background: '#FFFFFF',
		surface: '#FBF9F9',
		surfaceHover: '#F5F0F0',

		// Границы
		border: '#E8E0E0',

		// Текст
		text: '#2D2D2D',
		textMuted: '#7A7A7A',
		textInverse: '#FFFFFF',

		// Статусы
		success: '#7DB87D',
		error: '#D47070',
		warning: '#E0B060',
	},

	// ===== ШРИФТЫ =====
	fonts: {
		heading: '"Cormorant Garamond", Georgia, serif',
		body: '"Montserrat", system-ui, sans-serif',
	},

	// ===== СКРУГЛЕНИЯ =====
	borderRadius: {
		sm: '4px',
		md: '8px',
		lg: '12px',
		xl: '20px',
		full: '9999px',
	},

	// ===== ТЕНИ =====
	shadows: {
		card: '0 2px 12px rgba(212, 165, 165, 0.1)',
		cardHover: '0 8px 30px rgba(212, 165, 165, 0.2)',
		dropdown: '0 10px 40px rgba(0, 0, 0, 0.1)',
		button: '0 2px 8px rgba(212, 165, 165, 0.3)',
	},

	// ===== АНИМАЦИИ =====
	transitions: {
		fast: '150ms',
		normal: '250ms',
		slow: '400ms',
	},

	// ===== ТЁМНАЯ ТЕМА =====
	darkMode: false,
}

// ===== ГЕНЕРАЦИЯ CSS ПЕРЕМЕННЫХ =====
export function generateCSSVariables(theme: ThemeConfig): string {
	return `
    :root {
      /* Цвета */
      --color-primary: ${theme.colors.primary};
      --color-primary-hover: ${theme.colors.primaryHover};
      --color-primary-light: ${theme.colors.primaryLight};
      --color-secondary: ${theme.colors.secondary};
      --color-secondary-hover: ${theme.colors.secondaryHover};
      --color-accent: ${theme.colors.accent};
      --color-accent-hover: ${theme.colors.accentHover};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-surface-hover: ${theme.colors.surfaceHover};
      --color-border: ${theme.colors.border};
      --color-text: ${theme.colors.text};
      --color-text-muted: ${theme.colors.textMuted};
      --color-text-inverse: ${theme.colors.textInverse};
      --color-success: ${theme.colors.success};
      --color-error: ${theme.colors.error};
      --color-warning: ${theme.colors.warning};

      /* Шрифты */
      --font-heading: ${theme.fonts.heading};
      --font-body: ${theme.fonts.body};

      /* Скругления */
      --radius-sm: ${theme.borderRadius.sm};
      --radius-md: ${theme.borderRadius.md};
      --radius-lg: ${theme.borderRadius.lg};
      --radius-xl: ${theme.borderRadius.xl};
      --radius-full: ${theme.borderRadius.full};

      /* Тени */
      --shadow-card: ${theme.shadows.card};
      --shadow-card-hover: ${theme.shadows.cardHover};
      --shadow-dropdown: ${theme.shadows.dropdown};
      --shadow-button: ${theme.shadows.button};

      /* Анимации */
      --transition-fast: ${theme.transitions.fast};
      --transition-normal: ${theme.transitions.normal};
      --transition-slow: ${theme.transitions.slow};
    }
  `
}
