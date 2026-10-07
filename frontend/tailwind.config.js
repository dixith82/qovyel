/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#000000",
        obsidian: "#0a0a0c",
        graphite: "#141416",
        line: "rgba(255,255,255,0.08)",
        bone: "#f5f5f2",
        mist: "rgba(245,245,242,0.6)",
        accent: "#e7c9a3",
        steel: "#c9cad0",
      },
      fontFamily: {
        display: ["'Neue Montreal'", "'Helvetica Neue'", "Arial", "sans-serif"],
        body: ["'Inter'", "'Helvetica Neue'", "Arial", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest2: "0.3em",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
