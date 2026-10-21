import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Admin panel runs on http://localhost:3002 and talks to the API on port 5050
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3002,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      "/api": "http://localhost:5050",
      "/uploads": "http://localhost:5050",
    },
  },
});
