import { getEncodableAudioCodecs, getEncodableVideoCodecs, Mp4OutputFormat } from "mediabunny";

const mp4Format = new Mp4OutputFormat({ fastStart: false });
const MP4_VIDEO_CODECS = mp4Format.getSupportedVideoCodecs();
const MP4_AUDIO_CODECS = mp4Format.getSupportedAudioCodecs();

const VIDEO_CODEC_LABELS: Record<string, string> = {
	avc: "H.264 (AVC)",
	hevc: "H.265 (HEVC)",
	vp9: "VP9",
	av1: "AV1",
	vp8: "VP8",
};

const AUDIO_CODEC_LABELS: Record<string, string> = {
	aac: "AAC",
	opus: "Opus",
	mp3: "MP3",
	vorbis: "Vorbis",
	flac: "FLAC",
	ac3: "AC-3",
	eac3: "E-AC-3",
};

export const EXPORT_FRAMERATE_OPTIONS = [
	{ value: "source", label: "Source (variable)" },
	{ value: "24", label: "24 fps" },
	{ value: "25", label: "25 fps" },
	{ value: "30", label: "30 fps" },
	{ value: "60", label: "60 fps" },
] as const;

export type ExportFramerateOption = (typeof EXPORT_FRAMERATE_OPTIONS)[number]["value"];

export interface ExportCodecOption {
	value: string;
	label: string;
}

export interface ExportCodecSupport {
	audioCodecs: ExportCodecOption[];
	videoCodecs: ExportCodecOption[];
}

export async function getExportCodecSupport(dimensions: {
	width: number;
	height: number;
}): Promise<ExportCodecSupport> {
	const [encodableVideo, encodableAudio] = await Promise.all([
		getEncodableVideoCodecs([...MP4_VIDEO_CODECS], {
			width: dimensions.width,
			height: dimensions.height,
		}),
		getEncodableAudioCodecs([...MP4_AUDIO_CODECS], {
			numberOfChannels: 2,
			sampleRate: 48000,
		}),
	]);

	return {
		videoCodecs: encodableVideo.map((codec) => ({
			value: codec,
			label: VIDEO_CODEC_LABELS[codec] ?? codec.toUpperCase(),
		})),
		audioCodecs: encodableAudio.map((codec) => ({
			value: codec,
			label: AUDIO_CODEC_LABELS[codec] ?? codec.toUpperCase(),
		})),
	};
}

export const DEFAULT_EXPORT_VIDEO_CODEC = "avc";
export const DEFAULT_EXPORT_AUDIO_CODEC = "aac";
export const DEFAULT_EXPORT_FRAMERATE: ExportFramerateOption = "source";
