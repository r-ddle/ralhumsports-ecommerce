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
        brand: {
          primary: '#FF6B35',
          secondary: '#0891B2',
          accent: '#F39C12',
          background: '#FAFAFA',
          surface: '#FFFFFF',
          border: '#DDD',
        },
        text: {
          primary: '#2D3436',
          secondary: '#636E72',
        },
        success: '#00B894',
        warning: '#FDCB6E',
        error: '#E17055',
        info: '#74B9FF',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

module.exports = config
