import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{vue,ts}",
    "./components/**/*.{vue,ts}",
    "./pages/**/*.{vue,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
      },
      colors: {
        brand: {
          purple: "#7c3aed",
          indigo: "#4f46e5",
          violet: "#a78bfa"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
