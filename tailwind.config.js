/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.js",
    "./public/**/*.html",
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        epilogue: "var(--font-epilogue)",
        work_sans: "var(--font-work-sans)",
      },
      colors: {
        sidebar: "#f9f9f8",
        white: "#ffffff",
        table_header: "#f7f9f9b0",
        table_border: "#f5f5f5",
        primary: {
          50: "#f0f8eb",
          100: "#d0eac1",
          200: "#badfa3",
          300: "#9ad17a",
          400: "#86c860",
          500: "#68ba38",
          600: "#5fa933",
          700: "#4a8428",
          800: "#39661f",
          900: "#2c4e18",
        },
        secondary: {
          50: "#e6e6e6",
          100: "#b1b2b1",
          200: "#8c8d8b",
          300: "#575a55",
          400: "#363935",
          500: "#040802",
          600: "#040702",
          700: "#030601",
          800: "#020401",
          900: "#020301",
        },
      },
      gradientColorStops: {
        '135deg': '135deg',
      },

      backgroundImage: (theme) => ({
         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
         "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        'gradient-card': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-button': 'linear-gradient(180deg, var(--tw-gradient-stops))',
      }),
    },
  },
  // content: [
  //   "./node_modules/flowbite-react/**/*.js",
  //   "./pages/**/*.{ts,tsx}",
  //   "./public/**/*.html",
  // ],
  plugins: [require("flowbite/plugin")],
  // darkMode: "media",
};
