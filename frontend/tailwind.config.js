/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-green': {
          100: '#e8f5e9',
          500: '#4caf50',
          700: '#388e3c',
          900: '#1b5e20',
        },
        'board-bg': '#e8f5e9',
      },
    },
  },
  plugins: [],
}