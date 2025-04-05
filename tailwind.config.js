/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#c547ff",
          DEFAULT: "#9c20d9",
          dark: "#442bb2",
        },
        secondary: {
          light: "#5b548a",
          DEFAULT: "#3c3773",
          dark: "#2b244d",
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(120deg, var(--tw-colors-primary-light), var(--tw-colors-primary-dark))',
        'gradient-secondary': 'linear-gradient(160deg, var(--tw-colors-secondary-light), var(--tw-colors-secondary-dark))',
      },
    },
  },
  plugins: [],
};
