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
        background: "#05010d", // Very dark purple-black
        surface: "#0c021a", // Slightly lighter surface
        primary: {
          DEFAULT: "#8b5cf6", // Vibrant purple
          glow: "rgba(139, 92, 246, 0.5)",
        },
        secondary: {
          DEFAULT: "#d946ef", // Fuchsia
          glow: "rgba(217, 70, 239, 0.5)",
        },
        success: "#10b981",
        warning: "#fbbf24",
        fraud: "#ef4444",
        muted: "#94a3b8",
        card: "rgba(30, 10, 60, 0.4)", // Glass purple
        "card-border": "rgba(255, 255, 255, 0.08)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, rgba(5, 1, 13, 1) 70%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
