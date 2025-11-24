// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        accent: '#ff4757', // coral/red from design
        softbg: '#fbfbfc'
      },
      borderRadius: {
        xl2: '14px'
      }
    }
  },
  plugins: []
};
