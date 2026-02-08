import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import * as db from "./backgroundRemovalDB";
import { useBackgroundRemovalWorker } from "./useBackgroundRemovalWorker";

export type JobStatus = "idle" | "pending" | "processing" | "success" | "error" | "cancelled";

interface JobState {
	id: string;
	status: JobStatus;
	progress: string;
	progressPercentage: number;
	error?: {
		message: string;
		code?: string;
	};
	powerPreference: "high-performance" | "low-power";
	startTime: number;
	endTime?: number;
	resultUrl?: string;
}

interface UseBackgroundRemovalJobOptions {
	powerPreference: "high-performance" | "low-power";
}

const JOB_QUERY_KEY = ["backgroundRemovalJob"] as const;

export function useBackgroundRemovalJob(options: UseBackgroundRemovalJobOptions) {
	const queryClient = useQueryClient();
	const abortControllerRef = useRef<AbortController | null>(null);
	const currentJobIdRef = useRef<string | null>(null);

	// Get current job state
	const jobQuery = useQuery<JobState | null>({
		queryKey: JOB_QUERY_KEY,
		queryFn: () => {
			return queryClient.getQueryData<JobState | null>(JOB_QUERY_KEY) ?? null;
		},
		initialData: null,
		staleTime: 0,
	});

	// Worker hook
	const removalWorker = useBackgroundRemovalWorker({
		onProgress: (jobId, progress, percentage) => {
			if (jobId === currentJobIdRef.current) {
				queryClient.setQueryData<JobState | null>(JOB_QUERY_KEY, (old) => {
					if (!old || old.id !== jobId) return old;
					return {
						...old,
						progress,
						progressPercentage: percentage,
					};
				});

				// Update IndexedDB
				db.getJob(jobId).then((storedJob) => {
					if (storedJob) {
						db.updateJobStatus(jobId, storedJob.status, {
							progress,
							progressPercentage: percentage,
						});
					}
				});
			}
		},
		onSuccess: async (jobId, result) => {
			if (jobId === currentJobIdRef.current) {
				// Convert ArrayBuffer to blob URL
				const blob = new Blob([result]);
				const resultUrl = URL.createObjectURL(blob);

				const finalState: JobState = {
					id: jobId,
					status: "success",
					progress: "Processing complete!",
					progressPercentage: 100,
					powerPreference: options.powerPreference,
					startTime: jobQuery.data?.startTime || Date.now(),
					endTime: Date.now(),
					resultUrl,
				};

				queryClient.setQueryData<JobState | null>(JOB_QUERY_KEY, finalState);

				// Update IndexedDB
				const storedJob = await db.getJob(jobId);
				if (storedJob) {
					await db.updateJobStatus(jobId, "success", {
						processedImage: blob,
						progress: "Processing complete!",
						progressPercentage: 100,
						endTime: Date.now(),
					});
				}

				currentJobIdRef.current = null;
				abortControllerRef.current = null;
			}
		},
		onError: async (jobId, error) => {
			if (jobId === currentJobIdRef.current) {
				const finalState: JobState = {
					id: jobId,
					status: "error",
					progress: "",
					progressPercentage: 0,
					error,
					powerPreference: options.powerPreference,
					startTime: jobQuery.data?.startTime || Date.now(),
					endTime: Date.now(),
				};

				queryClient.setQueryData<JobState | null>(JOB_QUERY_KEY, finalState);

				// Update IndexedDB
				const storedJob = await db.getJob(jobId);
				if (storedJob) {
					await db.updateJobStatus(jobId, "failed", {
						error,
						endTime: Date.now(),
					});
				}

				currentJobIdRef.current = null;
				abortControllerRef.current = null;
			}
		},
		onCancelled: async (jobId) => {
			if (jobId === currentJobIdRef.current) {
				const finalState: JobState = {
					id: jobId,
					status: "cancelled",
					progress: "",
					progressPercentage: 0,
					powerPreference: options.powerPreference,
					startTime: jobQuery.data?.startTime || Date.now(),
					endTime: Date.now(),
				};

				queryClient.setQueryData<JobState | null>(JOB_QUERY_KEY, finalState);

				// Update IndexedDB
				const storedJob = await db.getJob(jobId);
				if (storedJob) {
					await db.updateJobStatus(jobId, "cancelled", {
						endTime: Date.now(),
					});
				}

				currentJobIdRef.current = null;
				abortControllerRef.current = null;
			}
		},
	});

	// Process image mutation
	const imageMutation = useMutation({
		mutationFn: async (imageUrl: string) => {
			// Check if there's already a job running
			const currentJob = queryClient.getQueryData<JobState | null>(JOB_QUERY_KEY);
			if (currentJob && (currentJob.status === "pending" || currentJob.status === "processing")) {
				throw new Error("A job is already running");
			}

			// Generate job ID
			const jobId = `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			currentJobIdRef.current = jobId;
			abortControllerRef.current = new AbortController();

			const startTime = Date.now();

			// Create initial job state
			const initialState: JobState = {
				id: jobId,
				status: "pending",
				progress: "Initializing...",
				progressPercentage: 0,
				powerPreference: options.powerPreference,
				startTime,
			};

			queryClient.setQueryData<JobState | null>(JOB_QUERY_KEY, initialState);

			// Get original image blob for storage
			const imageResponse = await fetch(imageUrl);
			const originalImageBlob = await imageResponse.blob();

			// Save job to IndexedDB
			await db.saveJob({
				id: jobId,
				status: "running",
				timestamp: startTime,
				startTime,
				powerPreference: options.powerPreference,
				originalImage: originalImageBlob,
				progress: "Initializing...",
				progressPercentage: 0,
			});

			// Update state to processing
			queryClient.setQueryData<JobState | null>(JOB_QUERY_KEY, {
				...initialState,
				status: "processing",
				progress: "Processing image...",
			});
			const result = await removalWorker.processImage(jobId, imageUrl, options.powerPreference);
			// The result is handled by onSuccess callback
			return result;
		},
	});

	const cancelJob = useCallback(() => {
		if (currentJobIdRef.current) {
			removalWorker.cancelJob(currentJobIdRef.current);
			abortControllerRef.current?.abort();
		}
	}, [removalWorker.cancelJob]);

	const retryJob = useCallback(async () => {
		const currentJob = queryClient.getQueryData<JobState | null>(JOB_QUERY_KEY);
		if (currentJob && (currentJob.status === "error" || currentJob.status === "cancelled")) {
			// Get the original image from IndexedDB
			try {
				const storedJob = await db.getJob(currentJob.id);
				if (storedJob?.originalImage) {
					const imageUrl = URL.createObjectURL(storedJob.originalImage);
					imageMutation.mutate(imageUrl, {
						onSettled: () => {
							// Clean up the blob URL after mutation completes
							URL.revokeObjectURL(imageUrl);
						},
					});
				} else {
					console.error("Cannot retry: original image not found in IndexedDB");
				}
			} catch (error) {
				console.error("Failed to retry job:", error);
			}
		}
	}, [imageMutation, queryClient]);

	return {
		jobStatus: jobQuery.data?.status || "idle",
		progress: jobQuery.data?.progress || "",
		progressPercentage: jobQuery.data?.progressPercentage || 0,
		error: jobQuery.data?.error,
		processImageMutation: imageMutation,
		cancelJob,
		retryJob,
		isJobRunning: jobQuery.data?.status === "pending" || jobQuery.data?.status === "processing",
		jobResultUrl: jobQuery.data?.resultUrl,
	};
}
