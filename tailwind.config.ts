import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // Case 1: app is in root
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",      // Case 2: pages are in root
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Case 3: components are in root
    "./src/**/*.{js,ts,jsx,tsx,mdx}",        // Case 4: everything is in src
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;