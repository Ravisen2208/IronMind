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
        background: "#FBFBFD",
        surface: "#FFFFFF",
        "text-primary": "#1D1D1F",
        "text-secondary": "#6E6E73",
        accent: {
          DEFAULT: "#0071E3",
          hover: "#0058B0",
          light: "#E8F2FD",
        },
        success: {
          DEFAULT: "#34C759",
          light: "#EBF9EE",
        },
        warm: {
          DEFAULT: "#FF9F0A",
          hover: "#CC7E08",
          light: "#FFF5E5",
        },
        divider: "#D2D2D7",
        "divider-light": "#E5E5EA",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(0, 0, 0, 0.03)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        float: "0 20px 40px -15px rgba(0, 113, 227, 0.12)",
        glow: "0 0 25px rgba(0, 113, 227, 0.25)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.28, 0.11, 0.32, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.75" },
        },
      },
      animation: {
        float: "float 6s cubic-bezier(0.28, 0.11, 0.32, 1) infinite",
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
