import { type RefObject, useEffect } from "react";

export type UseSyncVideoPlayingStateParams = {
	videoRef: RefObject<HTMLVideoElement | null>;
	canPlayVideoUrl: string | null;
	onPlayingChange: (playing: boolean) => void;
};

export function useSyncVideoPlayingState(params: UseSyncVideoPlayingStateParams): void {
	useEffect(() => {
		if (!params.canPlayVideoUrl) return;
		const video = params.videoRef.current;
		if (!video) return;
		const onPlay = () => params.onPlayingChange(true);
		const onPause = () => params.onPlayingChange(false);
		video.addEventListener("play", onPlay);
		video.addEventListener("pause", onPause);
		return () => {
			video.removeEventListener("play", onPlay);
			video.removeEventListener("pause", onPause);
		};
	}, [params.canPlayVideoUrl, params.onPlayingChange, params.videoRef]);
}
