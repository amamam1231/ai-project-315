export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#fdf9f0',
          100: '#fcf0d8',
          200: '#f8e0b0',
          300: '#f3c978',
          400: '#edb047',
          500: '#e59a2e',
          600: '#d4821f',
          700: '#b06819',
          800: '#8e521a',
          900: '#734318',
        },
        nude: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#eaddc5',
          300: '#dec69e',
          400: '#d0a876',
          500: '#c48d56',
          600: '#b87347',
          700: '#995b3a',
          800: '#7f4b34',
          900: '#663d2d',
        }
      }
    },
  },
  plugins: [],
}