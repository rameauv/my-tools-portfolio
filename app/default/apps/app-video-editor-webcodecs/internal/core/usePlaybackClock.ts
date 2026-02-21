import { useCallback, useEffect, useRef, useState } from "react";

export type UsePlaybackClockOptions = {
	durationSec: number;
	getMediaTimeSec?: () => number;
	onPause?: () => Promise<void> | void;
	onPlay?: (fromTimeSec: number) => Promise<void> | void;
	onSeek?: (timeSec: number) => Promise<void> | void;
};

export type UsePlaybackClockResult = {
	currentTimeSec: number;
	isPlaying: boolean;
	pause: () => void;
	play: () => void;
	reset: () => void;
	seek: (timeSec: number) => void;
	toggle: () => void;
};

const clampTime = (timeSec: number, durationSec: number): number => {
	if (!Number.isFinite(durationSec) || durationSec <= 0) return 0;
	if (timeSec <= 0) return 0;
	if (timeSec >= durationSec) return durationSec;
	return timeSec;
};

export const usePlaybackClock = (props: UsePlaybackClockOptions): UsePlaybackClockResult => {
	const [currentTimeSec, setCurrentTimeSec] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const rafRef = useRef<number | null>(null);
	const startPerfMsRef = useRef(0);
	const startTimeSecRef = useRef(0);

	const updateCurrentTimeFromSource = useCallback(() => {
		if (!props.getMediaTimeSec) return false;
		const sourceTime = clampTime(props.getMediaTimeSec(), props.durationSec);
		setCurrentTimeSec(sourceTime);
		return true;
	}, [props.durationSec, props.getMediaTimeSec]);

	const pause = useCallback(() => {
		if (props.getMediaTimeSec) {
			const sourceTime = clampTime(props.getMediaTimeSec(), props.durationSec);
			setCurrentTimeSec(sourceTime);
			startTimeSecRef.current = sourceTime;
		}
		setIsPlaying(false);
		void props.onPause?.();
	}, [props.durationSec, props.getMediaTimeSec, props.onPause]);

	const seek = useCallback(
		(timeSec: number) => {
			const next = clampTime(timeSec, props.durationSec);
			setCurrentTimeSec(next);
			startTimeSecRef.current = next;
			startPerfMsRef.current = performance.now();
			void props.onSeek?.(next);
		},
		[props.durationSec, props.onSeek],
	);

	const play = useCallback(() => {
		if (props.durationSec <= 0) return;
		setIsPlaying(true);
		startTimeSecRef.current = currentTimeSec;
		startPerfMsRef.current = performance.now();
		void props.onPlay?.(currentTimeSec);
	}, [currentTimeSec, props.durationSec, props.onPlay]);

	const reset = useCallback(() => {
		setIsPlaying(false);
		setCurrentTimeSec(0);
		startTimeSecRef.current = 0;
		startPerfMsRef.current = 0;
	}, []);

	const toggle = useCallback(() => {
		if (isPlaying) {
			pause();
			return;
		}
		play();
	}, [isPlaying, pause, play]);

	useEffect(() => {
		if (!isPlaying) return;

		const tick = () => {
			let next = 0;
			if (updateCurrentTimeFromSource()) {
				next = clampTime(props.getMediaTimeSec?.() ?? 0, props.durationSec);
			} else {
				const elapsedSec = (performance.now() - startPerfMsRef.current) / 1000;
				next = clampTime(startTimeSecRef.current + elapsedSec, props.durationSec);
				setCurrentTimeSec(next);
			}
			setCurrentTimeSec(next);
			if (next >= props.durationSec) {
				setIsPlaying(false);
				void props.onPause?.();
				return;
			}
			rafRef.current = requestAnimationFrame(tick);
		};

		rafRef.current = requestAnimationFrame(tick);

		return () => {
			if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		};
	}, [isPlaying, props.durationSec, props.getMediaTimeSec, props.onPause, updateCurrentTimeFromSource]);

	useEffect(() => {
		if (currentTimeSec <= props.durationSec) return;
		setCurrentTimeSec(clampTime(currentTimeSec, props.durationSec));
	}, [currentTimeSec, props.durationSec]);

	return {
		currentTimeSec,
		isPlaying,
		pause,
		play,
		reset,
		seek,
		toggle,
	};
};
