import { Film, Pause, Play } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FILTER_GRAYSCALE, FILTER_NONE, FILTER_SEPIA, FILTER_VIGNETTE, type FilterType } from "./shaders";
import type { VideoEditorGLPipeline } from "./webgl";
import { createVideoEditorPipeline, resizeCanvasToMatchVideo } from "./webgl";

export type FilterPreset = "none" | "grayscale" | "sepia" | "vignette";

const PRESET_TO_TYPE: Record<FilterPreset, FilterType> = {
	none: FILTER_NONE,
	grayscale: FILTER_GRAYSCALE,
	sepia: FILTER_SEPIA,
	vignette: FILTER_VIGNETTE,
};

export type VideoEditorViewProps = {
	videoUrl: string;
};

export const VideoEditorView = React.memo((props: VideoEditorViewProps) => {
	const [filter, setFilter] = useState<FilterPreset>("none");
	const [intensity, setIntensity] = useState(1);
	const [isPlaying, setIsPlaying] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const pipelineRef = useRef<VideoEditorGLPipeline | null>(null);
	const rafRef = useRef<number | null>(null);
	const startTimeRef = useRef<number>(0);

	const togglePlay = useCallback(() => {
		const video = videoRef.current;
		if (!video) return;
		if (video.paused) {
			video.play().catch(() => setError("Playback failed"));
			setIsPlaying(true);
		} else {
			video.pause();
			setIsPlaying(false);
		}
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-run when video source is set so we attach to the mounted video element
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		const onPlay = () => setIsPlaying(true);
		const onPause = () => setIsPlaying(false);
		video.addEventListener("play", onPlay);
		video.addEventListener("pause", onPause);
		return () => {
			video.removeEventListener("play", onPlay);
			video.removeEventListener("pause", onPause);
		};
	}, [props.videoUrl]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		if (!props.videoUrl || !canvas || !video) return;
		const onCanPlay = () => {
			resizeCanvasToMatchVideo(canvas, video);
			const pipeline = createVideoEditorPipeline(canvas, video);
			if (pipeline) {
				if (pipelineRef.current) pipelineRef.current.destroy();
				pipelineRef.current = pipeline;
			}
		};
		video.addEventListener("canplay", onCanPlay);
		if (video.readyState >= 2) onCanPlay();
		return () => {
			video.removeEventListener("canplay", onCanPlay);
			if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
			if (pipelineRef.current) {
				pipelineRef.current.destroy();
				pipelineRef.current = null;
			}
		};
	}, [props.videoUrl]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		if (!canvas || !video || !props.videoUrl) return;
		startTimeRef.current = performance.now();
		function tick(): void {
			rafRef.current = requestAnimationFrame(tick);
			const pipeline = pipelineRef.current;
			const v = videoRef.current;
			if (!pipeline || !v || v.readyState < 2) return;
			const time = (performance.now() - startTimeRef.current) / 1000;
			pipeline.render({
				filterType: PRESET_TO_TYPE[filter],
				intensity,
				time,
			});
		}
		rafRef.current = requestAnimationFrame(tick);
		return () => {
			if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		};
	}, [props.videoUrl, filter, intensity]);

	return (
		<>
			<div className="flex min-h-0 flex-1 items-center justify-center rounded-lg border border-gray-200 bg-black">
				<canvas className="max-h-full max-w-full object-contain" ref={canvasRef} style={{ aspectRatio: "auto" }} />
				<video
					className="hidden"
					crossOrigin="anonymous"
					muted
					onLoadedMetadata={() => {}}
					playsInline
					ref={videoRef}
					src={props.videoUrl}
				/>
			</div>
			<div className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white p-3">
				<button
					className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700"
					onClick={togglePlay}
					type="button"
				>
					{isPlaying ? <Pause size={18} /> : <Play size={18} />}
					{isPlaying ? "Pause" : "Play"}
				</button>
				<div className="flex items-center gap-2">
					<Film className="text-gray-600" size={18} />
					<span className="font-medium text-gray-700 text-sm">Filter</span>
					<select
						className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm"
						onChange={(e) => setFilter(e.target.value as FilterPreset)}
						value={filter}
					>
						<option value="none">None</option>
						<option value="grayscale">Grayscale</option>
						<option value="sepia">Sepia</option>
						<option value="vignette">Vignette</option>
					</select>
				</div>
				<div className="flex items-center gap-2">
					<span className="font-medium text-gray-700 text-sm">Intensity</span>
					<input
						className="h-2 w-24 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
						max={2}
						min={0}
						onChange={(e) => setIntensity(Number(e.target.value))}
						step={0.05}
						type="range"
						value={intensity}
					/>
					<span className="text-gray-500 text-xs">{intensity.toFixed(2)}</span>
				</div>
			</div>
			{error && (
				<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 text-sm">{error}</div>
			)}
		</>
	);
});
