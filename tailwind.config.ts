import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

export default withUt({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        headerblack: "#353436",
        backgroundgray: "#F9F9F9",
        primaryblack: "#1E211F",
        primarygreen: "#2C3F2D",
        primarylp: "#F4D3C3",
        primaryorange: "#E27D39",
        white: "#FFFFFF",
        secondarygray: "#424242",
        secondarygreen: "#24583C",
        secondaryblue: "#CAEAEF",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        gambetta: ["Gambetta", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...{
            headerblack: "#353436",
            backgroundgray: "#F9F9F9",
            primaryblack: "#1E211F",
            primarygreen: "#2C3F2D",
            primarylp: "#F4D3C3",
            primaryorange: "#E27D39",
            white: "#FFFFFF",
            secondarygray: "#424242",
            secondarygreen: "#24583C",
            secondaryblue: "#CAEAEF",
          },
        },
        dark: {
          ...{
            headerblack: "#353436",
            backgroundgray: "#F9F9F9",
            primaryblack: "#1E211F",
            primarygreen: "#2C3F2D",
            primarylp: "#F4D3C3",
            primaryorange: "#E27D39",
            white: "#FFFFFF",
            secondarygray: "#424242",
            secondarygreen: "#24583C",
            secondaryblue: "#CAEAEF",
          },
        },
      },
    ],
  },
});
