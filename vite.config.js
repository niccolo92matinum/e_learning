import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
    define: {
        global: "window",
        'import.meta.env.VITE_DEV_LANG_FOLDER': JSON.stringify("mock_langs")
    },
});
