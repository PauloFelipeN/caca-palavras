/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'love-pink': '#FFB6C1',
        'love-red': '#FF69B4',
        'love-purple': '#DDA0DD',
        'love-white': '#FFF0F5',
        'love-dark': '#8B008B'
      },
      fontFamily: {
        'romantic': ['Dancing Script', 'cursive'],
        'elegant': ['Playfair Display', 'serif']
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}