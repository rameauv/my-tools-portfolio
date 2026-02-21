import * as MP4Box from "mp4box";
import { useCallback, useEffect, useRef, useState } from "react";

type StatusKey = "decode" | "demux" | "fetch" | "render";

export type WebCodecsStatus = Record<StatusKey, string>;

export type UseWebCodecsDecoderOptions = {
	file: File | null;
};

export type UseWebCodecsDecoderResult = {
	durationSec: number;
	frameCount: number;
	getFrameForTimeSec: (timeSec: number) => VideoFrame | null;
	getMediaTimeSec: () => number;
	hasAudio: boolean;
	isDecoding: boolean;
	pauseAudio: () => Promise<void>;
	playAudioFromTimeSec: (timeSec: number) => Promise<void>;
	reportRenderedFrame: () => void;
	reset: () => void;
	seekAudioToTimeSec: (timeSec: number) => Promise<void>;
	status: WebCodecsStatus;
};

type DecodedAudioData = {
	durationUs: number;
	numberOfChannels: number;
	numberOfFrames: number;
	planes: Float32Array[];
	sampleRate: number;
	timestampUs: number;
};

type DecodedFrame = {
	frame: VideoFrame;
	timestampUs: number;
};

type Mp4Track = {
	audio?: {
		channel_count: number;
		sample_rate: number;
	};
	codec: string;
	duration: number;
	id: number;
	timescale: number;
	video?: {
		height: number;
		width: number;
	};
};

type Mp4Info = {
	audioTracks: Mp4Track[];
	duration: number;
	timescale: number;
	videoTracks: Mp4Track[];
};

type Mp4Sample = {
	cts: number;
	data: BufferSource;
	duration: number;
	is_sync: boolean;
	timescale: number;
};

type Mp4DescriptionBox = {
	write: (stream: { buffer: ArrayBuffer }) => void;
};

type Mp4EsdsNode = {
	descs?: Array<{
		descs?: Array<{ data?: Uint8Array }>;
	}>;
};

type Mp4SampleDescriptionEntry = {
	av1C?: Mp4DescriptionBox;
	avcC?: Mp4DescriptionBox;
	esds?: {
		esd?: Mp4EsdsNode;
	};
	hvcC?: Mp4DescriptionBox;
	vpcC?: Mp4DescriptionBox;
};

type Mp4FileTrackNode = {
	mdia?: {
		minf?: {
			stbl?: {
				stsd?: {
					entries?: Mp4SampleDescriptionEntry[];
				};
			};
		};
	};
};

type Mp4FileLike = {
	appendBuffer: (buffer: ArrayBuffer) => void;
	flush: () => void;
	getTrackById: (trackId: number) => Mp4FileTrackNode | undefined;
	onError?: (error: unknown) => void;
	onReady?: (info: Mp4Info) => void;
	onSamples?: (trackId: number, ref: unknown, samples: Mp4Sample[]) => void;
	setExtractionOptions: (trackId: number) => void;
	start: () => void;
	stop?: () => void;
};

type DataStreamCtor = {
	new (buffer: ArrayBuffer | undefined, byteOffset: number, endianness: number): { buffer: ArrayBuffer };
	BIG_ENDIAN: number;
};

type Mp4BoxModuleLike = {
	createFile: () => Mp4FileLike;
	DataStream?: DataStreamCtor;
};

const MP4BoxModule = MP4Box as unknown as Mp4BoxModuleLike;

const INITIAL_STATUS: WebCodecsStatus = {
	fetch: "Not started",
	demux: "Not started",
	decode: "Not started",
	render: "Not started",
};

const normalizeCodec = (codec: string): string => {
	if (codec.startsWith("vp08")) return "vp8";
	return codec;
};

const clampToDuration = (timeSec: number, durationSec: number): number => {
	if (timeSec <= 0) return 0;
	if (durationSec <= 0) return Math.max(0, timeSec);
	return Math.min(timeSec, durationSec);
};

const extractVideoDescription = (mp4File: Mp4FileLike, trackId: number): Uint8Array | undefined => {
	try {
		const track = mp4File.getTrackById(trackId);
		const entries = track?.mdia?.minf?.stbl?.stsd?.entries ?? [];
		for (const entry of entries) {
			const box = entry.avcC ?? entry.hvcC ?? entry.vpcC ?? entry.av1C;
			if (!box) continue;
			const dataStreamCtor =
				(globalThis as unknown as { DataStream?: DataStreamCtor }).DataStream ?? MP4BoxModule.DataStream;
			if (!dataStreamCtor) return undefined;
			const stream = new dataStreamCtor(undefined, 0, dataStreamCtor.BIG_ENDIAN);
			box.write(stream);
			return new Uint8Array(stream.buffer, 8);
		}
	} catch {
		return undefined;
	}
	return undefined;
};

const extractAudioDescription = (mp4File: Mp4FileLike, trackId: number): Uint8Array | undefined => {
	try {
		const track = mp4File.getTrackById(trackId);
		const entries = track?.mdia?.minf?.stbl?.stsd?.entries ?? [];
		for (const entry of entries) {
			const decoderSpecific = entry.esds?.esd?.descs?.[0]?.descs?.[0]?.data;
			if (!decoderSpecific) continue;
			return decoderSpecific;
		}
	} catch {
		return undefined;
	}
	return undefined;
};

const disposeFrames = (frames: DecodedFrame[]) => {
	for (const item of frames) item.frame.close();
	frames.length = 0;
};

export const useWebCodecsDecoder = (props: UseWebCodecsDecoderOptions): UseWebCodecsDecoderResult => {
	const [status, setStatus] = useState<WebCodecsStatus>(INITIAL_STATUS);
	const [durationSec, setDurationSec] = useState(0);
	const [frameCount, setFrameCount] = useState(0);
	const [isDecoding, setIsDecoding] = useState(false);
	const [hasAudio, setHasAudio] = useState(false);

	const framesRef = useRef<DecodedFrame[]>([]);
	const decodedAudioRef = useRef<DecodedAudioData[]>([]);
	const audioBufferRef = useRef<AudioBuffer | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);
	const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
	const audioIsPlayingRef = useRef(false);
	const audioStartedAtContextSecRef = useRef(0);
	const audioStartedAtMediaSecRef = useRef(0);
	const pausedMediaTimeSecRef = useRef(0);

	const videoDecoderRef = useRef<VideoDecoder | null>(null);
	const audioDecoderRef = useRef<AudioDecoder | null>(null);
	const videoBaseTimestampUsRef = useRef<number | null>(null);
	const audioBaseTimestampUsRef = useRef<number | null>(null);
	const videoTrackIdRef = useRef<number | null>(null);
	const audioTrackIdRef = useRef<number | null>(null);

	const renderStartMsRef = useRef<number | null>(null);
	const renderCountRef = useRef(0);
	const lastRenderStatusMsRef = useRef(0);

	const setStatusValue = useCallback((key: StatusKey, value: string) => {
		setStatus((previous) => ({ ...previous, [key]: value }));
	}, []);

	const clearAudioSource = useCallback(() => {
		if (!audioSourceRef.current) return;
		try {
			audioSourceRef.current.onended = null;
			audioSourceRef.current.stop();
		} catch {
			// Ignore source stop errors.
		}
		audioSourceRef.current.disconnect();
		audioSourceRef.current = null;
	}, []);

	const clearAudio = useCallback(async () => {
		clearAudioSource();
		audioIsPlayingRef.current = false;
		pausedMediaTimeSecRef.current = 0;
		audioBufferRef.current = null;
		decodedAudioRef.current = [];
		if (audioContextRef.current) {
			try {
				await audioContextRef.current.close();
			} catch {
				// Ignore context close errors.
			}
		}
		audioContextRef.current = null;
		gainNodeRef.current = null;
	}, [clearAudioSource]);

	const clearDecoders = useCallback(() => {
		if (videoDecoderRef.current) {
			try {
				videoDecoderRef.current.reset();
				videoDecoderRef.current.close();
			} catch {
				// Ignore shutdown errors from partially configured decoders.
			}
		}
		if (audioDecoderRef.current) {
			try {
				audioDecoderRef.current.reset();
				audioDecoderRef.current.close();
			} catch {
				// Ignore shutdown errors from partially configured decoders.
			}
		}
		videoDecoderRef.current = null;
		audioDecoderRef.current = null;
	}, []);

	const reset = useCallback(() => {
		clearDecoders();
		disposeFrames(framesRef.current);
		videoBaseTimestampUsRef.current = null;
		audioBaseTimestampUsRef.current = null;
		videoTrackIdRef.current = null;
		audioTrackIdRef.current = null;
		renderStartMsRef.current = null;
		renderCountRef.current = 0;
		lastRenderStatusMsRef.current = 0;
		setDurationSec(0);
		setFrameCount(0);
		setIsDecoding(false);
		setHasAudio(false);
		setStatus(INITIAL_STATUS);
		void clearAudio();
	}, [clearAudio, clearDecoders]);

	const getFrameForTimeSec = useCallback((timeSec: number): VideoFrame | null => {
		const frames = framesRef.current;
		if (frames.length === 0) return null;

		const targetUs = Math.max(0, Math.floor(timeSec * 1_000_000));
		let low = 0;
		let high = frames.length - 1;
		let winnerIndex = 0;

		while (low <= high) {
			const middle = Math.floor((low + high) / 2);
			const timestamp = frames[middle]?.timestampUs ?? 0;
			if (timestamp <= targetUs) {
				winnerIndex = middle;
				low = middle + 1;
			} else {
				high = middle - 1;
			}
		}

		const winner = frames[winnerIndex];
		return winner ? new VideoFrame(winner.frame) : null;
	}, []);

	const buildAudioBuffer = useCallback(async (): Promise<AudioBuffer | null> => {
		if (audioBufferRef.current) return audioBufferRef.current;
		const decodedAudio = decodedAudioRef.current;
		if (decodedAudio.length === 0) return null;

		const sampleRate = decodedAudio[0].sampleRate;
		const channelCount = decodedAudio[0].numberOfChannels;
		const maxTimestampUs = decodedAudio.reduce((max, item) => Math.max(max, item.timestampUs + item.durationUs), 0);
		const totalFrames = Math.max(1, Math.ceil((maxTimestampUs / 1_000_000) * sampleRate));
		const context = new AudioContext({ latencyHint: "playback", sampleRate });
		await context.suspend();

		const gainNode = context.createGain();
		gainNode.gain.value = 1;
		gainNode.connect(context.destination);

		const audioBuffer = context.createBuffer(channelCount, totalFrames, sampleRate);
		for (const block of decodedAudio) {
			const offsetFrames = Math.max(0, Math.floor((block.timestampUs / 1_000_000) * sampleRate));
			for (let channel = 0; channel < block.numberOfChannels; channel++) {
				const channelData = audioBuffer.getChannelData(channel);
				const source = block.planes[channel];
				if (!source) continue;
				channelData.set(source, Math.min(offsetFrames, Math.max(0, channelData.length - source.length)));
			}
		}

		audioBufferRef.current = audioBuffer;
		audioContextRef.current = context;
		gainNodeRef.current = gainNode;
		return audioBuffer;
	}, []);

	const getMediaTimeSec = useCallback((): number => {
		if (!audioIsPlayingRef.current) return pausedMediaTimeSecRef.current;
		const context = audioContextRef.current;
		if (!context) return pausedMediaTimeSecRef.current;
		return audioStartedAtMediaSecRef.current + (context.currentTime - audioStartedAtContextSecRef.current);
	}, []);

	const playAudioFromTimeSec = useCallback(
		async (timeSec: number) => {
			const buffer = await buildAudioBuffer();
			if (!buffer || !audioContextRef.current || !gainNodeRef.current) {
				pausedMediaTimeSecRef.current = timeSec;
				return;
			}

			const context = audioContextRef.current;
			clearAudioSource();

			const startAt = clampToDuration(timeSec, durationSec);
			const source = context.createBufferSource();
			source.buffer = buffer;
			source.connect(gainNodeRef.current);
			source.onended = () => {
				if (!audioIsPlayingRef.current) return;
				audioIsPlayingRef.current = false;
				pausedMediaTimeSecRef.current = durationSec;
			};
			source.start(0, startAt);
			audioSourceRef.current = source;
			audioStartedAtContextSecRef.current = context.currentTime;
			audioStartedAtMediaSecRef.current = startAt;
			pausedMediaTimeSecRef.current = startAt;
			audioIsPlayingRef.current = true;
			await context.resume();
		},
		[buildAudioBuffer, clearAudioSource, durationSec],
	);

	const pauseAudio = useCallback(async () => {
		pausedMediaTimeSecRef.current = clampToDuration(getMediaTimeSec(), durationSec);
		audioIsPlayingRef.current = false;
		clearAudioSource();
		if (audioContextRef.current && audioContextRef.current.state === "running") {
			await audioContextRef.current.suspend();
		}
	}, [clearAudioSource, durationSec, getMediaTimeSec]);

	const seekAudioToTimeSec = useCallback(
		async (timeSec: number) => {
			const next = clampToDuration(timeSec, durationSec);
			const wasPlaying = audioIsPlayingRef.current;
			pausedMediaTimeSecRef.current = next;
			if (!hasAudio) return;
			if (!wasPlaying) return;
			await playAudioFromTimeSec(next);
		},
		[durationSec, hasAudio, playAudioFromTimeSec],
	);

	const reportRenderedFrame = useCallback(() => {
		const now = performance.now();
		if (renderStartMsRef.current === null) renderStartMsRef.current = now;
		renderCountRef.current += 1;

		if (now - lastRenderStatusMsRef.current < 250) return;
		lastRenderStatusMsRef.current = now;
		const elapsedSec = (now - (renderStartMsRef.current ?? now)) / 1000;
		if (elapsedSec <= 0) return;
		const fps = renderCountRef.current / elapsedSec;
		setStatusValue("render", `${fps.toFixed(0)} fps`);
	}, [setStatusValue]);

	useEffect(() => {
		if (!props.file) {
			reset();
			return;
		}

		const sourceFile = props.file;
		reset();
		setIsDecoding(true);
		let cancelled = false;
		let mp4File: Mp4FileLike | null = null;

		const onVideoOutput = (frame: VideoFrame) => {
			if (cancelled) {
				frame.close();
				return;
			}
			const timestampUs = frame.timestamp ?? 0;
			framesRef.current.push({ frame, timestampUs });
			setFrameCount(framesRef.current.length);
			setStatusValue("decode", `V:${framesRef.current.length} A:${decodedAudioRef.current.length}`);
		};

		const onAudioOutput = (audioData: AudioData) => {
			if (cancelled) {
				audioData.close();
				return;
			}
			const planes: Float32Array[] = [];
			for (let index = 0; index < audioData.numberOfChannels; index++) {
				const plane = new Float32Array(audioData.numberOfFrames);
				audioData.copyTo(plane, { planeIndex: index, format: "f32-planar" });
				planes.push(plane);
			}
			decodedAudioRef.current.push({
				timestampUs: audioData.timestamp ?? 0,
				durationUs: audioData.duration ?? Math.floor((audioData.numberOfFrames / audioData.sampleRate) * 1_000_000),
				numberOfChannels: audioData.numberOfChannels,
				numberOfFrames: audioData.numberOfFrames,
				sampleRate: audioData.sampleRate,
				planes,
			});
			audioData.close();
			setStatusValue("decode", `V:${framesRef.current.length} A:${decodedAudioRef.current.length}`);
		};

		const run = async () => {
			try {
				const videoDecoder = new VideoDecoder({
					output: onVideoOutput,
					error: (error) => setStatusValue("decode", `Video: ${String(error)}`),
				});
				videoDecoderRef.current = videoDecoder;

				const audioDecoder = new AudioDecoder({
					output: onAudioOutput,
					error: (error) => setStatusValue("decode", `Audio: ${String(error)}`),
				});
				audioDecoderRef.current = audioDecoder;

				mp4File = MP4BoxModule.createFile();
				mp4File.onError = (error: unknown) => setStatusValue("demux", String(error));

				mp4File.onReady = (info: Mp4Info) => {
					if (cancelled || !mp4File) return;

					const videoTrack = info.videoTracks?.[0];
					const audioTrack = info.audioTracks?.[0];
					if (!videoTrack) {
						setStatusValue("demux", "No video track found");
						return;
					}

					setHasAudio(Boolean(audioTrack));
					setStatusValue("demux", audioTrack ? "Audio+Video ready" : "Video-only ready");
					videoTrackIdRef.current = videoTrack.id;
					audioTrackIdRef.current = audioTrack?.id ?? null;
					const resolvedDuration =
						videoTrack.timescale > 0 && videoTrack.duration > 0
							? videoTrack.duration / videoTrack.timescale
							: info.timescale > 0 && info.duration > 0
								? info.duration / info.timescale
								: 0;
					setDurationSec(resolvedDuration);

					const videoConfig: VideoDecoderConfig = {
						codec: normalizeCodec(videoTrack.codec),
						codedHeight: videoTrack.video?.height ?? 0,
						codedWidth: videoTrack.video?.width ?? 0,
					};
					const videoDescription = extractVideoDescription(mp4File, videoTrack.id);
					if (videoDescription) videoConfig.description = videoDescription;
					videoDecoder.configure(videoConfig);
					mp4File.setExtractionOptions(videoTrack.id);

					if (audioTrack) {
						const audioConfig: AudioDecoderConfig = {
							codec: audioTrack.codec,
							numberOfChannels: audioTrack.audio?.channel_count ?? 2,
							sampleRate: audioTrack.audio?.sample_rate ?? 48_000,
						};
						const audioDescription = extractAudioDescription(mp4File, audioTrack.id);
						if (audioDescription) audioConfig.description = audioDescription;
						audioDecoder.configure(audioConfig);
						mp4File.setExtractionOptions(audioTrack.id);
					}

					mp4File.start();
				};

				mp4File.onSamples = (trackId: number, _ref: unknown, samples: Mp4Sample[]) => {
					for (const sample of samples) {
						if (cancelled) return;
						const rawTimestampUs = (1_000_000 * sample.cts) / sample.timescale;
						const durationUs = Math.max(1, Math.floor((1_000_000 * sample.duration) / sample.timescale));

						// Keep both decoders in the same timeline by normalizing each track timestamp base to zero.
						if (videoDecoderRef.current && framesRef.current.length === 0 && videoBaseTimestampUsRef.current === null) {
							videoBaseTimestampUsRef.current = rawTimestampUs;
						}
						if (
							audioDecoderRef.current &&
							decodedAudioRef.current.length === 0 &&
							audioBaseTimestampUsRef.current === null
						) {
							audioBaseTimestampUsRef.current = rawTimestampUs;
						}

						const normalizedVideoTimestampUs = rawTimestampUs - (videoBaseTimestampUsRef.current ?? rawTimestampUs);
						const normalizedAudioTimestampUs = rawTimestampUs - (audioBaseTimestampUsRef.current ?? rawTimestampUs);

						if (trackId === videoTrackIdRef.current) {
							videoDecoder.decode(
								new EncodedVideoChunk({
									type: sample.is_sync ? "key" : "delta",
									timestamp: normalizedVideoTimestampUs,
									duration: durationUs,
									data: sample.data,
								}),
							);
						} else if (trackId === audioTrackIdRef.current) {
							audioDecoder.decode(
								new EncodedAudioChunk({
									type: sample.is_sync ? "key" : "delta",
									timestamp: normalizedAudioTimestampUs,
									duration: durationUs,
									data: sample.data,
								}),
							);
						}
					}
				};

				let offset = 0;
				const reader = sourceFile.stream().getReader();
				while (!cancelled) {
					const result = await reader.read();
					if (result.done) break;
					const chunk = result.value;
					if (!chunk) continue;
					const arrayBuffer = new ArrayBuffer(chunk.byteLength);
					new Uint8Array(arrayBuffer).set(chunk);
					const mp4Buffer = arrayBuffer as ArrayBuffer & { fileStart: number };
					mp4Buffer.fileStart = offset;
					offset += mp4Buffer.byteLength;
					setStatusValue("fetch", `${(offset / 1024 ** 2).toFixed(1)} MiB`);
					mp4File?.appendBuffer(mp4Buffer);
				}

				if (!cancelled) {
					setStatusValue("fetch", "Done");
					mp4File?.flush();
					await Promise.all([videoDecoder.flush(), audioDecoder.flush()]);
					setIsDecoding(false);
					setStatusValue("decode", `Decoded V:${framesRef.current.length} A:${decodedAudioRef.current.length}`);
				}
			} catch (error) {
				setStatusValue("decode", String(error));
				setIsDecoding(false);
			}
		};

		void run();

		return () => {
			cancelled = true;
			try {
				mp4File?.stop?.();
			} catch {
				// Ignore cleanup errors.
			}
			clearDecoders();
			disposeFrames(framesRef.current);
			void clearAudio();
			setFrameCount(0);
			setIsDecoding(false);
			setHasAudio(false);
		};
	}, [clearAudio, clearDecoders, props.file, reset, setStatusValue]);

	return {
		durationSec,
		frameCount,
		getFrameForTimeSec,
		getMediaTimeSec,
		hasAudio,
		isDecoding,
		pauseAudio,
		playAudioFromTimeSec,
		reportRenderedFrame,
		reset,
		seekAudioToTimeSec,
		status,
	};
};
