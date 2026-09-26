/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        vazir: ["Vazirmatn", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#fff6f8",
          100: "#f9e4e9",
          200: "#f0c6d1",
          300: "#e59bad",
          400: "#d95b78",
          500: "#c91442",
          600: "#b6113d",
          700: "#a70f37",
          800: "#8e1033",
          900: "#74112d",
        },
        ink: {
          50: "#fffdf9",
          100: "#f4eee9",
          800: "#3b2d2e",
          900: "#241b1c",
          950: "#181011",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};