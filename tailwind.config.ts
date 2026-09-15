import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-cormorant-garamond)", "Georgia", "serif"],
        body: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        terracotta: {
          50: "#FBF3EE",
          100: "#F6E4D8",
          200: "#EDC9B4",
          300: "#E2A98C",
          400: "#D58A66",
          500: "#C96F4A",
          600: "#B55A38",
          700: "#98482E",
          800: "#7D3C29",
          900: "#663325",
        },
        cream: {
          50: "#FDFBF7",
          100: "#FAF6EF",
          200: "#F3EAE0",
          300: "#EFE3D6",
          400: "#E8D9C8",
          500: "#DBC9B3",
        },
        ink: {
          DEFAULT: "#3B2E26",
          light: "#5C4E44",
          muted: "#8A7E75",
        },
        sage: {
          DEFAULT: "#7A8B69",
          light: "#96A885",
          dark: "#5D6B50",
        },
      },
    },
  },
  plugins: [],
};

export default config;