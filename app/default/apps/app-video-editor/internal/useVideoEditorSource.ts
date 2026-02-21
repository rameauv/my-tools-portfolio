import type { RefObject } from "react";
import { useEffect, useState } from "react";

const INITIAL_CURRENT_TIME = 0.001;

export function useVideoEditorSource(videoRef: RefObject<HTMLVideoElement | null>, canPlayVideoUrl: string | null) {
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);

	useEffect(() => {
		const videoUrl = canPlayVideoUrl;
		if (!videoUrl) {
			setDuration(0);
			setCurrentTime(0);
			return;
		}
		const video = videoRef.current;
		if (!video) return;
		const onTimeUpdate = () => setCurrentTime(video.currentTime);
		const onSeeked = () => setCurrentTime(video.currentTime);
		video.addEventListener("timeupdate", onTimeUpdate);
		video.addEventListener("seeked", onSeeked);
		if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
			video.currentTime = INITIAL_CURRENT_TIME;
			setDuration(video.duration);
			setCurrentTime(INITIAL_CURRENT_TIME);
		}
		return () => {
			video.removeEventListener("timeupdate", onTimeUpdate);
			video.removeEventListener("seeked", onSeeked);
		};
	}, [canPlayVideoUrl, videoRef]);

	return {
		currentTime,
		duration,
	};
}
