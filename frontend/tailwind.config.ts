import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#000000",
          pink: "#F8C8DC",
          "pink-light": "#FCE4EE",
          "pink-dark": "#E8A9C4",
        },
        surface: {
          light: "#FFFFFF",
          "off-light": "#FAF7F8",
          dark: "#0A0A0A",
          "off-dark": "#141414",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px rgba(0,0,0,0.06)",
        "soft-lg": "0 12px 40px rgba(0,0,0,0.10)",
        "pink-glow": "0 8px 30px rgba(248,200,220,0.35)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
