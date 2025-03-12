/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ], theme: {
    fontFamily: {
      display: ["Agbalumo", "cursive"],
      sans: ["Fredoka", "sans-serif"],
      montserrat: ["Montserrat", "sans-serif"],
      serif: ["Lora", "serif"],
    },
    extend: {
      colors:{
        "white": "#FFF",
        "light": "#f5f5f5 ",
        "blush-light": "#F0EBEB",
        "blush-mid": "#EBD5D5",
        "blush-deep": "#FAB9BF",
        "coral": "#FD6378",
        "coral-vivid": "#F73859",
        "dark-soft": "#50666B",
        "dark": "#2E3B3E",
      },
      backgroundImage: {
        "books": "url('/src/assets/banner.jpg')",
        "blob": "url('/src/assets/blob.svg')",
      },
    },
  },
  plugins: [],
}

