import { type RefObject, useEffect, useState } from "react";
import type { VideoEditorGLPipeline } from "./webgl";
import { createVideoEditorPipeline } from "./webgl";

export type UseSetupVideoEditorPipelineParams = {
	canvasRef: RefObject<HTMLCanvasElement | null>;
	videoRef: RefObject<HTMLVideoElement | null>;
};

export function useSetupVideoEditorPipeline(params: UseSetupVideoEditorPipelineParams): VideoEditorGLPipeline | null {
	const [pipeline, setPipeline] = useState<VideoEditorGLPipeline | null>(null);

	useEffect(() => {
		if (!params.canvasRef.current || !params.videoRef.current) {
			return;
		}
		const pipeline = createVideoEditorPipeline(params.canvasRef.current, params.videoRef.current);
		setPipeline(pipeline);

		return () => {
			if (!pipeline) {
				return;
			}
			pipeline.destroy();
			setPipeline(null);
		};
	}, [params.canvasRef, params.videoRef]);
	return pipeline;
}
