import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-primary)",
        surface: "var(--surface)",
        "surface-secondary": "var(--surface-secondary)",
        "surface-card": "var(--surface-card)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          light: "var(--accent-light)",
        },
        warm: {
          DEFAULT: "var(--warm)",
          light: "var(--warm-light)",
          dark: "var(--warm-dark)",
        },
        champagne: "var(--champagne)",
        bronze: "var(--bronze)",
        cream: "var(--cream)",
        success: {
          DEFAULT: "var(--success)",
          light: "var(--success-light)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          hover: "var(--warning-hover)",
          light: "var(--warning-light)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          light: "var(--danger-light)",
        },
        divider: "var(--divider)",
        "divider-light": "var(--divider-light)",
        dark: {
          bg: "#0C0D12",
          surface: "#14161F",
        },
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Outfit",
          "DM Sans",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        heading: [
          "Plus Jakarta Sans",
          "Outfit",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "monospace",
        ],
        serif: [
          "DM Serif Display",
          "Georgia",
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
        subtle: "var(--shadow-subtle)",
        card: "var(--card-shadow)",
        float: "0 20px 40px -15px rgba(0, 0, 0, 0.3)",
        glow: "0 0 25px rgba(212, 175, 55, 0.25)",
        warm: "0 4px 24px rgba(0, 0, 0, 0.25)",
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
