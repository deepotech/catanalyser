import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316", // Warm energetic amber-orange
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        sage: {
          50: "#f6f8f6",
          100: "#eaf0ea",
          200: "#d6e2d6",
          300: "#b5ccb6",
          400: "#8eb090",
          500: "#6e9471",
          600: "#557758",
          700: "#445e46",
          800: "#394c3a",
          900: "#303f31",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        "soft-sm": "0 2px 8px -2px rgba(15, 23, 42, 0.05)",
        "soft": "0 8px 30px -4px rgba(15, 23, 42, 0.06)",
        "soft-lg": "0 20px 40px -10px rgba(15, 23, 42, 0.08)",
        "card": "0 4px 20px -2px rgba(24, 24, 27, 0.04), 0 0 1px 1px rgba(24, 24, 27, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
