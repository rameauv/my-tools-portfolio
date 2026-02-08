import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

export function copyWasmVipsPlugin(): Plugin {
	return {
		name: "copy-wasm-vips",
		configResolved: () => {
			const publicDir = path.resolve(process.cwd(), "public/assets/libs/wasm-vips");
			copyWasmVipsTo(publicDir);
		},
		writeBundle(options: { dir?: string }) {
			const baseDir = options.dir ?? path.resolve(process.cwd(), "build/client");
			const out = path.join(baseDir, "assets/libs/wasm-vips");
			copyWasmVipsTo(out);
		},
	};
}

const wasmVipsLib = path.resolve(process.cwd(), "node_modules/wasm-vips/lib");

function copyWasmVipsTo(targetDir: string) {
	fs.mkdirSync(targetDir, { recursive: true });
	for (const name of fs.readdirSync(wasmVipsLib)) {
		if (path.extname(name) !== ".wasm") continue;
		const src = path.join(wasmVipsLib, name);
		if (fs.statSync(src).isFile()) {
			fs.copyFileSync(src, path.join(targetDir, name));
		}
	}
}
