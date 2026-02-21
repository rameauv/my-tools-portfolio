import { Slider } from "@base-ui/react/slider";
import { useThrottledValue } from "@tanstack/react-pacer";
import React, { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { formatTime, SeekbarThumbnailPreview } from "./SeekbarThumbnailPreview";

export type VideoSeekbarProps = {
	currentTime: number;
	duration: number;
	onSeek: (time: number) => void;
	thumbnailProvider: (time: number) => Promise<string | null>;
	isPlaying: boolean;
};

const THROTTLED_HOVER_TIME_CONFIG = {
	wait: 500,
	trailing: true,
};

export const VideoSeekbar = React.memo((props: VideoSeekbarProps) => {
	const [value, setValue] = useState(props.currentTime);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [hoverPercent, setHoverPercent] = useState<number | null>(null);
	const [hoverThumbnail, setHoverThumbnail] = useState<string | null>(null);
	const [hoverTime, setHoverTime] = useState<number>(0);
	const throttledHoverTime = useThrottledValue(hoverTime, THROTTLED_HOVER_TIME_CONFIG)[0];
	const lastRequestRef = useRef<number>(0);
	const isSeekingSetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const duration = props.duration;

	useEffect(() => {
		if (isSeekingSetTimeoutRef.current) return;
		startTransition(() => {
			setValue(props.currentTime);
		});
	}, [props.currentTime]);

	const getPercentFromClientX = useCallback((clientX: number): number => {
		const wrapper = wrapperRef.current;
		if (!wrapper) return 0;
		const rect = wrapper.getBoundingClientRect();
		const x = clientX - rect.left;
		const p = Math.max(0, Math.min(1, x / rect.width));
		return p * 100;
	}, []);

	const timeFromPercent = useCallback(
		(percent: number): number => {
			return (percent / 100) * duration;
		},
		[duration],
	);

	const percentFromTime = useCallback(
		(time: number): number => {
			return (time / duration) * 100;
		},
		[duration],
	);

	useEffect(() => {
		startTransition(() => {
			if (hoverPercent === null || duration <= 0) {
				setHoverThumbnail(null);
				return;
			}
			const time = timeFromPercent(hoverPercent);
			setHoverTime(time);
			const bucket = Number(time.toFixed(2));
			lastRequestRef.current = bucket;
			props.thumbnailProvider(bucket).then((url) => {
				if (lastRequestRef.current === bucket) setHoverThumbnail(url);
			});
		});
	}, [hoverPercent, duration, timeFromPercent, props.thumbnailProvider]);

	const handlePointer = useCallback(
		(clientX: number) => {
			const p = getPercentFromClientX(clientX);
			setHoverPercent(p);
		},
		[getPercentFromClientX],
	);

	const handleWrapperMouseMove = useCallback(
		(e: React.MouseEvent) => {
			handlePointer(e.clientX);
		},
		[handlePointer],
	);

	const handleWrapperMouseLeave = useCallback(() => {
		setHoverPercent(null);
		setHoverThumbnail(null);
	}, []);

	const handleValueChange = useCallback(
		(value: number | number[]) => {
			const t = Array.isArray(value) ? value[0] : value;
			setValue(t);
			setHoverPercent(percentFromTime(t));
			props.onSeek(t);
			if (isSeekingSetTimeoutRef.current) clearTimeout(isSeekingSetTimeoutRef.current);
			isSeekingSetTimeoutRef.current = setTimeout(() => {
				isSeekingSetTimeoutRef.current = null;
			}, 2000);
		},
		[props.onSeek, percentFromTime],
	);

	if (duration <= 0) return null;

	return (
		<div className="flex w-full flex-col gap-2">
			<div
				className="relative flex h-8 w-full items-center"
				onMouseLeave={handleWrapperMouseLeave}
				onMouseMove={handleWrapperMouseMove}
				ref={wrapperRef}
			>
				<Slider.Root
					className="w-full"
					max={duration}
					min={0}
					onValueChange={handleValueChange}
					step={0.01}
					thumbAlignment="edge"
					value={value}
				>
					<SeekbarSliderControl />
				</Slider.Root>
				{hoverPercent !== null && (
					<SeekbarThumbnailPreview
						hoverPercent={hoverPercent}
						hoverThumbnail={hoverThumbnail}
						hoverTime={throttledHoverTime}
					/>
				)}
			</div>
			<div className="flex w-full justify-between font-mono text-slate-500 text-xs tabular-nums">
				<span>{formatTime(props.currentTime)}</span>
				<span>{formatTime(duration)}</span>
			</div>
		</div>
	);
});

const SeekbarSliderControl = React.memo(() => {
	return (
		<Slider.Control className="relative flex h-8 w-full cursor-pointer items-center">
			<Slider.Track className="relative h-2 w-full rounded-full bg-gray-200 shadow-inner">
				<Slider.Indicator className="h-full rounded-full bg-blue-600 shadow-sm" />
				<Slider.Thumb
					aria-label="Seek"
					className="z-10 h-4 w-4 rounded-full border-2 border-white bg-blue-600 shadow-md outline-none transition-transform duration-150 hover:scale-110 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 data-[dragging]:scale-110"
				/>
			</Slider.Track>
		</Slider.Control>
	);
});
