import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}", 
    flowbite.content()
  ],
  theme: {
    extend: {
      scrollBehavior: ['smooth'],
    },
  },
  plugins: [flowbite.plugin()], 
};