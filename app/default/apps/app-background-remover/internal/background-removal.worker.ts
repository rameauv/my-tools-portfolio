import { pipeline, env } from "@huggingface/transformers";

// Worker message types
interface ProcessImageMessage {
	type: 'PROCESS_IMAGE';
	jobId: string;
	imageData: ArrayBuffer;
	powerPreference: 'high-performance' | 'low-power';
}

interface CancelMessage {
	type: 'CANCEL';
	jobId: string;
}

type WorkerMessage = ProcessImageMessage | CancelMessage;

// Worker response types
interface ProgressResponse {
	type: 'PROGRESS';
	jobId: string;
	progress: string;
	percentage: number;
}

interface SuccessResponse {
	type: 'SUCCESS';
	jobId: string;
	result: ArrayBuffer;
}

interface ErrorResponse {
	type: 'ERROR';
	jobId: string;
	error: {
		message: string;
		code?: string;
	};
}

interface CancelledResponse {
	type: 'CANCELLED';
	jobId: string;
}

type WorkerResponse = ProgressResponse | SuccessResponse | ErrorResponse | CancelledResponse;

let pipelineInstance: any = null;
let currentJobId: string | null = null;
let abortController: AbortController | null = null;

async function initializePipeline(powerPreference: 'high-performance' | 'low-power'): Promise<void> {
	if (!currentJobId) {
		throw new Error("Current job ID not set");
	}
	if (pipelineInstance) {
		return;
	}


	// Note: WebGPU may not be available in workers, so we'll use WASM
	// The powerPreference is passed but may not be fully utilized in worker context
	console.log("initializePipeline", powerPreference);
	if (env.backends.onnx.webgpu) {
		env.backends.onnx.webgpu.powerPreference = powerPreference;
	} else {
		const errorResponse: ErrorResponse = {
			type: 'ERROR',
			jobId: currentJobId ?? "",
			error: {
				message: "WebGPU backend not supported",
			},
		};
		self.postMessage(errorResponse);
		throw new Error("WebGPU backend not supported");
	}
	const segmenter = await pipeline("background-removal", "onnx-community/BEN2-ONNX", {
		device: "webgpu",
		progress_callback: (progressInfo: any) => {
			console.log("progressInfo", progressInfo);
			if (currentJobId) {
				let progress = "";
				let percentage = 0;

				// Handle ProgressStatusInfo (status: "progress")
				if (progressInfo?.status === "progress" && typeof progressInfo.progress === "number") {
					percentage = Math.round(progressInfo.progress);
					if (progressInfo.file) {
						progress = `Downloading ${progressInfo.file}... ${percentage}%`;
					} else {
						progress = `Loading model... ${percentage}%`;
					}
				}
				// Handle DoneProgressInfo (status: "done")
				else if (progressInfo?.status === "done") {
					if (progressInfo.file) {
						progress = `Downloaded ${progressInfo.file}`;
						percentage = 100;
					} else {
						progress = "File downloaded";
						percentage = 100;
					}
				}
				// Handle ReadyProgressInfo (status: "ready")
				else if (progressInfo?.status === "ready") {
					progress = "Model ready";
					percentage = 100;
				}
				// Handle other status types
				else if (progressInfo?.status) {
					const statusMessage = progressInfo.status.charAt(0).toUpperCase() + progressInfo.status.slice(1);
					progress = statusMessage;
				}

				if (progress) {
					const response: ProgressResponse = {
						type: 'PROGRESS',
						jobId: currentJobId,
						progress,
						percentage,
					};
					self.postMessage(response);
				}
			}
		},
	});
	console.log("segmenter", segmenter);
	pipelineInstance = segmenter;
}

async function processImage(
	jobId: string,
	imageData: ArrayBuffer,
	powerPreference: 'high-performance' | 'low-power',
): Promise<void> {
	try {
		console.log("processImage", jobId, imageData, powerPreference);
		currentJobId = jobId;
		abortController = new AbortController();

		console.log("fetch config.json");
		// Initialize pipeline if needed
		console.log("initializePipeline", powerPreference);
		await initializePipeline(powerPreference);
		console.log("pipelineInstance", pipelineInstance);

		if (!pipelineInstance) {
			console.error("Pipeline not initialized");
			throw new Error("Pipeline not initialized");
		}

		// Convert ArrayBuffer to blob URL
		console.log("convert imageData to blob", imageData);
		const blob = new Blob([imageData]);
		console.log("blob", blob);
		const imageUrl = URL.createObjectURL(blob);
		// Send progress update
		const progressResponse: ProgressResponse = {
			type: 'PROGRESS',
			jobId,
			progress: "Processing image...",
			percentage: 50,
		};
		self.postMessage(progressResponse);

		// Process the image
		console.log("pipelineInstance", pipelineInstance);
		const outputs = await pipelineInstance(imageUrl, { signal: abortController.signal });
		console.log("outputs", outputs);
		const rawImage = outputs[0];
		const resultBlob = await rawImage.toBlob();

		// Cleanup
		URL.revokeObjectURL(imageUrl);

		// Convert blob to ArrayBuffer for transfer
		const resultArrayBuffer = await resultBlob.arrayBuffer();

		// Send success response
		const successResponse: SuccessResponse = {
			type: 'SUCCESS',
			jobId,
			result: resultArrayBuffer,
		};
		self.postMessage(successResponse);

		currentJobId = null;
		abortController = null;
		pipelineInstance.dispose();
		self.close();
	} catch (error: any) {
		console.error("error", error);
		currentJobId = null;
		abortController = null;

		// Check if it was cancelled
		if (error?.name === 'AbortError' || error?.message?.includes('abort')) {
			const cancelledResponse: CancelledResponse = {
				type: 'CANCELLED',
				jobId,
			};
			self.postMessage(cancelledResponse);
			self.close();
			return;
		}

		// Send error response
		const errorResponse: ErrorResponse = {
			type: 'ERROR',
			jobId,
			error: {
				message: error?.message || "Unknown error occurred",
				code: error?.code || error?.name,
			},
		};
		self.postMessage(errorResponse);
		self.close();
	}
}

function cancelJob(jobId: string): void {
	if (currentJobId === jobId && abortController) {
		abortController.abort();
	}
}

// Handle messages from main thread
self.addEventListener('message', async (event: MessageEvent<WorkerMessage>) => {
	const message = event.data;
	console.log("message", message);

	switch (message.type) {
		case 'PROCESS_IMAGE':
			await processImage(message.jobId, message.imageData, message.powerPreference);
			break;
		case 'CANCEL':
			cancelJob(message.jobId);
			break;
		default:
			console.warn('Unknown message type:', message);
	}
});
