import Vips from "wasm-vips";

// Worker message types
interface ConvertImageMessage {
	type: "CONVERT_IMAGE";
	jobId: string;
	imageData: ArrayBuffer;
	targetFormat: string;
	settings: {
		quality?: number;
		compression?: number;
	};
}

type WorkerMessage = ConvertImageMessage;

let vipsInstance: Awaited<ReturnType<typeof Vips>> | null = null;

async function getVips() {
	if (vipsInstance) return vipsInstance;

	// Notify progress
	self.postMessage({
		type: "PROGRESS",
		jobId: "init",
		message: "Initializing VIPS engine...",
	});

	try {
		vipsInstance = await Vips({
			locateFile: (path: string, _prefix: string) => {
				return `/assets/wasm-vips/${path}`;
			},
		});

		// Force single-threaded mode to avoid SharedArrayBuffer issues if headers are missing
		vipsInstance.concurrency(1);

		return vipsInstance;
	} catch (error: unknown) {
		console.error("VIPS init error:", error);
		throw error;
	}
}

async function convertImage(
	jobId: string,
	imageData: ArrayBuffer,
	targetFormat: string,
	settings: { quality?: number; compression?: number },
) {
	try {
		const vips = await getVips();

		(self as unknown as Worker).postMessage({
			type: "PROGRESS",
			jobId,
			message: "Processing image...",
		});

		// Load image from buffer
		const image = vips.Image.newFromBuffer(imageData);

		// Map format to file extension
		const ext = `.${targetFormat.toLowerCase()}`;

		// Map settings to vips options based on target format
		const options: Record<string, unknown> = {};

		if (targetFormat.toUpperCase() === "PNG") {
			if (settings.compression !== undefined) {
				options.compression = settings.compression;
			}
		} else {
			// For WEBP, JPEG, and others, use Q for quality
			if (settings.quality !== undefined) {
				options.Q = settings.quality;
			}
		}

		// Perform conversion
		const outputBuffer = image.writeToBuffer(ext, options);

		// Cleanup source image
		image.delete();

		// Send result
		// We copy the data to ensure it's a regular ArrayBuffer, not a view into the WASM heap
		// or a SharedArrayBuffer which would fail to transfer if the environment is not cross-origin isolated.
		const resultBuffer = outputBuffer.slice(0).buffer;

		(self as unknown as Worker).postMessage(
			{
				type: "SUCCESS",
				jobId,
				result: resultBuffer,
			},
			[resultBuffer],
		); // Transfer the buffer
	} catch (error: unknown) {
		console.error("Conversion error:", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown conversion error";
		(self as unknown as Worker).postMessage({
			type: "ERROR",
			jobId,
			error: errorMessage,
		});
	}
}

self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
	const { type, jobId, imageData, targetFormat, settings } = event.data;

	if (type === "CONVERT_IMAGE") {
		await convertImage(jobId, imageData, targetFormat, settings);
		self.close();
	}
};
