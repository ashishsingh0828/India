import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// India admin runs on http://localhost:3002 and talks to the API on port 5050
export default defineConfig({
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
