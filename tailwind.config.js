/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1898A5",
        "primary-dark": "#137d88",
        "primary-darker": "#0d5560",
        brand: {
          DEFAULT: "#1898A5",
          dark: "#137d88",
          darker: "#0d5560",
        },
        accent: "#F5A623",
        background: "#F8F9FA",
        "dark-teal": "#0d5560",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      maxWidth: {
        "content": "1280px",
      },
      spacing: {
        "section-mobile": "24px",
        "section-desktop": "80px",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        "card": "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};
