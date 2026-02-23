import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/", // 部署基础路径。若需要部署在abc.com/ssv，则需要将base修改为"/ssv"。
  build: {
    outDir: "dist", // 打包输出目录

    assetsDir: "assets", // 静态资源目录
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
});
