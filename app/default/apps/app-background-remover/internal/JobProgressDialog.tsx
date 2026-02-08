import { Dialog } from "@base-ui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProgressBar } from "./ProgressBar";

const JOB_QUERY_KEY = ["backgroundRemovalJob"] as const;

interface JobState {
	id: string;
	status: "idle" | "pending" | "processing" | "success" | "error" | "cancelled";
	progress: string;
	progressPercentage: number;
	error?: {
		message: string;
		code?: string;
	};
}

export function JobProgressDialog(props: { onCancel: () => void; onRetry: () => void }) {
	const queryClient = useQueryClient();
	const { data: jobState } = useQuery<JobState | null>({
		queryKey: JOB_QUERY_KEY,
		queryFn: () => {
			// Return the cached data from query client
			return queryClient.getQueryData<JobState | null>(JOB_QUERY_KEY) ?? null;
		},
		initialData: null,
		staleTime: 0,
	});

	const handleDismiss = () => {
		queryClient.setQueryData<JobState | null>(JOB_QUERY_KEY, null);
	};

	if (!jobState || jobState.status === "idle" || jobState.status === "success") {
		return null;
	}

	const isRunning = jobState.status === "pending" || jobState.status === "processing";
	const isError = jobState.status === "error";
	const isCancelled = jobState.status === "cancelled";

	return (
		<Dialog.Root modal={false} open={true}>
			<Dialog.Portal>
				<Dialog.Popup
					className="fixed bottom-20 left-4 w-80 rounded-lg border-2 border-gray-300 bg-white p-4 shadow-xl"
					style={{
						boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
						zIndex: 9999,
					}}
				>
					<div className="flex flex-col gap-3">
						{/* Header */}
						<div className="flex items-center justify-between">
							<h3 className="font-semibold text-gray-900 text-sm">Background Removal Job</h3>
							{isRunning && (
								<button
									className="font-medium text-red-600 text-xs hover:text-red-800"
									onClick={props.onCancel}
									type="button"
								>
									Cancel
								</button>
							)}
						</div>

						{/* Status */}
						<div className="flex items-center gap-2">
							<div
								className={`rounded px-2 py-1 font-medium text-xs ${
									isRunning
										? "bg-blue-100 text-blue-800"
										: isError
											? "bg-red-100 text-red-800"
											: isCancelled
												? "bg-gray-100 text-gray-800"
												: "bg-green-100 text-green-800"
								}`}
							>
								{isRunning ? "Processing" : isError ? "Failed" : isCancelled ? "Cancelled" : "Complete"}
							</div>
						</div>

						{/* Progress Bar */}
						{isRunning && (
							<div className="flex flex-col gap-1">
								<ProgressBar className="w-full" percentage={jobState.progressPercentage} />
								{jobState.progressPercentage > 0 && (
									<div className="text-right text-gray-600 text-xs">{jobState.progressPercentage}%</div>
								)}
							</div>
						)}

						{/* Progress Text */}
						{jobState.progress && <div className="text-gray-700 text-xs">{jobState.progress}</div>}

						{/* Error Details */}
						{isError && jobState.error && (
							<div className="rounded border border-red-200 bg-red-50 p-2">
								<div className="mb-1 font-medium text-red-800 text-xs">Error Details</div>
								<div className="text-red-700 text-xs">{jobState.error.message}</div>
								{jobState.error.code && <div className="mt-1 text-red-600 text-xs">Code: {jobState.error.code}</div>}
							</div>
						)}

						{/* Actions */}
						<div className="flex gap-2">
							{(isError || isCancelled) && (
								<button
									className="flex-1 rounded bg-blue-600 px-3 py-2 font-medium text-white text-xs transition-colors hover:bg-blue-700"
									onClick={props.onRetry}
									type="button"
								>
									Retry
								</button>
							)}
							{!isRunning && (
								<button
									className={`flex-1 rounded px-3 py-2 font-medium text-xs transition-colors ${
										isError || isCancelled
											? "bg-gray-200 text-gray-700 hover:bg-gray-300"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}
									onClick={handleDismiss}
									type="button"
								>
									Dismiss
								</button>
							)}
						</div>
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
