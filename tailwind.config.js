module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        background: '#2A2A2B',
        sidebar: '#2A2A2B'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
