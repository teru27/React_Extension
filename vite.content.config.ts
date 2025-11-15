import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // contentScript.tsx中で呼ばれて機能すべてをビルドするため。ファイルの追加はしない
      input: resolve(__dirname, "src/content/contentScript.tsx"),
      output: {
        format: "iife", // import 文を消す
        entryFileNames: "contentScript.js",
      },
    },
    outDir: "dist/content",
    emptyOutDir: true,
  },
});
