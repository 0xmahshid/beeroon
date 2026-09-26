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
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f2622e", // primary — warm "go outside" orange
          600: "#e14e1a",
          700: "#bc3c14",
          800: "#943117",
          900: "#782b16",
        },
        ink: {
          50: "#f6f7f8",
          100: "#eceef0",
          800: "#1c2024",
          900: "#101214",
          950: "#0a0b0c",
        },
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
