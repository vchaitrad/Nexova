/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy:  { DEFAULT: '#1B2A4A', light: '#2C4270', dark: '#0F1D35', muted: '#4A5F85', 50: '#F0F2F6', 100: '#E2E6EE' },
        gold:  { DEFAULT: '#C4A882', light: '#E8DCC8', dark: '#A68B64', 50: '#FAF7F2' },
        blush: { DEFAULT: '#F0E2DE', light: '#F7EFEC', dark: '#D4C0BA', 50: '#FDFAFA' },
        cream: { DEFAULT: '#F5F0EB', light: '#FAF8F6', dark: '#E0D8D0', 50: '#FDFCFA' },
      },
      fontFamily: {
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'marquee':  'marquee 25s linear infinite',
        'float':    'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(30px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
    },
  },
  plugins: [],
};
