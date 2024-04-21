import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import prismjs from "vite-plugin-prismjs";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  preview: {
    port: 3000,
    host: "0.0.0.0",
  },
  plugins: [
    react(),
    prismjs({
      languages: ["json"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
  },
});
