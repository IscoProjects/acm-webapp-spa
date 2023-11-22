/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1024px",
    },
    extend: {
      colors: {
        mirage: {
          50: "#f4f6fb",
          100: "#e9ecf5",
          200: "#ced8e9",
          300: "#a2b7d7",
          400: "#7090c0",
          500: "#4e72a9",
          600: "#3c5a8d",
          700: "#314973",
          800: "#2c3f60",
          900: "#293651",
          950: "#1a2234",
        },
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
};
