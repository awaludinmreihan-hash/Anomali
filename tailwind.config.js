/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kraft: {
          50: "#F6F1E4",
          100: "#EFE6D1",
          200: "#E2D3AF",
          300: "#CBB989",
        },
        stempel: {
          DEFAULT: "#A8221C",
          dark: "#7A1814",
          light: "#C2493F",
        },
        arsip: {
          ink: "#20201C",
          soft: "#4A463C",
          line: "#B8AC8E",
        },
        darurat: "#B8860B",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        serif: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        noise: "url('/noise.png')",
      },
    },
  },
  plugins: [],
};
