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
        background: "#EDE8E3",
        surface: "#F5F2EF",
        "surface-secondary": "#FAF8F6",
        "text-primary": "#1A1A1A",
        "text-secondary": "#6B6560",
        "text-muted": "#9A9490",
        accent: {
          DEFAULT: "#4A4545",
          hover: "#2E2A2A",
          light: "#E8E2DC",
        },
        warm: {
          DEFAULT: "#C9C2BA",
          light: "#E8E2DC",
          dark: "#A8967E",
        },
        champagne: "#D4C8BC",
        bronze: "#A8967E",
        cream: "#FAF8F6",
        success: {
          DEFAULT: "#6B8E6B",
          light: "#E8F0E8",
        },
        warning: {
          DEFAULT: "#C4956A",
          hover: "#A67D55",
          light: "#F5EDE4",
        },
        danger: {
          DEFAULT: "#B85C5C",
          light: "#F5E5E5",
        },
        divider: "#D4CFC9",
        "divider-light": "#E5E0DA",
        dark: {
          bg: "#1A1A1A",
          surface: "#2C2928",
        },
      },
      fontFamily: {
        sans: [
          "DM Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "DM Serif Display",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(26, 26, 26, 0.03)",
        card: "0 2px 20px rgba(26, 26, 26, 0.04)",
        float: "0 20px 40px -15px rgba(74, 69, 69, 0.1)",
        glow: "0 0 25px rgba(168, 150, 126, 0.2)",
        warm: "0 4px 24px rgba(212, 200, 188, 0.3)",
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
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        float: "float 6s cubic-bezier(0.28, 0.11, 0.32, 1) infinite",
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
