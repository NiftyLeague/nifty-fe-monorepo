import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#c094f6',
          dark: '#522281',
          50: '#faf6fe',
          100: '#f2e9fe',
          200: '#e7d7fd',
          300: '#d5b8fa',
          400: '#c094f6',
          500: '#a15eee',
          600: '#8a3de0',
          700: '#752cc4',
          800: '#6429a0',
          900: '#522281',
          950: '#360c5f',
        },
      },
    },
    // Force consistent breakpoints
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
  },
};

export default config;
