import { Download, Trash2 } from "lucide-react";
import React from "react";
import type { StoredJob } from "./mp4ExportDB";

export type ExportJobHistoryProps = {
	formatDate: (timestamp: number) => string;
	jobs: StoredJob[];
	onDeleteJob: (job: StoredJob) => void;
	onSaveJob: (job: StoredJob) => void;
	pendingJobId: string | null;
};

export const ExportJobHistory = React.memo((props: ExportJobHistoryProps) => {
	return (
		<div className="flex w-full flex-col">
			{props.jobs.length === 0 ? (
				<div className="py-4 text-center text-gray-500 text-sm">No export jobs yet</div>
			) : (
				<div className="max-h-96 space-y-2 overflow-y-auto">
					{props.jobs.map((job) => (
						<div className="rounded-lg border border-gray-300 bg-white p-3" key={job.id}>
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0 flex-1">
									<div className="mb-1 flex items-center gap-2">
										<span
											className={`rounded px-2 py-1 font-medium text-xs ${
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
										<span className="text-gray-500 text-xs">{props.formatDate(job.timestamp)}</span>
										{job.id === props.pendingJobId && (
											<span className="rounded bg-amber-100 px-2 py-1 text-amber-800 text-xs">Ready to save</span>
										)}
									</div>
									{job.status === "running" && (
										<div className="text-gray-600 text-xs tabular-nums">
											{job.step} — {Math.round(job.progressPercentage)}%
										</div>
									)}
									{job.error && <div className="mt-1 text-red-600 text-xs">{job.error.message}</div>}
								</div>
								<div className="flex shrink-0 gap-2">
									{job.status === "success" && job.tempFileName && (
										<button
											className="flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white transition-colors hover:bg-emerald-700"
											onClick={() => props.onSaveJob(job)}
											type="button"
										>
											<Download size={14} />
											Save MP4
										</button>
									)}
									<button
										className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
										disabled={job.status === "running"}
										onClick={() => props.onDeleteJob(job)}
										type="button"
									>
										<Trash2 size={14} />
										Delete
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
});
