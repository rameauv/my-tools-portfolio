import { useQuery } from "@tanstack/react-query";
import { Play, RotateCcw } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../../shared/ds/Button";
import * as db from "./backgroundRemovalDB";
import { GpuInfo } from "./GpuInfo";
import { JobHistory } from "./JobHistory";
import { ProgressBar } from "./ProgressBar";
import { useBackgroundRemovalJob } from "./useBackgroundRemovalJob";
import { useWebGpuAdapters } from "./useWebGpuAdapters";

interface ImageState {
	file: File | null;
	url: string | null;
}

export const BackgroundRemover = React.memo(() => {
	const [originalImage, setOriginalImage] = useState<ImageState>({
		file: null,
		url: null,
	});
	const [powerPreference, setPowerPreference] = useState<"high-performance" | "low-power">("high-performance");
	const [processedImage, setProcessedImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Use job management hook
	const removalJob = useBackgroundRemovalJob({
		powerPreference,
	});

	// Fetch job history
	const jobHistoryQuery = useQuery({
		queryKey: ["backgroundRemovalJobHistory"],
		queryFn: async () => {
			const jobs = await db.getAllJobs();
			// Sort by timestamp descending (newest first)
			return jobs.sort((a, b) => b.timestamp - a.timestamp);
		},
		staleTime: 10,
		initialData: [],
	});

	// Update processed image when job succeeds
	// biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to re-run this effect when jobHistoryQuery.refetch changes
	useEffect(() => {
		jobHistoryQuery.refetch();
		if (removalJob.jobStatus === "success" && removalJob.jobResultUrl) {
			setProcessedImage(removalJob.jobResultUrl);
		}
	}, [removalJob.jobStatus, removalJob.jobResultUrl]);

	// Check WebGPU availability
	const adaptersQuery = useWebGpuAdapters();

	// Handle file selection
	const handleFileSelect = useCallback(
		(file: File | null) => {
			if (!file) return;

			// Validate file type
			if (!file.type.startsWith("image/")) {
				return;
			}

			if (originalImage.url) {
				URL.revokeObjectURL(originalImage.url);
			}
			// Create preview URL
			const url = URL.createObjectURL(file);
			setOriginalImage({ file, url });
			setProcessedImage(null);
		},
		[originalImage.url],
	);

	// Handle drag and drop
	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();

			const file = e.dataTransfer.files[0];
			if (file) {
				handleFileSelect(file);
			}
		},
		[handleFileSelect],
	);

	// Process image
	const processImage = useCallback(() => {
		if (!originalImage.file || !originalImage.url) {
			return;
		}
		if (removalJob.isJobRunning) {
			return; // Prevent concurrent jobs
		}
		if (processedImage) {
			URL.revokeObjectURL(processedImage);
		}

		setProcessedImage(null);
		removalJob.processImageMutation.mutate(originalImage.url, {
			onSuccess: async (resultArrayBuffer) => {
				// Convert ArrayBuffer to blob URL
				const blob = new Blob([resultArrayBuffer]);
				const resultUrl = URL.createObjectURL(blob);
				setProcessedImage(resultUrl);
			},
		});
	}, [originalImage, removalJob.processImageMutation, removalJob.isJobRunning, processedImage]);

	// Download processed image
	const downloadImage = useCallback(() => {
		if (!processedImage) return;

		const link = document.createElement("a");
		link.href = processedImage;
		link.download = `background-removed-${Date.now()}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}, [processedImage]);

	// Download job result
	const downloadJobResult = useCallback((job: db.StoredJob) => {
		if (!job.processedImage) return;

		const url = URL.createObjectURL(job.processedImage);
		const link = document.createElement("a");
		link.href = url;
		link.download = `background-removed-${job.id}.png`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}, []);

	// Delete job
	const deleteJob = useCallback(
		async (jobId: string) => {
			try {
				await db.deleteJob(jobId);
				jobHistoryQuery.refetch();
			} catch (error) {
				console.error("Failed to delete job:", error);
			}
		},
		[jobHistoryQuery.refetch],
	);

	// Format date
	const formatDate = useCallback((timestamp: number) => {
		const date = new Date(timestamp);
		return date.toLocaleString();
	}, []);

	// Cleanup URLs on unmount
	// biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to re-run this effect when jobResultUrl changes
	useEffect(() => {
		return () => {
			if (processedImage) {
				URL.revokeObjectURL(processedImage);
			}
			if (removalJob.jobResultUrl) {
				URL.revokeObjectURL(removalJob.jobResultUrl);
			}
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: we want to re-run this effect when processedImage changes
	useEffect(() => {
		jobHistoryQuery.refetch();
	}, [processedImage, jobHistoryQuery.refetch]);

	// WebGPU availability: show fallback UI when loading or unavailable
	const adapters = adaptersQuery.adapters;
	const isWebGpuLoading = adapters === undefined;
	const isWebGpuUnavailable =
		adapters === null ||
		(adapters !== null && adapters !== undefined && !adapters.lowPowerAdapter && !adapters.highPerformanceAdapter);

	if (isWebGpuLoading || isWebGpuUnavailable) {
		return (
			<div className="flex h-full flex-col items-center justify-center gap-4 bg-gray-50 p-4">
				<div className="max-w-md rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
					<h2 className="mb-2 font-semibold text-gray-900 text-xl">
						{isWebGpuLoading ? "Checking WebGPU support…" : "WebGPU is required"}
					</h2>
					{isWebGpuLoading ? (
						<p className="text-gray-600 text-sm">Please wait.</p>
					) : (
						<p className="text-gray-600 text-sm">
							This tool uses WebGPU to remove image backgrounds. WebGPU is not available in your current browser or
							environment. Try a supported browser (e.g. Chrome, Edge) with hardware acceleration enabled, or ensure
							WebGPU is not disabled by policy.
						</p>
					)}
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-full flex-col gap-4 bg-gray-50 p-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-xl">Background Remover</h2>
			</div>

			{/* GPU Info Section */}
			<GpuInfo
				adapters={adaptersQuery.adapters}
				isPowerPreferenceLocked={removalJob.isJobRunning}
				onPowerPreferenceChange={setPowerPreference}
				powerPreference={powerPreference}
			/>

			{/* Job Status Section */}
			{removalJob.isJobRunning && (
				<div className="rounded-lg border border-blue-300 bg-blue-50 p-4">
					<div className="mb-2 flex items-center justify-between">
						<div className="font-medium text-blue-900 text-sm">
							{removalJob.jobStatus === "pending" ? "Initializing..." : "Processing Image"}
						</div>
					</div>
					<ProgressBar className="mb-2" percentage={removalJob.progressPercentage} />
					{removalJob.progress && <div className="text-blue-700 text-xs">{removalJob.progress}</div>}
					{removalJob.progressPercentage > 0 && (
						<div className="mt-1 text-right text-blue-600 text-xs">{removalJob.progressPercentage}%</div>
					)}
				</div>
			)}

			{/* Error message */}
			{removalJob.error && (
				<div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
					<div className="mb-1 font-medium">Processing failed</div>
					<div className="text-sm">{removalJob.error.message}</div>
					{removalJob.error.code && (
						<div className="mt-1 text-red-600 text-xs">Error code: {removalJob.error.code}</div>
					)}
					<Button className="mt-2" onClick={removalJob.retryJob} type="button">
						Retry
					</Button>
				</div>
			)}

			{/* Upload area */}
			{!originalImage.url && (
				<div
					className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-300 border-dashed p-8 transition-colors hover:border-gray-400"
					onClick={() => fileInputRef.current?.click()}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					<div className="text-center">
						<p className="mb-2 font-medium text-lg">Drag & drop an image here</p>
						<p className="mb-4 text-gray-500 text-sm">or click to browse</p>
						<input
							accept="image/*"
							className="hidden"
							onChange={(e) => {
								const file = e.target.files?.[0] || null;
								handleFileSelect(file);
							}}
							ref={fileInputRef}
							type="file"
						/>
					</div>
				</div>
			)}

			{/* Image preview and processing */}
			{originalImage.url && (
				<div className="flex flex-1 flex-col gap-4">
					{/* Original image */}
					<div className="flex flex-1 flex-col">
						<h3 className="mb-2 font-medium text-sm">Original Image</h3>
						<div className="flex-1 overflow-hidden rounded-lg border bg-white">
							<img alt="Original" className="h-full w-full object-contain" src={originalImage.url} />
						</div>
					</div>

					{/* Process button */}
					<Button
						disabled={removalJob.isJobRunning}
						icon={<Play className="h-3.5 w-3.5" />}
						onClick={processImage}
						type="button"
					>
						{removalJob.isJobRunning ? "Processing..." : "Run"}
					</Button>

					{/* Processed image */}
					{processedImage && (
						<div className="flex flex-1 flex-col">
							<h3 className="mb-2 font-medium text-sm">Result (Transparent Background)</h3>
							<div className="flex-1 overflow-hidden rounded-lg border bg-[0_0,0_10px,10px_-10px,-10px_0px] bg-[length:20px_20px] bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-white">
								<img alt="Processed" className="h-full w-full object-contain" src={processedImage} />
							</div>
							<Button className="mt-2" onClick={downloadImage} type="button">
								Download PNG
							</Button>
						</div>
					)}

					{/* Reset button */}
					<Button
						icon={<RotateCcw className="h-3.5 w-3.5" />}
						onClick={() => {
							if (originalImage.url) {
								URL.revokeObjectURL(originalImage.url);
							}
							if (processedImage) {
								URL.revokeObjectURL(processedImage);
							}
							setOriginalImage({ file: null, url: null });
							setProcessedImage(null);
							if (fileInputRef.current) {
								fileInputRef.current.value = "";
							}
						}}
						type="button"
					>
						Reset
					</Button>
				</div>
			)}

			{/* Job History */}
			<JobHistory
				deleteJob={deleteJob}
				downloadJobResult={downloadJobResult}
				formatDate={formatDate}
				jobs={jobHistoryQuery.data ?? []}
			/>
		</div>
	);
});
