import { Download, Trash2 } from "lucide-react";
import { memo } from "react";
import { Button } from "../../shared/ds/Button";
import type * as db from "./backgroundRemovalDB";

interface JobHistoryProps {
	deleteJob: (jobId: string) => void;
	downloadJobResult: (job: db.StoredJob) => void;
	formatDate: (timestamp: number) => string;
	jobs: db.StoredJob[];
}

export const JobHistory = memo((props: JobHistoryProps) => {
	return (
		<div className="mt-4 border-t pt-4">
			<h3 className="mb-3 font-semibold text-lg">Job History</h3>
			{props.jobs.length === 0 ? (
				<div className="py-4 text-center text-gray-500 text-sm">No job history yet</div>
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
									</div>
									<div className="text-gray-600 text-xs">Power: {job.powerPreference}</div>
									{job.error && <div className="mt-1 text-red-600 text-xs">{job.error.message}</div>}
								</div>
								<div className="flex gap-2">
									{job.status === "success" && job.processedImage && (
										<Button icon={<Download className="h-3.5 w-3.5" />} onClick={() => props.downloadJobResult(job)} type="button">
											Download
										</Button>
									)}
									<Button icon={<Trash2 className="h-3.5 w-3.5" />} onClick={() => props.deleteJob(job.id)} type="button">
										Delete
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
});
