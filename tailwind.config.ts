import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primaryblack: "1E211F",
          primarygreen: "2C3F2D",
          primarylp: "F4D3C3",
          primaryorange: "E27D39",
          white: "FFFFFF",
          secondarygray: "424242",
          secondarygreen: "24583C",
          secondaryblue: "CAEAEF",
        },
      },
    ],
  },
  themes: {
    //fonts for the project
    fontFamily: {
      manrope: ["Manrope", "sans-serif"],
      gambetta: ["Gambetta", "serif"],
    },
  },
};
export default config;
