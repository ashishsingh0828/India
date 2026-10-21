// site-india  -> port 3000        site-australia -> change port to 3001
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      "/api": "http://localhost:5050",
      "/uploads": "http://localhost:5050",
    },
  },
});
