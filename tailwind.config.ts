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
        krem: "#FFF8EE",
        koyu: "#1E1B2E",
        turuncu: "#F07B3F",
        sari: "#F5C842",
      },
      fontFamily: {
        heading: ["var(--font-nunito)", "system-ui", "sans-serif"],
        body: ["var(--font-rubik)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
