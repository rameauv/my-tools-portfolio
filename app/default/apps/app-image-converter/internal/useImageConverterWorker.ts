import { useCallback, useEffect, useRef } from "react";

// Worker message types
// Removed unused ConvertImageMessage to fix lint

// Worker response types
interface ProgressResponse {
	type: "PROGRESS";
	jobId: string;
	message: string;
}

interface SuccessResponse {
	type: "SUCCESS";
	jobId: string;
	result: ArrayBuffer;
}

interface ErrorResponse {
	type: "ERROR";
	jobId: string;
	error: string;
}

type WorkerResponse = ProgressResponse | SuccessResponse | ErrorResponse;

interface UseImageConverterWorkerOptions {
	onProgress?: (jobId: string, message: string) => void;
	onSuccess?: (jobId: string, result: ArrayBuffer) => void;
	onError?: (jobId: string, error: string) => void;
}

export function useImageConverterWorker({ onProgress, onSuccess, onError }: UseImageConverterWorkerOptions) {
	const workerRef = useRef<Worker | null>(null);
	const statusHandler = useRef({
		onProgress,
		onSuccess,
		onError,
	});

	useEffect(() => {
		statusHandler.current.onProgress = onProgress;
		statusHandler.current.onSuccess = onSuccess;
		statusHandler.current.onError = onError;
	}, [onProgress, onSuccess, onError]);

	const convertImage = useCallback(
		async (
			jobId: string,
			imageData: ArrayBuffer,
			targetFormat: string,
			settings: { quality?: number; compression?: number },
		): Promise<ArrayBuffer> => {
			if (workerRef.current) {
				workerRef.current.terminate();
			}

			const worker = new Worker(new URL("./image-converter.worker.ts", import.meta.url), { type: "module" });
			workerRef.current = worker;

			worker.postMessage(
				{
					type: "CONVERT_IMAGE",
					jobId,
					imageData,
					targetFormat,
					settings,
				},
				[imageData],
			);

			return new Promise((resolve, reject) => {
				worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
					const response = event.data;
					switch (response.type) {
						case "PROGRESS":
							statusHandler.current.onProgress?.(response.jobId, response.message);
							break;
						case "SUCCESS":
							statusHandler.current.onSuccess?.(response.jobId, response.result);
							resolve(response.result);
							worker.terminate();
							workerRef.current = null;
							break;
						case "ERROR":
							statusHandler.current.onError?.(response.jobId, response.error);
							reject(new Error(response.error));
							worker.terminate();
							workerRef.current = null;
							break;
					}
				};
			});
		},
		[],
	);

	const terminateWorker = useCallback(() => {
		if (workerRef.current) {
			workerRef.current.terminate();
			workerRef.current = null;
		}
	}, []);

	useEffect(() => {
		return () => {
			terminateWorker();
		};
	}, [terminateWorker]);

	return {
		convertImage,
		terminateWorker,
	};
}
