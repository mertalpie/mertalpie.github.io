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
        background: "#030308",
        surface: "rgba(255, 255, 255, 0.03)",
        border: "rgba(255, 255, 255, 0.08)",
        neon: {
          blue: "#00F0FF",
          purple: "#8A2BE2",
          cyan: "#00FFFF",
        },
      },
      animation: {
        "glow-pulse": "glow-pulse 8s ease-in-out infinite alternate",
      },
      keyframes: {
        "glow-pulse": {
          "0%": { opacity: "0.4", filter: "blur(40px)" },
          "100%": { opacity: "0.8", filter: "blur(80px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
