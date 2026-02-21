import {
	type AutomaticSpeechRecognitionOutput,
	type AutomaticSpeechRecognitionPipeline,
	env,
	pipeline,
} from "@huggingface/transformers";
import { ALL_FORMATS, AudioSampleSink, BlobSource, Input } from "mediabunny";
import type { VideoEditorErrorCode } from "../videoEditorErrors";
import {
	TranscriptionDecodeFailureError,
	TranscriptionNoAudioTrackError,
	TranscriptionPipelineInitError,
} from "../videoEditorErrors";

export interface ProcessAudioMessage {
	type: "PROCESS_AUDIO";
	jobId: string;
	file: File;
	modelId: string;
	powerPreference: "high-performance" | "low-power";
	language: string;
}

export interface CancelMessage {
	type: "CANCEL";
	jobId: string;
}

export type WorkerMessage = ProcessAudioMessage | CancelMessage;

export interface ProgressResponse {
	type: "PROGRESS";
	jobId: string;
	progress: string;
	percentage: number;
}

export interface SuccessResponse {
	type: "SUCCESS";
	jobId: string;
	result: {
		text: string;
		chunks: Array<{
			id: string;
			timestamp: [number, number];
			text: string;
			words: Array<{ timestamp: [number, number]; text: string }>;
		}>;
	};
}

export interface ErrorResponse {
	type: "ERROR";
	jobId: string;
	error: {
		message: string;
		code?: VideoEditorErrorCode;
	};
}

export interface CancelledResponse {
	type: "CANCELLED";
	jobId: string;
}

export type WorkerResponse = ProgressResponse | SuccessResponse | ErrorResponse | CancelledResponse;

let pipelineInstance: AutomaticSpeechRecognitionPipeline | null = null;
let currentJobId: string | null = null;
let abortController: AbortController | null = null;
let currentPipelineModelId: string | null = null;

async function extractAudio16kHz(blob: Blob, onProgress: (p: number) => void): Promise<Float32Array> {
	const input = new Input({
		formats: ALL_FORMATS,
		source: new BlobSource(blob),
	});

	try {
		const track = await input.getPrimaryAudioTrack();
		if (!track) {
			throw new TranscriptionNoAudioTrackError();
		}
		const canDecode = await track.canDecode();
		if (!canDecode) {
			throw new TranscriptionDecodeFailureError();
		}

		const sink = new AudioSampleSink(track);
		let duration = await track.computeDuration();
		if (!duration || duration <= 0) {
			duration = 1;
		}

		const TARGET_SAMPLE_RATE = 16000;
		const originalSampleRate = track.sampleRate;

		const chunks: Float32Array[] = [];
		let totalSourceSamples = 0;

		for await (const sample of sink.samples()) {
			try {
				if (abortController?.signal.aborted) {
					throw new DOMException("Aborted", "AbortError");
				}
				const audioData = sample.toAudioData();
				const format = audioData.format;
				if (!format) continue;

				const options = { planeIndex: 0 };
				const allocationSize = audioData.allocationSize(options);
				const buffer = new ArrayBuffer(allocationSize);
				audioData.copyTo(buffer, options);

				let floatData: Float32Array;
				if (format.includes("f32")) {
					floatData = new Float32Array(buffer);
				} else if (format.includes("s16")) {
					const intData = new Int16Array(buffer);
					floatData = new Float32Array(intData.length);
					for (let i = 0; i < intData.length; i++) {
						floatData[i] = intData[i] / 32768.0;
					}
				} else {
					console.warn("Unsupported audio format inside worker, trying Float32 fallback:", format);
					floatData = new Float32Array(buffer);
				}

				chunks.push(floatData);
				totalSourceSamples += floatData.length;

				if (duration > 0) {
					onProgress(Math.min(100, (sample.timestamp / duration) * 100));
				}
			} finally {
				sample.close();
			}
		}

		const fullSourceAudio = new Float32Array(totalSourceSamples);
		let offset = 0;
		for (const chunk of chunks) {
			fullSourceAudio.set(chunk, offset);
			offset += chunk.length;
		}

		const ratio = originalSampleRate / TARGET_SAMPLE_RATE;
		const targetSamples = Math.floor(totalSourceSamples / ratio);
		const resampledAudio = new Float32Array(targetSamples);

		for (let i = 0; i < targetSamples; i++) {
			const sourceIndex = i * ratio;
			const index1 = Math.floor(sourceIndex);
			const index2 = Math.min(index1 + 1, totalSourceSamples - 1);
			const fraction = sourceIndex - index1;
			resampledAudio[i] = fullSourceAudio[index1] * (1 - fraction) + fullSourceAudio[index2] * fraction;
		}

		return resampledAudio;
	} finally {
		input.dispose();
	}
}

async function initializePipeline(modelId: string, powerPreference: "high-performance" | "low-power"): Promise<void> {
	if (pipelineInstance && currentPipelineModelId === modelId) return;

	if (env.backends.onnx.webgpu) {
		env.backends.onnx.webgpu.powerPreference = powerPreference;
	}

	const asr = await pipeline("automatic-speech-recognition", modelId, {
		device: env.backends.onnx.webgpu ? "webgpu" : "wasm",
		progress_callback: (progressInfo: { status: string; progress?: number; file?: string }) => {
			if (!currentJobId) return;
			let progress = "";
			let percentage = 0;

			if (progressInfo?.status === "progress" && typeof progressInfo.progress === "number") {
				percentage = Math.round(progressInfo.progress);
				if (progressInfo.file) {
					progress = `Downloading ${progressInfo.file}... ${percentage}%`;
				} else {
					progress = `Loading model... ${percentage}%`;
				}
			} else if (progressInfo?.status === "done") {
				progress = progressInfo.file ? `Downloaded ${progressInfo.file}` : "Model ready";
				percentage = 100;
			} else if (progressInfo?.status === "ready") {
				progress = "Model ready";
				percentage = 100;
			} else if (progressInfo?.status) {
				progress = progressInfo.status.charAt(0).toUpperCase() + progressInfo.status.slice(1);
			}

			if (progress) {
				self.postMessage({
					type: "PROGRESS",
					jobId: currentJobId,
					progress,
					percentage,
				});
			}
		},
	});

	pipelineInstance = asr;
	currentPipelineModelId = modelId;
}

async function processAudioMessage(
	jobId: string,
	file: File,
	modelId: string,
	powerPreference: "high-performance" | "low-power",
	language: string,
): Promise<void> {
	currentJobId = jobId;
	abortController = new AbortController();

	try {
		await initializePipeline(modelId, powerPreference);

		if (!pipelineInstance) {
			throw new TranscriptionPipelineInitError();
		}

		self.postMessage({
			type: "PROGRESS",
			jobId,
			progress: "Extracting audio from video...",
			percentage: 0,
		});

		const audioData = await extractAudio16kHz(file, (p) => {
			self.postMessage({
				type: "PROGRESS",
				jobId,
				progress: "Extracting audio from video...",
				percentage: Math.round(p * 0.5), // Audio extraction is the first 50%
			});
		});

		if (abortController.signal.aborted) throw new DOMException("Aborted", "AbortError");

		self.postMessage({
			type: "PROGRESS",
			jobId,
			progress: "Transcribing audio...",
			percentage: 50,
		});

		const isWhisper = modelId.toLowerCase().includes("whisper");

		const outputs = await pipelineInstance(audioData, {
			return_timestamps: "word",
			chunk_length_s: 30,
			...(isWhisper ? { language } : {}),
		});

		if (abortController.signal.aborted) throw new DOMException("Aborted", "AbortError");

		let resultPayload: AutomaticSpeechRecognitionOutput;
		if (Array.isArray(outputs)) {
			resultPayload = outputs[0];
		} else {
			resultPayload = outputs;
		}

		const wordChunks = resultPayload.chunks || [];
		const sentenceChunks: Array<{
			id: string;
			timestamp: [number, number];
			text: string;
			words: Array<{ timestamp: [number, number]; text: string }>;
		}> = [];
		let currentSentence: {
			id: string;
			timestamp: [number, number];
			text: string;
			words: Array<{ timestamp: [number, number]; text: string }>;
		} | null = null;

		for (const chunk of wordChunks) {
			if (!chunk.timestamp) continue;

			const start = chunk.timestamp[0];
			const end = chunk.timestamp[1];
			const wordObj: { timestamp: [number, number]; text: string } = { timestamp: [start, end], text: chunk.text };

			if (!currentSentence) {
				currentSentence = { id: crypto.randomUUID(), timestamp: [start, end], text: chunk.text, words: [wordObj] };
			} else {
				const prevEnd = currentSentence.timestamp[1];
				if (prevEnd !== null && prevEnd !== undefined && start !== null && start - prevEnd > 1.5) {
					currentSentence.text = currentSentence.text.trim();
					sentenceChunks.push(currentSentence);
					currentSentence = { id: crypto.randomUUID(), timestamp: [start, end], text: chunk.text, words: [wordObj] };
				} else {
					if (end !== null && end !== undefined) {
						currentSentence.timestamp[1] = end;
					}
					currentSentence.text += chunk.text;
					currentSentence.words.push(wordObj);
				}
			}

			if (currentSentence && /[.!?]\s*$/.test(chunk.text)) {
				currentSentence.text = currentSentence.text.trim();
				sentenceChunks.push(currentSentence);
				currentSentence = null;
			}
		}

		if (currentSentence && currentSentence.text.trim().length > 0) {
			currentSentence.text = currentSentence.text.trim();
			sentenceChunks.push(currentSentence);
		}

		self.postMessage({
			type: "SUCCESS",
			jobId,
			result: {
				text: resultPayload.text,
				chunks: sentenceChunks,
			},
		});
	} catch (error: unknown) {
		const err = error as { name?: string; message?: string; code?: VideoEditorErrorCode };
		if (err.name === "AbortError" || err.message?.includes("abort")) {
			self.postMessage({ type: "CANCELLED", jobId });
		} else {
			self.postMessage({
				type: "ERROR",
				jobId,
				error: {
					message: err.message ?? "Unknown error during transcription.",
					code: err.code,
				},
			});
		}
	} finally {
		currentJobId = null;
		abortController = null;
	}
}

function cancelJob(jobId: string) {
	if (currentJobId === jobId && abortController) {
		abortController.abort();
	}
}

self.addEventListener("message", async (event: MessageEvent<WorkerMessage>) => {
	const message = event.data;
	switch (message.type) {
		case "PROCESS_AUDIO":
			await processAudioMessage(
				message.jobId,
				message.file,
				message.modelId,
				message.powerPreference,
				message.language,
			);
			self.close();
			break;
		case "CANCEL":
			cancelJob(message.jobId);
			break;
	}
});
