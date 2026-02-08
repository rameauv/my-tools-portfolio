import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

	return (
		<div className="flex h-full flex-col gap-4 bg-gray-50 p-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="font-semibold text-xl">Background Remover</h2>
				<div className="flex items-center gap-2">
					{adaptersQuery.adapters !== null && adaptersQuery.adapters !== undefined && (
						<div
							className={`rounded px-2 py-1 text-xs ${
								adaptersQuery.adapters.lowPowerAdapter || adaptersQuery.adapters.highPerformanceAdapter
									? "bg-green-100 text-green-800"
									: "bg-yellow-100 text-yellow-800"
							}`}
						>
							{adaptersQuery.adapters.lowPowerAdapter || adaptersQuery.adapters.highPerformanceAdapter
								? "WebGPU Available"
								: "WebGPU Not Available"}
						</div>
					)}
				</div>
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
						<button
							className="font-medium text-red-600 text-xs hover:text-red-800"
							onClick={removalJob.cancelJob}
							type="button"
						>
							Cancel
						</button>
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
					<button
						className="mt-2 rounded bg-red-600 px-3 py-1 text-white text-xs hover:bg-red-700"
						onClick={removalJob.retryJob}
						type="button"
					>
						Retry
					</button>
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
					<button
						className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
						disabled={removalJob.isJobRunning}
						onClick={processImage}
						type="button"
					>
						{removalJob.isJobRunning ? "Processing..." : "Remove Background"}
					</button>

					{/* Processed image */}
					{processedImage && (
						<div className="flex flex-1 flex-col">
							<h3 className="mb-2 font-medium text-sm">Result (Transparent Background)</h3>
							<div className="flex-1 overflow-hidden rounded-lg border bg-[0_0,0_10px,10px_-10px,-10px_0px] bg-[length:20px_20px] bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-white">
								<img alt="Processed" className="h-full w-full object-contain" src={processedImage} />
							</div>
							<button
								className="mt-2 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
								onClick={downloadImage}
								type="button"
							>
								Download PNG
							</button>
						</div>
					)}

					{/* Reset button */}
					<button
						className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
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
						Select New Image
					</button>
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
