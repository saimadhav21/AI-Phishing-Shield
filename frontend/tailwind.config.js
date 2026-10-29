/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: "#0A2540",
          blue: "#1E3A8A",
          accent: "#0284C7",
          darkNavy: "#07172A",
          bgLight: "#F8FAFC",
          cardLight: "#FFFFFF",
          borderLight: "#E2E8F0",
        },
        cyber: {
          darkest: "#060A14",
          dark: "#0A1122",
          card: "#0D1527",
          border: "#1E293B",
          hover: "#1E293B",
          cyan: "#06B6D4",
          cyanGlow: "#22D3EE",
          blue: "#3B82F6",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#EF4444"
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.4)',
        'glow-rose': '0 0 25px -3px rgba(239, 68, 68, 0.4)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.4)',
      }
    },
  },
  plugins: [],
}
