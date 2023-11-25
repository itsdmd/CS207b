/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import "dotenv/config";

const port = process.env.PORT || "20700";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: port,
	},
	plugins: [react()],
});
