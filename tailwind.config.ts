import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New Brand Color System
        brand: {
          primary: '#FF6B35', // Primary Orange - buttons, CTAs, links
          secondary: '#3B82F6', // Secondary Blue - headers, navigation, important text
          accent: '#F39C12', // Accent Amber - badges, highlights, sale indicators
          background: '#FAFAFA', // Main background - never pure white
          surface: '#FFFFFF', // Card surfaces
          border: '#E5E7EB', // Borders, cards, dividers
        },
        text: {
          primary: '#2D3436', // Main text - never pure black
          secondary: '#6B7280', // Secondary text, descriptions
        },
        // Semantic colors
        success: '#10B981', // Success states
        warning: '#F59E0B', // Warning states
        error: '#EF4444', // Error states
        info: '#3B82F6', // Info states
        // Legacy support (will be removed)
        primary: {
          DEFAULT: '#FF6B35',
          50: '#FFF4F2',
          100: '#FFE8E3',
          200: '#FFD0C4',
          300: '#FFB3A0',
          400: '#FF8B6B',
          500: '#FF6B35',
          600: '#FF4500',
          700: '#E63900',
          800: '#CC2E00',
          900: '#B32600',
        },
        secondary: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

module.exports = config
