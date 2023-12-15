/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        main: '#43FFAF',
        sub: '#526777',
        background: '#262A33',
        error: '#FF5F5F',
      }
    }
  },
  plugins: [],
}