import { JPEGStrategy, PNGStrategy, WEBPStrategy } from "./image-converter-strategies";
import type { ConvertStrategy } from "./image-converter-types";

export function getStrategy(targetFormat: string): ConvertStrategy {
	switch (targetFormat.toUpperCase()) {
		case "JPEG":
			return JPEGStrategy;
		case "PNG":
			return PNGStrategy;
		case "WEBP":
			return WEBPStrategy;
		default:
			throw new Error(`Unsupported target format: ${targetFormat}`);
	}
}
