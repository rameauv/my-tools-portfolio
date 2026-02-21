export type WorkerJobType = "transcription" | "export";

export interface ActiveJob {
	jobId: string;
	type: WorkerJobType;
	worker: Worker;
}

let activeJob: ActiveJob | null = null;

export function tryAcquireJob(type: WorkerJobType, worker: Worker, jobId: string): boolean {
	if (activeJob !== null) {
		return false;
	}
	activeJob = { type, worker, jobId };
	return true;
}

export function releaseJob(): void {
	activeJob = null;
}

export function getActiveJob(): ActiveJob | null {
	return activeJob;
}

export function isJobRunning(): boolean {
	return activeJob !== null;
}

export function canStartJob(_type?: WorkerJobType): boolean {
	return activeJob === null;
}
