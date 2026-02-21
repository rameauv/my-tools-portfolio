import { useEffect, useState } from "react";
import type { FilterType } from "./shaders";

export function useSentenceThumbnail(
	time: number,
	thumbnailProvider:
		| ((t: number, filter: FilterType, intensity: number, signal?: AbortSignal) => Promise<string | null>)
		| null,
	filterType: FilterType,
	intensity: number,
	savedThumbnailUrl?: string | null,
	isVideoReady?: boolean,
): string | null {
	const [url, setUrl] = useState<string | null>(savedThumbnailUrl ?? null);

	useEffect(() => {
		if (savedThumbnailUrl) {
			setUrl(savedThumbnailUrl);
			return;
		}
		if (!isVideoReady || !thumbnailProvider || time < 0) {
			setUrl(null);
			return;
		}
		const controller = new AbortController();
		let cancelled = false;
		thumbnailProvider(time, filterType, intensity, controller.signal).then((result) => {
			if (!cancelled) setUrl(result);
		});
		return () => {
			cancelled = true;
			controller.abort();
		};
	}, [time, thumbnailProvider, filterType, intensity, savedThumbnailUrl, isVideoReady]);

	return url;
}
