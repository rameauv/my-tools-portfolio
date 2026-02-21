import { fromSerializedError, WorkerJobBusyError } from "./videoEditorErrors";
import { canStartJob, releaseJob, tryAcquireJob } from "./videoEditorWorkers";
import type { WorkerResponse } from "./worker/transcription.worker";

export interface TranscriptionResultPayload {
	text: string;
	chunks: Array<{
		id: string;
		timestamp: [number, number];
		text: string;
		words: Array<{ timestamp: [number, number]; text: string }>;
	}>;
}

export interface TranscriptionProgressEvent {
	type: "progress";
	message: string;
	percentage: number;
}

export interface TranscriptionSuccessEvent {
	type: "success";
	result: TranscriptionResultPayload;
}

export interface TranscriptionCancelledEvent {
	type: "cancelled";
}

export type TranscriptionEvent = TranscriptionProgressEvent | TranscriptionSuccessEvent | TranscriptionCancelledEvent;

export interface TranscribeVideoCallbacks {
	onEvent: (event: TranscriptionEvent) => void;
	onError: (error: Error) => void;
	signal?: AbortSignal;
}

export function transcribeVideo(
	file: File,
	modelId: string,
	powerPreference: "high-performance" | "low-power",
	language: string,
	callbacks: TranscribeVideoCallbacks,
): () => void {
	const { onEvent, onError, signal } = callbacks;
	if (!canStartJob("transcription")) {
		onError(new WorkerJobBusyError());
		return () => {};
	}
	const worker = new Worker(new URL("./worker/transcription.worker.ts", import.meta.url), { type: "module" });
	const jobId = crypto.randomUUID();
	if (!tryAcquireJob("transcription", worker, jobId)) {
		worker.terminate();
		onError(new WorkerJobBusyError());
		return () => {};
	}

	const release = () => {
		releaseJob();
	};

	const cleanup = () => {
		worker.postMessage({ type: "CANCEL", jobId });
		setTimeout(() => {
			release();
			worker.terminate();
		}, 100);
	};

	signal?.addEventListener("abort", cleanup);

	worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
		const data = event.data;
		if (data.jobId !== jobId) return;
		console.log(data);

		switch (data.type) {
			case "PROGRESS":
				onEvent({ type: "progress", message: data.progress, percentage: data.percentage });
				break;
			case "SUCCESS":
				release();
				onEvent({ type: "success", result: data.result });
				worker.terminate();
				break;
			case "ERROR":
				release();
				onError(fromSerializedError(data.error));
				worker.terminate();
				break;
			case "CANCELLED":
				release();
				onEvent({ type: "cancelled" });
				worker.terminate();
				break;
		}
	};

	worker.onerror = (error) => {
		release();
		onError(fromSerializedError({ message: error.message || "Worker error", code: "TranscriptionWorker" }));
		worker.terminate();
	};

	worker.postMessage({
		type: "PROCESS_AUDIO",
		jobId,
		file,
		modelId,
		powerPreference,
		language,
	});

	return cleanup;
}
