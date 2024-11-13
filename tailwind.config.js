/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/Settings.tsx",
    "./src/video/videoLinks.ts",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
};
