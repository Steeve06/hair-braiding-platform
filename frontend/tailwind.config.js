/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'luxury-gold': '#C5A059',  // The specific gold from your image
        'luxury-black': '#050505', // Rich deep black
        'luxury-gray': '#121212',  // For sections/cards
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'], // For the "Art of" titles
        sans: ['Inter', 'sans-serif'],         // For body text
      },
    },
  },
  plugins: [],
}