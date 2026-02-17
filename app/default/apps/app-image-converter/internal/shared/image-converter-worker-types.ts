export interface ProgressResponse {
	type: "PROGRESS";
	jobId: string;
	message: string;
}

export interface SuccessResponse {
	type: "SUCCESS";
	jobId: string;
	result: ArrayBuffer;
}

export interface ErrorResponse {
	type: "ERROR";
	jobId: string;
	error: string;
}

export type WorkerResponse = ProgressResponse | SuccessResponse | ErrorResponse;
