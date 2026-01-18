import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isElectronBuild = process.env.BUILD_TARGET === "electron";

  return {
    // استخدم مسار نسبي فقط عند البناء لإصدارة Electron
    base: isElectronBuild ? "./" : "/",
    server: {
      host: "::",
      port: 5173,
      proxy: {
        "/api/v1": {
          target: process.env.VITE_DEV_API_TARGET || "https://metagym.metacodecx.com",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api\/v1/, "/api/v1"),
        },
      },
    },
    plugins: [
      react(),
      // تم تعطيل componentTagger لتجنب مشاكل ESM/CommonJS في Electron
      // mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  };
});
