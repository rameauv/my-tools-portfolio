import type { RefObject } from "react";
import { useEffect, useRef } from "react";

export function useVideoAudioGain(
	videoRef: RefObject<HTMLVideoElement | null>,
	canPlayVideoUrl: string | null,
	gain: number,
): void {
	const audioContextRef = useRef<AudioContext | null>(null);
	const gainNodeRef = useRef<GainNode | null>(null);
	const setupVideoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		const video = videoRef.current;
		if (!video || !canPlayVideoUrl) return;

		const videoChanged = setupVideoRef.current !== video;
		if (videoChanged || !gainNodeRef.current) {
			try {
				const ctx = new AudioContext({ latencyHint: "playback" });
				const source = ctx.createMediaElementSource(video);
				const gainNode = ctx.createGain();
				source.connect(gainNode);
				gainNode.connect(ctx.destination);

				audioContextRef.current = ctx;
				gainNodeRef.current = gainNode;
				setupVideoRef.current = video;
			} catch (err) {
				console.warn("Failed to set up Web Audio gain:", err);
				return;
			}
		}

		const g = gainNodeRef.current;
		if (g) {
			g.gain.value = gain;
		}
	}, [videoRef, canPlayVideoUrl, gain]);

	useEffect(() => {
		const video = videoRef.current;
		if (!video || !canPlayVideoUrl || !audioContextRef.current) return;

		const handlePlay = () => {
			const ctx = audioContextRef.current;
			if (ctx?.state === "suspended") {
				void ctx.resume();
			}
		};

		video.addEventListener("play", handlePlay);
		return () => video.removeEventListener("play", handlePlay);
	}, [videoRef, canPlayVideoUrl]);
}
