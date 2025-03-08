/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Adjust paths as necessary
  darkMode: 'class', // Enable dark mode via the "dark" class
  theme: {
    extend: {
      animation: {
        'shimmer': 'shimmer 2s infinite linear',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' }
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 }
        }
      },
      skew: {
        '30': '30deg',
      }
    },
  },
  plugins: [require('preline/plugin')], // Include the Preline plugin
};
