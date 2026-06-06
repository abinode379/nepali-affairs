import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        card: '#111111',
        border: '#222222',
        text: '#ffffff',
        muted: '#a1a1aa'
      },
      boxShadow: {
        soft: '0 24px 80px rgba(255, 255, 255, 0.07)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;
