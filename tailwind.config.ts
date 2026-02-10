import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        sui: {
          50: "#E8F4FF",
          100: "#C8E4FF",
          200: "#94CBFF",
          300: "#6BB8FF",
          400: "#4DA2FF",
          500: "#3B8AEF",
          600: "#2B6FD4",
          700: "#1D52A8",
          800: "#1A3F6F",
          900: "#0F2744",
          950: "#000B1E",
        },
      },
    },
  },
  plugins: [],
};

export default config;
