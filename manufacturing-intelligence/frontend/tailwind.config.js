/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          DEFAULT: '#2563eb',
          light:   '#3b82f6',
          dark:    '#1d4ed8',
        },
        success: {
          DEFAULT: '#10b981',
          light:   '#34d399',
          dark:    '#059669',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light:   '#fbbf24',
          dark:    '#d97706',
        },
        danger: {
          DEFAULT: '#ef4444',
          light:   '#f87171',
          dark:    '#dc2626',
        },
        industrial: {
          steel:   '#708090',
          chrome:  '#c0c0c0',
          copper:  '#b87333',
          titanium:'#878681',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      animation: {
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-in':  'fadeIn 0.3s ease-out',
      },
      keyframes: {
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)' },
          to:   { transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
