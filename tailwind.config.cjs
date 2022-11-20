/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.indigo[400],
        success: colors.green[400],
        warning: colors.yellow[400],
        danger: colors.red[400],
        info: colors.emerald[400],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
