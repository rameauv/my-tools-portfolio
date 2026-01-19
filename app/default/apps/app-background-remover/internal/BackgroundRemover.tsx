import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as db from "./backgroundRemovalDB";
import { GpuInfo } from "./GpuInfo";
import { ProgressBar } from "./ProgressBar";
import { useBackgroundRemovalJob } from "./useBackgroundRemovalJob";
import { useWebGpuAdapters } from "./useWebGpuAdapters";

interface ImageState {
	file: File | null;
	url: string | null;
}

export const BackgroundRemover = React.memo(function BackgroundRemover() {
	const [originalImage, setOriginalImage] = useState<ImageState>({
		file: null,
		url: null,
	});
	const [powerPreference, setPowerPreference] = useState<
		"high-performance" | "low-power"
	>("high-performance");
	const [processedImage, setProcessedImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Use job management hook
	const {
		jobStatus,
		progress,
		progressPercentage,
		error,
		processImageMutation,
		cancelJob,
		retryJob,
		isJobRunning,
		jobResultUrl,
	} = useBackgroundRemovalJob({
		powerPreference,
	});

	// Fetch job history
	const { data: jobHistory = [], refetch: refetchHistory } = useQuery({
		queryKey: ["backgroundRemovalJobHistory"],
		queryFn: async () => {
			const jobs = await db.getAllJobs();
			// Sort by timestamp descending (newest first)
			return jobs.sort((a, b) => b.timestamp - a.timestamp);
		},
		staleTime: 10,
	});



	// Update processed image when job succeeds
	// biome-ignore lint/correctness/useExhaustiveDependencies: we don't want to re-run this effect when refetchHistory changes
		useEffect(() => {
		refetchHistory();
		if (jobStatus === "success" && jobResultUrl) {
			setProcessedImage(jobResultUrl);
		}
	}, [jobStatus, jobResultUrl]);

	// Check WebGPU availability
	const { adapters } = useWebGpuAdapters();

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
		if (isJobRunning) {
			return; // Prevent concurrent jobs
		}
		if (processedImage) {
			URL.revokeObjectURL(processedImage);
		}

		setProcessedImage(null);
		processImageMutation.mutate(originalImage.url, {
			onSuccess: async (resultArrayBuffer) => {
				// Convert ArrayBuffer to blob URL
				const blob = new Blob([resultArrayBuffer]);
				const resultUrl = URL.createObjectURL(blob);
				setProcessedImage(resultUrl);
			},
		});
	}, [originalImage, processImageMutation, isJobRunning, processedImage]);

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
				refetchHistory();
			} catch (error) {
				console.error("Failed to delete job:", error);
			}
		},
		[refetchHistory],
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
			if (jobResultUrl) {
				URL.revokeObjectURL(jobResultUrl);
			}
		};
	}, []);

	return (
		<div className="flex flex-col h-full p-4 gap-4 bg-gray-50">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-semibold">Background Remover</h2>
				<div className="flex items-center gap-2">
					{adapters !== null && adapters !== undefined && (
						<div
							className={`text-xs px-2 py-1 rounded ${
								adapters.lowPowerAdapter || adapters.highPerformanceAdapter
									? "bg-green-100 text-green-800"
									: "bg-yellow-100 text-yellow-800"
							}`}
						>
							{adapters.lowPowerAdapter || adapters.highPerformanceAdapter
								? "WebGPU Available"
								: "WebGPU Not Available"}
						</div>
					)}
				</div>
			</div>

			{/* GPU Info Section */}
			<GpuInfo
				adapters={adapters}
				isPowerPreferenceLocked={isJobRunning}
				onPowerPreferenceChange={setPowerPreference}
				powerPreference={powerPreference}
			/>

			{/* Job Status Section */}
			{isJobRunning && (
				<div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
					<div className="flex items-center justify-between mb-2">
						<div className="text-sm font-medium text-blue-900">
							{jobStatus === "pending" ? "Initializing..." : "Processing Image"}
						</div>
						<button
							className="text-xs text-red-600 hover:text-red-800 font-medium"
							onClick={cancelJob}
							type="button"
						>
							Cancel
						</button>
					</div>
					<ProgressBar className="mb-2" percentage={progressPercentage} />
					{progress && <div className="text-xs text-blue-700">{progress}</div>}
					{progressPercentage > 0 && (
						<div className="text-xs text-blue-600 text-right mt-1">
							{progressPercentage}%
						</div>
					)}
				</div>
			)}

			{/* Error message */}
			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
					<div className="font-medium mb-1">Processing failed</div>
					<div className="text-sm">{error.message}</div>
					{error.code && (
						<div className="text-xs text-red-600 mt-1">
							Error code: {error.code}
						</div>
					)}
					<button
						className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
						onClick={retryJob}
						type="button"
					>
						Retry
					</button>
				</div>
			)}

			{/* Upload area */}
			{!originalImage.url && (
				<div
					className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
					onClick={() => fileInputRef.current?.click()}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
				>
					<div className="text-center">
						<p className="text-lg font-medium mb-2">
							Drag & drop an image here
						</p>
						<p className="text-sm text-gray-500 mb-4">or click to browse</p>
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
				<div className="flex-1 flex flex-col gap-4">
					{/* Original image */}
					<div className="flex-1 flex flex-col">
						<h3 className="text-sm font-medium mb-2">Original Image</h3>
						<div className="flex-1 border rounded-lg overflow-hidden bg-white">
							<img
								alt="Original"
								className="w-full h-full object-contain"
								src={originalImage.url}
							/>
						</div>
					</div>

					{/* Process button */}
					<button
						className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
						disabled={isJobRunning}
						onClick={processImage}
						type="button"
					>
						{isJobRunning ? "Processing..." : "Remove Background"}
					</button>

					{/* Processed image */}
					{processedImage && (
						<div className="flex-1 flex flex-col">
							<h3 className="text-sm font-medium mb-2">
								Result (Transparent Background)
							</h3>
							<div className="flex-1 border rounded-lg overflow-hidden bg-white bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[length:20px_20px] bg-[0_0,0_10px,10px_-10px,-10px_0px]">
								<img
									alt="Processed"
									className="w-full h-full object-contain"
									src={processedImage}
								/>
							</div>
							<button
								className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
								onClick={downloadImage}
								type="button"
							>
								Download PNG
							</button>
						</div>
					)}

					{/* Reset button */}
					<button
						className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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
			<div className="border-t pt-4 mt-4">
				<h3 className="text-lg font-semibold mb-3">Job History</h3>
				{jobHistory.length === 0 ? (
					<div className="text-sm text-gray-500 text-center py-4">
						No job history yet
					</div>
				) : (
					<div className="space-y-2 max-h-96 overflow-y-auto">
						{jobHistory.map((job) => (
							<div
								className="border border-gray-300 rounded-lg p-3 bg-white"
								key={job.id}
							>
								<div className="flex items-start justify-between gap-2">
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span
												className={`text-xs font-medium px-2 py-1 rounded ${
													job.status === "success"
														? "bg-green-100 text-green-800"
														: job.status === "failed"
															? "bg-red-100 text-red-800"
															: job.status === "cancelled"
																? "bg-gray-100 text-gray-800"
																: "bg-blue-100 text-blue-800"
												}`}
											>
												{job.status}
											</span>
											<span className="text-xs text-gray-500">
												{formatDate(job.timestamp)}
											</span>
										</div>
										<div className="text-xs text-gray-600">
											Power: {job.powerPreference}
										</div>
										{job.error && (
											<div className="text-xs text-red-600 mt-1">
												{job.error.message}
											</div>
										)}
									</div>
									<div className="flex gap-2">
										{job.status === "success" && job.processedImage && (
											<button
												className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
												onClick={() => downloadJobResult(job)}
												title="Download result"
												type="button"
											>
												Download
											</button>
										)}
										<button
											className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
											onClick={() => deleteJob(job.id)}
											title="Delete job"
											type="button"
										>
											Delete
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
});
