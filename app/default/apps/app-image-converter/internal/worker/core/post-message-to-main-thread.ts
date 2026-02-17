/// <reference lib="webworker" />

import type { ErrorResponse, ProgressResponse, SuccessResponse } from "../../shared/image-converter-worker-types";

declare const self: DedicatedWorkerGlobalScope;

function postMessageToMain<T extends ProgressResponse | ErrorResponse>(message: T) {
	self.postMessage(message);
}

function postSuccessToMain(jobId: string, result: ArrayBuffer) {
	self.postMessage(
		{
			type: "SUCCESS",
			jobId,
			result,
		} as SuccessResponse,
		[result],
	);
}

export const postMessageToMainThread = {
	progress: postMessageToMain<ProgressResponse>,
	success: postSuccessToMain,
	error: postMessageToMain<ErrorResponse>,
};
