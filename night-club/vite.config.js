import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.NODE_ENV === 'production' ? '/wp-content/themes/night-club-theme/dist/' : '/',
  build: {
    outDir: "../wp-content/themes/night-club-theme/dist",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: "./src/main.jsx",
    },
  },
});
