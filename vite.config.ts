import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { copyWasmVipsPlugin } from "./vite-plugins/copy-wasm-vips.js";

export default defineConfig({
	plugins: [
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
		{
			name: "configure-response-headers",
			configureServer: (server) => {
				server.middlewares.use((_req, res, next) => {
					res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
					res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
					next();
				});
			},
		},
		copyWasmVipsPlugin(),
	],
	optimizeDeps: {
		exclude: ["wasm-vips"],
	},
});
