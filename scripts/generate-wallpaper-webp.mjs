import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const inputPath = join(__dirname, '../public/assets/wallpapers/bliss/wallpaper.jpg');
const outputDir = join(__dirname, '../public/assets/wallpapers/bliss');

// Sizes to generate
const sizes = [640, 1024, 1280, 1920, 2560, 3840];

// WebP quality setting (85-90 for good balance)
const quality = 87;

async function generateWebPVersions() {
	// Check if input file exists
	if (!existsSync(inputPath)) {
		console.error(`Error: Input file not found at ${inputPath}`);
		process.exit(1);
	}

	console.log(`Generating WebP versions from ${inputPath}...\n`);

	// Get original image metadata to maintain aspect ratio
	const metadata = await sharp(inputPath).metadata();
	const aspectRatio = metadata.width / metadata.height;

	for (const width of sizes) {
		const height = Math.round(width / aspectRatio);
		const outputPath = join(outputDir, `wallpaper-${width}w.webp`);

		try {
			await sharp(inputPath)
				.resize(width, height, {
					kernel: sharp.kernel.lanczos3, // High-quality resampling
					fit: 'cover',
				})
				.webp({ quality })
				.toFile(outputPath);

			const stats = await sharp(outputPath).metadata();
			const fileSizeKB = (stats.size / 1024).toFixed(2);
			console.log(
				`✓ Generated wallpaper-${width}w.webp (${width}x${height}, ${fileSizeKB} KB)`,
			);
		} catch (error) {
			console.error(`Error generating ${outputPath}:`, error);
			process.exit(1);
		}
	}

	console.log(`\n✓ Successfully generated ${sizes.length} WebP versions!`);
}

generateWebPVersions().catch((error) => {
	console.error('Fatal error:', error);
	process.exit(1);
});
