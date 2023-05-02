const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{html,js,vue}',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
    },
    colors: {
      slate: colors.slate,
      yellow: colors.yellow,
      red: colors.red,
      green: colors.green,
      'twilight': '#141055',
      'nebula': '#032544',
      'wine': '#2b0000',
    },
  },
  plugins: [],
};
