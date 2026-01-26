/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./screens/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#502025",
        "accent-gold": "#C5A059",
        "accent": "#C5A059",
        "background-light": "#f8f6f6",
        "background-dark": "#1d1516",
        "card-dark": "#2d2021",
        "burgundy-accent": "#2d2021",
        "chat-bot": "#2d1f20",
        "warm-ivory": "#F5F5DC",
      },
      fontFamily: {
        "display": ["Work Sans", "sans-serif"],
        "montserrat": ["Montserrat", "sans-serif"]
      },
      borderRadius: {
        "xl": "0.75rem",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
