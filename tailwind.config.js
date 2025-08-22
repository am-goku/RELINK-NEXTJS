/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class", // <-- add this
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7C3AED",
          dark: "#5B21B6",
          light: "#C4B5FD",
        },
        accent: {
          DEFAULT: "#06B6D4",
          light: "#A5F3FC",
        },
        light: {
          bg: "#FDFDFD",
          text: "#2D3436"
        },
        dark: {
          bg: "#1E1E2F",
          text: "#F5F5F5"
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce': 'bounce 1s infinite',
      },
    },
  },
  plugins: [],
}
