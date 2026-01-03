import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ===== АНИМАЦИИ (ДОБАВЛЕНО) =====
      animation: {
        'neon-flow': 'neonFlow 8s linear infinite',
        'neon-flow-reverse': 'neonFlowReverse 12s linear infinite',
        'fadeIn': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
        neonFlow: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        neonFlowReverse: {
          '0%': { strokeDashoffset: '-1000' },
          '100%': { strokeDashoffset: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      // ===== ЦВЕТА ИЗ CSS ПЕРЕМЕННЫХ =====
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          light: 'var(--color-primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          hover: 'var(--color-secondary-hover)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
        },
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',
        border: 'var(--color-border)',
        text: {
          DEFAULT: 'var(--color-text)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',
        },
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
      },

      // ===== СКРУГЛЕНИЯ =====
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        'full': 'var(--radius-full)',
      },

      // ===== ШРИФТЫ =====
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      },

      // ===== ТЕНИ =====
      boxShadow: {
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'dropdown': 'var(--shadow-dropdown)',
        'button': 'var(--shadow-button)',
      },

      // ===== ДЛИТЕЛЬНОСТЬ ТРАНЗИЦИЙ =====
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'normal': 'var(--transition-normal)',
        'slow': 'var(--transition-slow)',
      },
    },
  },
  plugins: [],
};

export default config;