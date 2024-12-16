import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  define: {
      'import.meta.env.VITE_TRACKING_MODE': JSON.stringify("survey")
  },
});
