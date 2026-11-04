import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// Local: http://localhost:3002  |  Ambition /admin: set VITE_BASE=/admin/ in .env.production
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: env.VITE_BASE || process.env.VITE_BASE || "/",
    build: { outDir: "dist" },
    plugins: [react()],
    server: {
      host: true,
      port: 3002,
      strictPort: true,
      allowedHosts: true,
      proxy: {
        "/api": "http://127.0.0.1:5050",
        "/uploads": "http://127.0.0.1:5050",
      },
    },
  };
});
