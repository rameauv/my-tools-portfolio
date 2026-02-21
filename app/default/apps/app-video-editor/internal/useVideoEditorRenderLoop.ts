import { type RefObject, useCallback, useEffect, useMemo, useRef } from "react";
import type { FilterType } from "./shaders";
import type { VideoEditorGLPipeline } from "./webgl";

export type UseVideoEditorRenderLoopParams = {
	canvasRef: RefObject<HTMLCanvasElement | null>;
	videoRef: RefObject<HTMLVideoElement | null>;
	pipeline: VideoEditorGLPipeline | null;
	readyVideoUrl: string | null;
	filterType: FilterType;
	intensity: number;
	isPlaying: boolean;
};

export function useVideoEditorRenderLoop(params: UseVideoEditorRenderLoopParams) {
	const tick = useRef<null | (() => void)>(null);
	const rafRef = useRef<number | null>(null);
	const startTimeRef = useRef<number>(0);

	useEffect(() => {
		const canvas = params.canvasRef.current;
		const video = params.videoRef.current;
		if (!canvas || !video || !params.readyVideoUrl) return;
		startTimeRef.current = performance.now();

		tick.current = () => {
			if (tick.current && params.isPlaying) {
				rafRef.current = requestAnimationFrame(tick.current);
			}
			const pipeline = params.pipeline;
			if (!pipeline) {
				console.error("pipeline not ready", pipeline);
				return;
			}
			const time = Math.floor((performance.now() - startTimeRef.current) / 1000);
			pipeline.render({
				filterType: params.filterType,
				intensity: params.intensity,
				time,
			});
		};
		requestAnimationFrame(tick.current);
		return () => {
			if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		};
	}, [
		params.readyVideoUrl,
		params.filterType,
		params.intensity,
		params.canvasRef,
		params.pipeline,
		params.videoRef,
		params.isPlaying,
	]);

	const updateFrame = useCallback((startTime: number) => {
		startTimeRef.current = startTime;
		if (tick.current == null) {
			console.error("tick not ready", tick.current);
			return;
		}
		if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
		requestAnimationFrame(tick.current);
	}, []);

	return useMemo(() => ({ updateFrame }), [updateFrame]);
}
