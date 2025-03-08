/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0b0719',
        cosmic: '#2c1950',
        moonglow: '#FDE68A',
        stardust: '#E9D8FD',
        nebula: '#805AD5',
        space: {
          100: '#C4B5FD',
          200: '#A78BFA',
          300: '#7C3AED',
          400: '#5B21B6',
          500: '#4C1D95',
          600: '#2E1065',
          700: '#1F0954',
          800: '#170842',
          900: '#0F0630',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 4s alternate infinite',
        'twinkle-delayed': 'twinkle 5s alternate infinite 2s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%': { opacity: 0.3, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(to bottom, #0b0719, #2c1950)',
      },
    },
  },
  plugins: [],
};