import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProgressBar } from "./ProgressBar";
import { Dialog } from "@base-ui/react";

const JOB_QUERY_KEY = ['backgroundRemovalJob'] as const;

interface JobState {
	id: string;
	status: 'idle' | 'pending' | 'processing' | 'success' | 'error' | 'cancelled';
	progress: string;
	progressPercentage: number;
	error?: {
		message: string;
		code?: string;
	};
}

export function JobProgressDialog({
	onCancel,
	onRetry,
}: {
	onCancel: () => void;
	onRetry: () => void;
}) {
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

	if (!jobState || jobState.status === 'idle' || jobState.status === 'success') {
		return null;
	}

	const isRunning = jobState.status === 'pending' || jobState.status === 'processing';
	const isError = jobState.status === 'error';
	const isCancelled = jobState.status === 'cancelled';

	return (
		<Dialog.Root modal={false} open={true}>
			<Dialog.Portal>
				<Dialog.Popup
					className="fixed bottom-20 left-4 w-80 bg-white border-2 border-gray-300 shadow-xl rounded-lg p-4"
					style={{
						boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
						zIndex: 9999,
					}}
				>
					<div className="flex flex-col gap-3">
						{/* Header */}
						<div className="flex items-center justify-between">
							<h3 className="text-sm font-semibold text-gray-900">
								Background Removal Job
							</h3>
							{isRunning && (
								<button
									onClick={onCancel}
									className="text-xs text-red-600 hover:text-red-800 font-medium"
								>
									Cancel
								</button>
							)}
						</div>

						{/* Status */}
						<div className="flex items-center gap-2">
							<div
								className={`text-xs font-medium px-2 py-1 rounded ${
									isRunning
										? "bg-blue-100 text-blue-800"
										: isError
											? "bg-red-100 text-red-800"
											: isCancelled
												? "bg-gray-100 text-gray-800"
												: "bg-green-100 text-green-800"
								}`}
							>
								{isRunning
									? "Processing"
									: isError
										? "Failed"
										: isCancelled
											? "Cancelled"
											: "Complete"}
							</div>
						</div>

						{/* Progress Bar */}
						{isRunning && (
							<div className="flex flex-col gap-1">
								<ProgressBar
									percentage={jobState.progressPercentage}
									className="w-full"
								/>
								{jobState.progressPercentage > 0 && (
									<div className="text-xs text-gray-600 text-right">
										{jobState.progressPercentage}%
									</div>
								)}
							</div>
						)}

						{/* Progress Text */}
						{jobState.progress && (
							<div className="text-xs text-gray-700">{jobState.progress}</div>
						)}

						{/* Error Details */}
						{isError && jobState.error && (
							<div className="bg-red-50 border border-red-200 rounded p-2">
								<div className="text-xs font-medium text-red-800 mb-1">
									Error Details
								</div>
								<div className="text-xs text-red-700">{jobState.error.message}</div>
								{jobState.error.code && (
									<div className="text-xs text-red-600 mt-1">
										Code: {jobState.error.code}
									</div>
								)}
							</div>
						)}

						{/* Actions */}
						<div className="flex gap-2">
							{(isError || isCancelled) && (
								<button
									onClick={onRetry}
									className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
								>
									Retry
								</button>
							)}
							{!isRunning && (
								<button
									onClick={handleDismiss}
									className={`flex-1 px-3 py-2 text-xs font-medium rounded transition-colors ${
										isError || isCancelled
											? "bg-gray-200 text-gray-700 hover:bg-gray-300"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}
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
