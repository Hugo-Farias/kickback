/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./src/Settings.tsx",
    "./src/video/videoThumbs.ts",
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
