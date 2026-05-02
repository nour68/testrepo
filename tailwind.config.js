/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#0A0A0A',
        lime: '#C8F135',
        orange: '#FF5C1A',
        cream: '#F5F2ED',
        charcoal: '#1C1C1C',
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'cursive'],
        body: ['Barlow', 'sans-serif'],
      },
      screens: {
        xs: '390px',
      },
    },
  },
  plugins: [],
}
