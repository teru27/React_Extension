import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // ビルド対象の選択
        background: resolve(__dirname, "src/background/background.ts"),
        component: resolve(__dirname, "src/background/background.ts"),
        modal: resolve(__dirname, "src/component/modal.css"),
      },
      output: {
        // ビルド対象の出力先の指定
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
