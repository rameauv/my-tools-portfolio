import type { ConversionSettings, VipsInstance } from "./image-converter-types";

export function JPEGStrategy(vips: VipsInstance, imageData: ArrayBuffer, settings: ConversionSettings) {
	const image = vips.Image.newFromBuffer(imageData).flatten({ background: [255, 255, 255] });
	const outputBuffer = image.writeToBuffer(".jpg", { Q: settings.quality });
	image.delete();
	return outputBuffer.slice(0).buffer;
}

export function PNGStrategy(vips: VipsInstance, imageData: ArrayBuffer, settings: ConversionSettings) {
	const image = vips.Image.newFromBuffer(imageData);
	const outputBuffer = image.writeToBuffer(".png", { compression: settings.compression });
	image.delete();
	return outputBuffer.slice(0).buffer;
}

export function WEBPStrategy(vips: VipsInstance, imageData: ArrayBuffer, settings: ConversionSettings) {
	const image = vips.Image.newFromBuffer(imageData);
	const outputBuffer = image.writeToBuffer(".webp", {
		Q: settings.quality,
	});
	image.delete();
	return outputBuffer.slice(0).buffer;
}
