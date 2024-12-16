import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        base: "./",
        define: {
            global: "window",
            'import.meta.env.VITE_TRACKING_MODE': JSON.stringify("test"),
            'import.meta.env.VITE_DEV_LANG_FOLDER': JSON.stringify("mock_langs")
        },
    }
});
