/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust this according to your project structure
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'), // Adding DaisyUI as a plugin
  ],
}
