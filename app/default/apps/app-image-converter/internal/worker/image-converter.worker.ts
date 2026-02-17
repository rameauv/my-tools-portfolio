/// <reference lib="webworker" />

import Vips from "wasm-vips";
import { getStrategy } from "./core/get-strategy";
import { postMessageToMainThread } from "./core/post-message-to-main-thread";

declare const self: DedicatedWorkerGlobalScope;

self.onmessage = async (event: MessageEvent<MainToWorkerMessage>) => {
	const { type, jobId, imageData, targetFormat, settings } = event.data;

	if (type === "CONVERT_IMAGE") {
		await convertImage(jobId, imageData, targetFormat, settings);
		self.close();
	}
};

async function getVips(postInitInProgress: (options: { message: string }) => void) {
	try {
		postInitInProgress({ message: "Initializing VIPS engine..." });
		const vipsInstance = await Vips({
			locateFile: (path: string, _prefix: string) => {
				return `/assets/libs/wasm-vips/${path}`;
			},
		});

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
		const vips = await getVips((options) => {
			postMessageToMainThread.progress({
				type: "PROGRESS",
				jobId,
				message: options.message,
			});
		});

		postMessageToMainThread.progress({
			type: "PROGRESS",
			jobId,
			message: "Processing image...",
		});
		const strategy = getStrategy(targetFormat);
		const resultBuffer = strategy(vips, imageData, settings);

		postMessageToMainThread.success(jobId, resultBuffer);
	} catch (error: unknown) {
		console.error("Conversion error:", error);
		const errorMessage = error instanceof Error ? error.message : "Unknown conversion error";
		postMessageToMainThread.error({
			type: "ERROR",
			jobId,
			error: errorMessage,
		});
	}
}

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

type MainToWorkerMessage = ConvertImageMessage;
