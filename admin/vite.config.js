import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Local: http://localhost:3002  |  Production (same domain as site): VITE_BASE=/admin/
export default defineConfig({
  base: process.env.VITE_BASE || "/",
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
});
