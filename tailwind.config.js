/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom palette from your images
        'dark': {
          'primary': '#0A0B17',    // Main background
          'secondary': '#14162E',  // Secondary background
          'tertiary': '#1A2C35',   // Card backgrounds
          'surface': '#2E3E46',    // Elevated surfaces
        },
        'gray': {
          'darkest': '#030303',
          'darker': '#333333',
          'dark': '#444444',
          'medium': '#555555',
          'light': '#5D5D5D',
          'lighter': '#A9A9A9',
          'lightest': '#EDEDED',
        },
        'primary': {
          50: '#F3F1FE',
          100: '#E8E3FD',
          500: '#5D2DE6',    // Main purple
          600: '#4A21B8',    // Hover purple
          700: '#3B1A94',
        },
        'secondary': {
          50: '#F0FCFE',
          100: '#E1F9FE',
          500: '#24D0F7',    // Main cyan
          600: '#1BA8CC',    // Hover cyan
          700: '#1486A8',
        },
        'success': '#24D0F7',
        'error': '#FF6B6B',
        'warning': '#B794F6',
      },
      fontFamily: {
        'sans': ['Montserrat']
      }
    }
  }
}
