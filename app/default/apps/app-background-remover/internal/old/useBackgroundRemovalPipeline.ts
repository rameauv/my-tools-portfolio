import type { BackgroundRemovalPipeline } from "@huggingface/transformers";
import { pipeline, env } from "@huggingface/transformers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface UseBackgroundRemovalPipelineOptions {
	powerPreference: 'high-performance' | 'low-power';
	onProgress?: (progress: string) => void;
}

export function useBackgroundRemovalPipeline({
	powerPreference,
	onProgress,
}: UseBackgroundRemovalPipelineOptions) {
	const queryClient = useQueryClient();
	const [isPowerPreferenceLocked, setIsPowerPreferenceLocked] = useState(false);

	// Initialize pipeline
	const { data: pipelineInstance, isLoading: isModelLoading, error: pipelineError } = useQuery({
		queryKey: ['pipeline', powerPreference],
		queryFn: async () => {
			console.log("initializePipeline", powerPreference);
			onProgress?.("Loading BEN2-ONNX model...");

			if (!env.backends.onnx.webgpu) {
				throw new Error("WebGPU backend not supported");
			}
			console.log("env.backends.onnx.webgpu", env.backends.onnx.webgpu);
			// env.backends.onnx.webgpu.powerPreference = powerPreference;
			setIsPowerPreferenceLocked(true);
			const segmenter = await pipeline("background-removal", "onnx-community/BEN2-ONNX", {
				device: "wasm",
				progress_callback: (progressInfo: any) => {
					// Handle ProgressStatusInfo (status: "progress")
					if (progressInfo?.status === "progress" && typeof progressInfo.progress === "number") {
						const percent = Math.round(progressInfo.progress);
						if (progressInfo.file) {
							onProgress?.(`Downloading ${progressInfo.file}... ${percent}%`);
						} else {
							onProgress?.(`Loading model... ${percent}%`);
						}
					}
					// Handle DoneProgressInfo (status: "done")
					else if (progressInfo?.status === "done") {
						if (progressInfo.file) {
							onProgress?.(`Downloaded ${progressInfo.file}`);
						} else {
							onProgress?.("File downloaded");
						}
					}
					// Handle ReadyProgressInfo (status: "ready")
					else if (progressInfo?.status === "ready") {
						onProgress?.("Model ready");
					}
					// Handle other status types (initiate, download, etc.)
					else if (progressInfo?.status) {
						const statusMessage = progressInfo.status.charAt(0).toUpperCase() + progressInfo.status.slice(1);
						onProgress?.(statusMessage);
					}
				},
			});
			onProgress?.("Model loaded successfully!");
			return segmenter;
		},
		enabled: isPowerPreferenceLocked,
		staleTime: Infinity, // Pipeline is expensive to initialize
		gcTime: 10 * 60 * 1000, // 10 minutes
		retry: false,
	});

	// Cleanup pipeline when powerPreference changes or component unmounts
	useEffect(() => {
		return () => {
			// Cleanup current pipeline
			const currentPipeline = queryClient.getQueryData<BackgroundRemovalPipeline>(['pipeline', powerPreference]);
			if (currentPipeline) {
				console.log("dispose pipeline");
				currentPipeline.dispose();
				console.log("destroy device", env.backends.onnx.webgpu?.device);
				if ((env.backends.onnx.webgpu?.device as any)?.destroy) {
					(env.backends.onnx.webgpu?.device as any)?.destroy();
				}
			}
		};
	}, [powerPreference, queryClient]);

	// Process image
	const processImageMutation = useMutation({
		mutationFn: async (imageUrl: string) => {
			const segmenter = queryClient.getQueryData<BackgroundRemovalPipeline>(['pipeline', powerPreference]);
			if (!segmenter) {
				throw new Error("Pipeline not initialized");
			}

			onProgress?.("Processing image...");

			// Process the image
			const outputs = await segmenter(imageUrl);
			const rawImage = outputs[0];
			const blob = await rawImage.toBlob();
			// Convert RawImage to blob URL
			return URL.createObjectURL(blob);
		},
		onMutate: () => {
			onProgress?.("Initializing model...");
		},
		onSuccess: () => {
			onProgress?.("Processing complete!");
		},
		onError: (err) => {
			console.error("Processing error:", err);
			onProgress?.("");
		},
	});

	return {
		pipelineInstance,
		isModelLoading,
		pipelineError,
		isPowerPreferenceLocked,
		processImageMutation,
	};
}
