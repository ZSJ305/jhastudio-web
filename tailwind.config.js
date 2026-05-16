/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        background: "#0f0f0f",
        surface: "#1c1c1e",
        "surface-hover": "#2c2c2e",
        border: "rgba(255, 255, 255, 0.08)",
        primary: "#0A84FF",
        "primary-hover": "#0070E0",
        success: "#30D158",
        "success-hover": "#28B148",
        text: "#f5f5f7",
        "text-secondary": "#98989d",
        "text-tertiary": "#636366",
        "user-bubble": "rgba(10, 132, 255, 0.15)",
        "assistant-bubble": "rgba(120, 120, 128, 0.15)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
