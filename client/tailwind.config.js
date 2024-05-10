/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'right': '8px 0px 15px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
