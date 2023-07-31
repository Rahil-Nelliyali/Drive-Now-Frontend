/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      gradientColorStops: {
        'custom-gradient': '#FFB74D 30%, #2196F3 70%',
      },
      colors: {
        'custom-red': '#D9534F', 
        'customColor': '#5BC0DE', 
        'customColorA': '#428BCA', 
        'customColorB': '#5CB85C', 
        'customColorC': '#F0AD4E',
      },
      fontFamily: {
        sans: ['Source Sans Pro', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  variants: {},
  plugins: [],
})

