import { useQuery } from "@tanstack/react-query";
import type { ExportFramerateOption } from "../exportCodecOptions";
import {
	DEFAULT_EXPORT_AUDIO_CODEC,
	DEFAULT_EXPORT_FRAMERATE,
	DEFAULT_EXPORT_VIDEO_CODEC,
	getExportCodecSupport,
} from "../exportCodecOptions";

const DEFAULT_DIMENSIONS = { width: 1920, height: 1080 };

export type UseExportCodecSupportParams = {
	dimensions: { width: number; height: number } | null;
};

export type UseExportCodecSupportResult = {
	audioCodecs: { value: string; label: string }[];
	videoCodecs: { value: string; label: string }[];
	isLoading: boolean;
	defaultVideoCodec: string;
	defaultAudioCodec: string;
	defaultFramerate: ExportFramerateOption;
};

export function useExportCodecSupport(params: UseExportCodecSupportParams): UseExportCodecSupportResult {
	const dimensions = params.dimensions ?? DEFAULT_DIMENSIONS;

	const query = useQuery({
		queryKey: ["exportCodecSupport", dimensions.width, dimensions.height],
		queryFn: () => getExportCodecSupport(dimensions),
		staleTime: 60_000,
	});

	const data = query.data;
	const videoCodecs = data?.videoCodecs ?? [];
	const audioCodecs = data?.audioCodecs ?? [];

	const defaultVideoCodec = videoCodecs.some((c) => c.value === DEFAULT_EXPORT_VIDEO_CODEC)
		? DEFAULT_EXPORT_VIDEO_CODEC
		: (videoCodecs[0]?.value ?? DEFAULT_EXPORT_VIDEO_CODEC);
	const defaultAudioCodec = audioCodecs.some((c) => c.value === DEFAULT_EXPORT_AUDIO_CODEC)
		? DEFAULT_EXPORT_AUDIO_CODEC
		: (audioCodecs[0]?.value ?? DEFAULT_EXPORT_AUDIO_CODEC);

	return {
		audioCodecs,
		videoCodecs,
		isLoading: query.isLoading,
		defaultVideoCodec,
		defaultAudioCodec,
		defaultFramerate: DEFAULT_EXPORT_FRAMERATE,
	};
}
