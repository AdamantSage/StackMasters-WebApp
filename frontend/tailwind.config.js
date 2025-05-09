/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',  // Include all JavaScript and JSX files in the src folder
    './public/index.html',          // Include the main HTML file
  ],
  theme: {
    extend: {
      colors: {
        customColor: '#ff5733',    // Custom color
      },
      spacing: {
        '128': '32rem',             // Custom spacing value
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),   // Plugin for styling forms
    require('@tailwindcss/typography'), // Plugin for typography styles
  ],
}
