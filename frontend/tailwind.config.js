import flowbite from "flowbite-react/tailwind";
import flowbitePlugin from "flowbite/plugin";
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content()
  ],
  theme: {
    extend: {
      scrollBehavior: ['smooth'],
    }
  },
  plugins: [
    flowbitePlugin,
    daisyui // ← Add DaisyUI plugin here
  ]
};
