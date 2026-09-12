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
        background: "#F5F5F7",
        surface: "#FFFFFF",
        "surface-secondary": "#FBFBFD",
        "text-primary": "#1D1D1F",
        "text-secondary": "#6E6E73",
        "text-muted": "#86868B",
        accent: {
          DEFAULT: "#0071E3",
          hover: "#0058B0",
          light: "#E8F2FD",
        },
        success: {
          DEFAULT: "#34C759",
          light: "#EBF9EE",
        },
        warning: {
          DEFAULT: "#FF9F0A",
          hover: "#CC7E08",
          light: "#FFF5E5",
        },
        danger: {
          DEFAULT: "#FF3B30",
          light: "#FEECEB",
        },
        divider: "#D2D2D7",
        "divider-light": "#E5E5EA",
        dark: {
          bg: "#1D1D1F",
          surface: "#2C2C2E",
        },
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
        xl: "0.875rem", // 14px Apple inputs
        "2xl": "1.25rem", // 20px
        "3xl": "1.5rem", // 24px Apple cards
        "4xl": "2rem", // 32px Apple large sections
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(0, 0, 0, 0.03)",
        card: "0 2px 20px rgba(0, 0, 0, 0.04)",
        float: "0 20px 40px -15px rgba(0, 113, 227, 0.12)",
        glow: "0 0 25px rgba(0, 113, 227, 0.25)",
      },
      transitionTimingFunction: {
        apple: "cubic-bezier(0.28, 0.11, 0.32, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
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
