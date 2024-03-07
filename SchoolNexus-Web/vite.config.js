import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

import dotenv from "dotenv";
dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: process.env.VITE_PORT || 5173,
        host: process.env.VITE_HOST || "localhost",
    },
    plugins: [react()],
});
