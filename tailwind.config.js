module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        background: '#27272a',
        sidebar: '#27272a'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
