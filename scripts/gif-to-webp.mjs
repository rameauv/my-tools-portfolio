/**
 * Converts a GIF to animated WebP with the same framerate.
 * Uses gif2webp (libwebp). Quality is tuned so the output file size is lower than the original.
 *
 * Requires: gif2webp on PATH (e.g. brew install webp)
 *
 * Usage: node scripts/gif-to-webp.mjs <input.gif> [output.webp]
 */

import { execFile } from "node:child_process";
import { stat } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, "..");

function parseArgs() {
	const input = process.argv[2];
	if (!input) {
		console.error("Usage: node scripts/gif-to-webp.mjs <input.gif> [output.webp]");
		console.error("Requires: gif2webp on PATH (brew install webp)");
		process.exit(1);
	}
	const inputPath = input.startsWith("/") ? input : join(rootDir, input);
	const outputArg = process.argv[3];
	const outputPath =
		outputArg != null
			? outputArg.startsWith("/")
				? outputArg
				: join(rootDir, outputArg)
			: inputPath.replace(extname(inputPath), ".webp");
	return { inputPath, outputPath };
}

async function convertWithGif2Webp(inputPath, outputPath, quality, method = 4) {
	await execFileAsync("gif2webp", [
		"-lossy",
		"-q",
		String(quality),
		"-m",
		String(method),
		"-mt",
		inputPath,
		"-o",
		outputPath,
	]);
}

async function main() {
	const { inputPath, outputPath } = parseArgs();

	const inputStat = await stat(inputPath).catch((err) => {
		console.error(`Error: cannot read file ${inputPath}`, err.message);
		process.exit(1);
	});
	const targetSize = inputStat.size;

	// Try decreasing quality until output is smaller than input (animated, same framerate)
	// Fewer steps to avoid long runs; gif2webp -m 6 is slow on large GIFs
	const qualities = [65, 55, 45, 38];

	for (const quality of qualities) {
		try {
			await convertWithGif2Webp(inputPath, outputPath, quality);
			const outputStat = await stat(outputPath);
			const ratio = ((outputStat.size / targetSize) * 100).toFixed(1);
			console.log(
				`✓ ${outputPath}\n  Quality: ${quality} | Input: ${(targetSize / 1024).toFixed(1)} KB → Output: ${(outputStat.size / 1024).toFixed(1)} KB (${ratio}% of original)`,
			);
			if (outputStat.size < targetSize) {
				console.log("  Animated WebP (same framerate), smaller than original.");
				return;
			}
		} catch (err) {
			if (err.code === "ENOENT") {
				console.error("Error: gif2webp not found. Install with: brew install webp");
				process.exit(1);
			}
			throw err;
		}
	}

	// Last attempt with minimum quality
	await convertWithGif2Webp(inputPath, outputPath, 32);
	const outputStat = await stat(outputPath);
	const ratio = ((outputStat.size / targetSize) * 100).toFixed(1);
	console.log(
		`✓ ${outputPath}\n  Quality: 32 (min) | Input: ${(targetSize / 1024).toFixed(1)} KB → Output: ${(outputStat.size / 1024).toFixed(1)} KB (${ratio}% of original)`,
	);
	if (outputStat.size >= targetSize) {
		console.warn("  Warning: output is still larger than input.");
	}
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
