import { useCallback, useEffect, useRef } from "react";

// Worker message types
interface ProcessImageMessage {
	type: "PROCESS_IMAGE";
	jobId: string;
	imageData: ArrayBuffer;
	powerPreference: "high-performance" | "low-power";
}

interface CancelMessage {
	type: "CANCEL";
	jobId: string;
}

// Worker response types
interface ProgressResponse {
	type: "PROGRESS";
	jobId: string;
	progress: string;
	percentage: number;
}

interface SuccessResponse {
	type: "SUCCESS";
	jobId: string;
	result: ArrayBuffer;
}

interface ErrorResponse {
	type: "ERROR";
	jobId: string;
	error: {
		message: string;
		code?: string;
	};
}

interface CancelledResponse {
	type: "CANCELLED";
	jobId: string;
}

type WorkerResponse = ProgressResponse | SuccessResponse | ErrorResponse | CancelledResponse;

interface UseBackgroundRemovalWorkerOptions {
	onProgress?: (jobId: string, progress: string, percentage: number) => void;
	onSuccess?: (jobId: string, result: ArrayBuffer) => void;
	onError?: (jobId: string, error: { message: string; code?: string }) => void;
	onCancelled?: (jobId: string) => void;
}

let worker: Worker | null = null;

export function useBackgroundRemovalWorker({
	onProgress,
	onSuccess,
	onError,
	onCancelled,
}: UseBackgroundRemovalWorkerOptions) {
	const statusHandler = useRef({
		onProgress: onProgress,
		onSuccess: onSuccess,
		onError: onError,
		onCancelled: onCancelled,
	});

	useEffect(() => {
		statusHandler.current.onProgress = onProgress;
		statusHandler.current.onSuccess = onSuccess;
		statusHandler.current.onError = onError;
		statusHandler.current.onCancelled = onCancelled;
	}, [onProgress, onSuccess, onError, onCancelled]);

	const processImage = useCallback(
		async (
			jobId: string,
			imageUrl: string,
			powerPreference: "high-performance" | "low-power",
		): Promise<ArrayBuffer> => {
			console.log("processImage", jobId, imageUrl, powerPreference);
			if (worker) {
				throw new Error("Worker already initialized");
			}
			const currentWorker = new Worker(new URL("./background-removal.worker.ts", import.meta.url), { type: "module" });
			worker = currentWorker;

			// Convert image URL to ArrayBuffer
			const response = await fetch(imageUrl);
			const imageData = await response.arrayBuffer();

			// Send message to worker
			const message: ProcessImageMessage = {
				type: "PROCESS_IMAGE",
				jobId,
				imageData,
				powerPreference,
			};

			currentWorker.postMessage(message);

			// Return a promise that resolves when the job completes
			return new Promise((resolve, reject) => {
				const handler = (response: WorkerResponse) => {
					console.log("handler", response);
					if (response.type === "SUCCESS") {
						resolve(response.result);
						worker?.terminate();
						worker = null;
					} else if (response.type === "ERROR") {
						reject(new Error(response.error.message));
						worker?.terminate();
						worker = null;
					} else if (response.type === "CANCELLED") {
						reject(new Error("Job cancelled"));
						worker?.terminate();
						worker = null;
					}
				};

				currentWorker.onmessage = (event: MessageEvent<WorkerResponse>) => {
					console.log("worker message", event.data);
					handler(event.data);
					switch (event.data.type) {
						case "PROGRESS":
							statusHandler.current.onProgress?.(event.data.jobId, event.data.progress, event.data.percentage);
							break;
						case "SUCCESS":
							statusHandler.current.onSuccess?.(event.data.jobId, event.data.result);
							break;
						case "ERROR":
							statusHandler.current.onError?.(event.data.jobId, event.data.error);
							break;
						case "CANCELLED":
							statusHandler.current.onCancelled?.(event.data.jobId);
							break;
					}
				};
			});
		},
		[],
	);

	const cancelJob = useCallback((jobId: string) => {
		if (!worker) {
			console.error("Worker not initialized");
			return;
		}

		const message: CancelMessage = {
			type: "CANCEL",
			jobId,
		};

		worker.postMessage(message);
	}, []);

	return {
		processImage,
		cancelJob,
	};
}
