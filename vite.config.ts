import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // popup: resolve(__dirname, "popup.html"),
        //modal: resolve(__dirname, "modal.html"),
        background: resolve(__dirname, "src/background/background.ts"),
        modal: resolve(__dirname, "src/popup/modal.css"),
      },
      output: {
        entryFileNames: "src/[name].js",
        chunkFileNames: "assets/[name].js",
        cssChunkFileNames: "assets/[name].css",
        assetFileNames: "assets/[name].[ext]",
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
});
