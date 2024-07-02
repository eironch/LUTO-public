/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'right': '8px 0px 15px -5px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        rotate: { 
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
      },
      animation: {
        'spin-continuous': 'rotate 2s linear infinite',
      },
      colors: {
        'zinc-875': '#19191c',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
