/// <reference lib="webworker" />

declare const self: DedicatedWorkerGlobalScope;

import {
	ALL_FORMATS,
	AudioSample,
	AudioSampleSink,
	AudioSampleSource,
	BlobSource,
	CanvasSource,
	canEncodeAudio,
	canEncodeVideo,
	Input,
	Mp4OutputFormat,
	Output,
	StreamTarget,
	type StreamTargetChunk,
	VideoSampleSink,
} from "mediabunny";
import type { FilterType } from "../shaders";
import { createVideoEditorPipeline } from "../webgl";
import type { ExportParams, ExportProgress, Mp4ExportWorkerRequest } from "./mp4-export-worker-types";

const EXPORT_FPS = 30;
const VIDEO_KEYFRAME_INTERVAL_SECONDS = 2;

function createOPFSWritableStream(syncHandle: FileSystemSyncAccessHandle): WritableStream<StreamTargetChunk> {
	return new WritableStream<StreamTargetChunk>({
		write(chunk) {
			if (chunk.type === "write") {
				syncHandle.write(chunk.data, { at: chunk.position });
			}
		},
		close() {
			syncHandle.close();
		},
	});
}

async function encodeVideoTrackInWorker(props: {
	canvas: OffscreenCanvas;
	canvasSource: CanvasSource;
	durationSec: number;
	exportFps: number;
	filterType: FilterType;
	getAborted?: () => Promise<boolean>;
	intensity: number;
	onProgress: (percent: number) => void;
	sampleSink: VideoSampleSink;
	startTimestampSec: number;
	width: number;
	height: number;
}): Promise<void> {
	const pipeline = createVideoEditorPipeline(props.canvas, undefined, {
		finishAfterRender: true,
	});
	if (!pipeline) {
		throw new Error("Unable to create WebGL pipeline for export.");
	}
	const fps = props.exportFps > 0 ? props.exportFps : EXPORT_FPS;
	const useFixedFps = props.exportFps > 0;
	const frameDurationSec = 1 / props.exportFps;
	try {
		let outputTimeSec = 0;
		for await (const sample of props.sampleSink.samples(props.startTimestampSec)) {
			let stage = "timing";
			let frame: VideoFrame | null = null;
			try {
				const durationSec = sample.duration > 0 ? sample.duration : 1 / fps;
				const startSec = sample.timestamp - props.startTimestampSec;
				const endSec = startSec + durationSec;
				const visibleStartSec = Math.max(0, startSec);
				const visibleEndSec = Math.max(0, endSec);
				const visibleDurationSec = visibleEndSec - visibleStartSec;
				if (visibleDurationSec <= 0) {
					sample.close();
					continue;
				}
				stage = "sample.toVideoFrame";
				frame = sample.toVideoFrame();
				stage = "pipeline.render";
				pipeline.render(
					{
						filterType: props.filterType,
						intensity: props.intensity,
						time: Math.floor(visibleStartSec),
					},
					frame,
				);
				stage = "canvasSource.add";
				if (useFixedFps) {
					if (outputTimeSec < visibleStartSec) {
						outputTimeSec = Math.ceil(visibleStartSec * props.exportFps) / props.exportFps;
					}
					while (outputTimeSec < visibleEndSec && outputTimeSec < props.durationSec) {
						await props.canvasSource.add(outputTimeSec, frameDurationSec);
						outputTimeSec += frameDurationSec;
						await throwIfAborted(props.getAborted);
						if (props.durationSec > 0) {
							props.onProgress(Math.min(100, (outputTimeSec / props.durationSec) * 100));
						}
					}
				} else {
					await props.canvasSource.add(visibleStartSec, visibleDurationSec);
					await throwIfAborted(props.getAborted);
					if (props.durationSec > 0) {
						props.onProgress(Math.min(100, (visibleEndSec / props.durationSec) * 100));
					}
				}
			} catch (err) {
				if (err instanceof DOMException && err.name === "AbortError") throw err;
				const message = err instanceof Error ? err.message : String(err);
				throw new Error(
					`Video export frame failure at ${stage} (ts=${sample.timestamp.toFixed(6)}, dur=${sample.duration.toFixed(6)}): ${message}`,
				);
			} finally {
				frame?.close();
				sample.close();
			}
		}
	} finally {
		pipeline.destroy();
	}
}

async function throwIfAborted(getAborted: (() => Promise<boolean>) | undefined): Promise<void> {
	if (!getAborted) return;
	if (await getAborted()) throw new DOMException("Aborted", "AbortError");
}

function applyGainToSample(sample: AudioSample, gain: number): AudioSample {
	const { format, numberOfChannels, numberOfFrames, sampleRate, timestamp } = sample;
	const f32Formats = ["f32-planar", "f32"];
	if (!f32Formats.includes(format)) {
		return sample.clone();
	}
	const bytesPerFloat = 4;
	let buffer: ArrayBuffer;
	if (format === "f32-planar") {
		buffer = new ArrayBuffer(numberOfChannels * numberOfFrames * bytesPerFloat);
		for (let ch = 0; ch < numberOfChannels; ch++) {
			const dest = new Float32Array(buffer, ch * numberOfFrames * bytesPerFloat, numberOfFrames);
			sample.copyTo(dest, { planeIndex: ch });
			for (let i = 0; i < numberOfFrames; i++) {
				dest[i] *= gain;
			}
		}
	} else {
		buffer = new ArrayBuffer(numberOfChannels * numberOfFrames * bytesPerFloat);
		const dest = new Float32Array(buffer);
		sample.copyTo(dest, { planeIndex: 0 });
		for (let i = 0; i < dest.length; i++) {
			dest[i] *= gain;
		}
	}
	return new AudioSample({ data: buffer, format, numberOfChannels, sampleRate, timestamp });
}

async function runExportImpl(
	params: ExportParams,
	onProgress: (p: ExportProgress) => void,
	getAborted?: () => Promise<boolean>,
	onTempFileCreated?: (tempFileName: string) => void,
): Promise<string> {
	await throwIfAborted(getAborted);

	const root = await navigator.storage.getDirectory();
	const tempFileName = `temp-export-${Date.now()}.mp4`;
	const fileHandle = await root.getFileHandle(tempFileName, { create: true });
	const syncHandle = await (
		fileHandle as FileSystemFileHandle & { createSyncAccessHandle?: () => Promise<FileSystemSyncAccessHandle> }
	).createSyncAccessHandle?.();
	if (!syncHandle) {
		throw new Error("OPFS sync access is not available.");
	}
	try {
		onTempFileCreated?.(tempFileName);
	} catch {}

	onProgress({ step: "demux", percent: 0 });
	await throwIfAborted(getAborted);

	const input = new Input({
		formats: ALL_FORMATS,
		source: new BlobSource(new Blob([params.fileBuffer])),
	});
	const primaryVideoTrack = await input.getPrimaryVideoTrack();
	await throwIfAborted(getAborted);
	if (!primaryVideoTrack) {
		input.dispose();
		throw new Error("No video track found in input file.");
	}
	const canDecode = await primaryVideoTrack.canDecode();
	if (!canDecode) {
		input.dispose();
		throw new Error("This browser cannot decode the input video's codec.");
	}
	const trackStartTimestampSec = await primaryVideoTrack.getFirstTimestamp();
	const trackEndTimestampSec = await primaryVideoTrack.computeDuration();
	const trackDurationSec = Math.max(0.001, trackEndTimestampSec - trackStartTimestampSec);
	const sampleSink = new VideoSampleSink(primaryVideoTrack);
	const width = primaryVideoTrack.displayWidth;
	const height = primaryVideoTrack.displayHeight;
	if (width <= 0 || height <= 0) {
		input.dispose();
		throw new Error("Invalid source video dimensions.");
	}

	const videoBitrate = Math.max(2_000_000, Math.floor(width * height * 6));
	const videoCodec = params.videoCodec as import("mediabunny").VideoCodec;
	const canEncodeV = await canEncodeVideo(videoCodec, {
		width,
		height,
		bitrate: videoBitrate,
	});
	if (!canEncodeV) {
		input.dispose();
		throw new Error(`This browser cannot encode video codec "${params.videoCodec}".`);
	}
	await throwIfAborted(getAborted);

	const primaryAudioTrack = await input.getPrimaryAudioTrack();
	let audioSampleSink: AudioSampleSink | null = null;
	if (primaryAudioTrack) {
		const canDecodeAudio = await primaryAudioTrack.canDecode();
		if (!canDecodeAudio) {
			input.dispose();
			throw new Error("This browser cannot decode the input audio's codec.");
		}
		const audioCodec = params.audioCodec as import("mediabunny").AudioCodec;
		const canEncodeA = await canEncodeAudio(audioCodec, {
			numberOfChannels: primaryAudioTrack.numberOfChannels,
			sampleRate: primaryAudioTrack.sampleRate,
			bitrate: 128_000,
		});
		if (!canEncodeA) {
			input.dispose();
			throw new Error(`This browser cannot encode audio codec "${params.audioCodec}".`);
		}
		audioSampleSink = new AudioSampleSink(primaryAudioTrack);
	}
	await throwIfAborted(getAborted);

	const writable = createOPFSWritableStream(syncHandle);
	const target = new StreamTarget(writable);
	const output = new Output({
		format: new Mp4OutputFormat({ fastStart: false }),
		target,
	});

	const canvas = new OffscreenCanvas(width, height);
	const canvasSource = new CanvasSource(canvas, {
		codec: videoCodec,
		bitrate: videoBitrate,
		keyFrameInterval: VIDEO_KEYFRAME_INTERVAL_SECONDS,
	});
	output.addVideoTrack(canvasSource);

	let audioSource: AudioSampleSource | null = null;
	if (audioSampleSink) {
		audioSource = new AudioSampleSource({
			codec: params.audioCodec as import("mediabunny").AudioCodec,
			bitrate: 128_000,
		});
		output.addAudioTrack(audioSource);
	}

	await output.start();

	onProgress({ step: "audio", percent: 0 });
	await throwIfAborted(getAborted);
	if (audioSource && audioSampleSink) {
		const gain = params.gain ?? 1;
		for await (const sample of audioSampleSink.samples(trackStartTimestampSec, trackEndTimestampSec)) {
			try {
				await throwIfAborted(getAborted);
				const sampleToAdd = gain !== 1 ? applyGainToSample(sample, gain) : sample;
				await audioSource.add(sampleToAdd);
				if (sampleToAdd !== sample) {
					sampleToAdd.close();
				}
			} finally {
				sample.close();
			}
		}
	}
	onProgress({ step: "audio", percent: 100 });
	await throwIfAborted(getAborted);

	onProgress({ step: "video", percent: 0 });
	await encodeVideoTrackInWorker({
		canvas,
		canvasSource,
		durationSec: trackDurationSec,
		exportFps: params.framerate,
		filterType: params.filterType,
		getAborted,
		intensity: params.intensity,
		onProgress: (percent) => onProgress({ step: "video", percent }),
		sampleSink,
		startTimestampSec: trackStartTimestampSec,
		width,
		height,
	});
	canvasSource.close();
	audioSource?.close();

	await throwIfAborted(getAborted);

	onProgress({ step: "mux", percent: 0 });
	await output.finalize();
	input.dispose();

	onProgress({ step: "mux", percent: 100 });
	return tempFileName;
}

let abortController: AbortController | null = null;
let currentExportId: string | null = null;

async function handleRunExport(id: string, params: ExportParams): Promise<void> {
	currentExportId = id;
	abortController = new AbortController();
	const getAborted = () => Promise.resolve(abortController?.signal.aborted ?? false);

	const onProgress = (p: ExportProgress) => {
		self.postMessage({
			type: "PROGRESS",
			id,
			step: p.step,
			percent: p.percent,
		} satisfies import("./mp4-export-worker-types").Mp4ExportWorkerResponse);
	};

	const onTempFileCreated = (tempFileName: string) => {
		self.postMessage({
			type: "TEMP_FILE_CREATED",
			id,
			tempFileName,
		} satisfies import("./mp4-export-worker-types").Mp4ExportWorkerResponse);
	};

	try {
		const tempFileName = await runExportImpl(params, onProgress, getAborted, onTempFileCreated);
		self.postMessage({
			type: "SUCCESS",
			id,
			tempFileName,
		} satisfies import("./mp4-export-worker-types").Mp4ExportWorkerResponse);
	} catch (err) {
		if ((err as { name?: string }).name === "AbortError") {
			self.postMessage({ type: "CANCELLED", id } satisfies import("./mp4-export-worker-types").Mp4ExportWorkerResponse);
		} else {
			const message = err instanceof Error ? err.message : String(err);
			self.postMessage({
				type: "ERROR",
				id,
				message,
			} satisfies import("./mp4-export-worker-types").Mp4ExportWorkerResponse);
		}
	} finally {
		currentExportId = null;
		abortController = null;
	}
}

self.addEventListener("message", (event: MessageEvent<Mp4ExportWorkerRequest>) => {
	const msg = event.data;
	if (!msg || typeof msg !== "object") return;

	if (msg.type === "RUN_EXPORT") {
		handleRunExport(msg.id, msg.params);
		return;
	}
	if (msg.type === "ABORT") {
		if (msg.id === currentExportId && abortController) {
			abortController.abort();
		}
		return;
	}
});
