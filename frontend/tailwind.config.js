/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Habit Tracker custom palette
        primary: '#80BCBD',      // Muted teal
        secondary: '#AAD9BB',    // Soft green
        accent: '#D5F0C1',       // Light green
        light: '#F9F7C9',        // Cream
        white: '#FFFFFF',
      },
      backgroundImage: {
        'gradient-soft': 'linear-gradient(135deg, #80BCBD 0%, #AAD9BB 50%, #D5F0C1 100%)',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
