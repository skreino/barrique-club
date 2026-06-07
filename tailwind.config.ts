import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        espresso: "#17110e",
        crema: "#f4eadb",
        vellum: "#fff9ef",
        burgundy: "#6b172b",
        wine: "#8c2438",
        champagne: "#c7a66a",
        pewter: "#a79c8d",
        smoke: "#302722"
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"]
      },
      boxShadow: {
        cellar: "0 24px 80px rgba(0, 0, 0, 0.34)",
        rim: "inset 0 1px 0 rgba(255, 249, 239, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
