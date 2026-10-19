import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from "vite-plugin-compression";

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress' })
  ],
  base: process.env.NODE_ENV === 'production' ? '/wp-content/themes/night-club-theme/dist/' : '/',
  build: {
    outDir: "../wp-content/themes/night-club-theme/dist",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: "./src/main.jsx",
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
  },
});
