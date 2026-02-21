import { useCallback, useEffect, useRef } from "react";
import type { FilterType } from "./shaders";
import { VideoThumbnailCache } from "./videoThumbnailCache";
import { VideoThumbnailExtractor } from "./videoThumbnailExtractor";

export function useVideoThumbnailProvider(canPlayVideoUrl: string | null, filterType: FilterType, intensity: number) {
	const extractorRef = useRef<VideoThumbnailExtractor | null>(null);
	const cacheRef = useRef<VideoThumbnailCache | null>(null);
	const mediaVersionRef = useRef(0);
	const prevFilterRef = useRef({ filterType, intensity });

	if (prevFilterRef.current.filterType !== filterType || prevFilterRef.current.intensity !== intensity) {
		prevFilterRef.current = { filterType, intensity };
		cacheRef.current?.clear();
	}

	useEffect(() => {
		if (!canPlayVideoUrl) return;
		if (!extractorRef.current) {
			extractorRef.current = new VideoThumbnailExtractor({ maxWidth: 256 });
		}
		if (!cacheRef.current) {
			cacheRef.current = new VideoThumbnailCache({ extractor: extractorRef.current, mediaKey: canPlayVideoUrl });
		}
		extractorRef.current.setSource(canPlayVideoUrl);
		cacheRef.current.setMediaKey(canPlayVideoUrl);
		mediaVersionRef.current += 1;
	}, [canPlayVideoUrl]);

	useEffect(() => {
		return () => {
			extractorRef.current?.destroy();
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: we need to memoize the callback
	const getThumbnail = useCallback(
		async (time: number, filter: FilterType, intensity: number, signal?: AbortSignal) => {
			const effect = {
				filterType: filter,
				intensity,
			};
			if (!cacheRef.current) {
				return null;
			}
			return cacheRef.current.getOrLoad(time, effect, signal);
		},
		[canPlayVideoUrl],
	);

	return getThumbnail;
}
