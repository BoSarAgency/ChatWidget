import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    define: {
        // Define process.env for browser compatibility
        "process.env.NODE_ENV": '"production"',
        "process.env": "{}",
        process: "undefined",
        global: "globalThis",
    },
    build: {
        lib: {
            entry: "src/widget.js",
            name: "ChatWidget",
            fileName: "chat-widget",
            formats: ["umd"],
        },
        rollupOptions: {
            external: [],
            output: {
                globals: {},
                // Add banner to define process for browser
                banner: `
                if (typeof process === 'undefined') {
                    var process = { env: { NODE_ENV: 'production' } };
                }
                if (typeof global === 'undefined') {
                    var global = globalThis;
                }
                `,
            },
        },
    },
});
