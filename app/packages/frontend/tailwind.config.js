/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [
    nextui({
      defaultTheme: "dark",
      themes: {
        dark: {
          colors: {
            // Extending custom colors
            background: {
              DEFAULT: "#0A0A0A",
              900: "#0A0A0A",
              800: "#1A1A1A",
              700: "#2A2A2A",
              600: "#3A3A3A",
            },
            primary: {
              DEFAULT: "#B026FF",
              900: "#B026FF",
              800: "#C147FF",
              700: "#D268FF",
              600: "#E389FF",
            },
            secondary: {
              DEFAULT: "#00FFFF",
              900: "#00FFFF",
              800: "#33FFFF",
              700: "#66FFFF",
              600: "#99FFFF",
            },
            success: {
              DEFAULT: "#128A0E",
              900: "#128A0E",
              800: "#22A82D",
              700: "#43C04C",
              600: "#65D96B",
            },
            error: {
              DEFAULT: "#D32F2F",
              900: "#D32F2F",
              800: "#E25757",
              700: "#EF7A7A",
              600: "#FC9D9D",
            },
            warning: {
              DEFAULT: "#FFCA00",
              900: "#FFCA00",
              800: "#FFD633",
              700: "#FFE266",
              600: "#FFED99",
            },
            foreground: {
              DEFAULT: "#D0D0D0",
            },
            divider: "#333333",
            overlay: "#000000",
            danger: "#FF0000",
          },
        },
      },
    }),
  ],
};
