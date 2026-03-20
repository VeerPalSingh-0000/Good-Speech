/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        primary: {
          light: 'hsl(262, 83%, 78%)',
          DEFAULT: 'hsl(262, 83%, 58%)', // Rich Purple
          dark: 'hsl(262, 83%, 38%)',
        },
        secondary: {
          light: 'hsl(330, 80%, 80%)',
          DEFAULT: 'hsl(330, 80%, 60%)', // Vibrant Pink
          dark: 'hsl(330, 80%, 40%)',
        },
        accent: 'hsl(45, 100%, 60%)', // Warm Gold
        success: 'hsl(152, 69%, 45%)', // Fresh Green
        surface: 'hsl(222, 47%, 11%)', // Deep Navy
      },
      fontFamily: {
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
      }
    },
  },
  plugins: [],
};