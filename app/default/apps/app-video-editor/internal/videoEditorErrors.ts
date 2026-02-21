export type VideoEditorErrorCode =
	| "WorkerJobBusy"
	| "TranscriptionNoAudioTrack"
	| "TranscriptionDecodeFailure"
	| "TranscriptionPipelineInit"
	| "TranscriptionWorker"
	| "DirectoryPickerUnsupported"
	| "InvalidProjectManifest"
	| "InvalidTranscriptFormat"
	| "InvalidFilePath"
	| "FileSystemAccessUnavailable"
	| "ExportCanceled"
	| "SaveDialogFailed"
	| "WritableStreamFailed"
	| "JobNotFound"
	| "ExportWebGLPipeline"
	| "ExportOPFSUnavailable"
	| "ExportNoVideoTrack"
	| "ExportVideoDecode"
	| "ExportInvalidDimensions"
	| "ExportVideoEncode"
	| "ExportAudioDecode"
	| "ExportAudioEncode"
	| "ExportFrameFailure";

export class VideoEditorError extends Error {
	readonly code: VideoEditorErrorCode;

	constructor(message: string, code: VideoEditorErrorCode) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class WorkerJobBusyError extends VideoEditorError {
	constructor(message = "Another job is already running. Please wait for it to complete.") {
		super(message, "WorkerJobBusy");
	}
}

export class TranscriptionNoAudioTrackError extends VideoEditorError {
	constructor(message = "No audio track found in the input file.") {
		super(message, "TranscriptionNoAudioTrack");
	}
}

export class TranscriptionDecodeFailureError extends VideoEditorError {
	constructor(message = "Browser cannot decode the audio track.") {
		super(message, "TranscriptionDecodeFailure");
	}
}

export class TranscriptionPipelineInitError extends VideoEditorError {
	constructor(message = "Pipeline could not be initialized.") {
		super(message, "TranscriptionPipelineInit");
	}
}

export class TranscriptionWorkerError extends VideoEditorError {
	constructor(message: string = "Worker error") {
		super(message, "TranscriptionWorker");
	}
}

export class DirectoryPickerUnsupportedError extends VideoEditorError {
	constructor(message = "Directory picker is not supported in this browser.") {
		super(message, "DirectoryPickerUnsupported");
	}
}

export class InvalidProjectManifestError extends VideoEditorError {
	constructor(message = "Invalid project manifest format.") {
		super(message, "InvalidProjectManifest");
	}
}

export class InvalidTranscriptFormatError extends VideoEditorError {
	constructor(message = "Invalid transcript file format.") {
		super(message, "InvalidTranscriptFormat");
	}
}

export class InvalidFilePathError extends VideoEditorError {
	constructor(message = "Invalid file path.") {
		super(message, "InvalidFilePath");
	}
}

export class FileSystemAccessUnavailableError extends VideoEditorError {
	constructor(message = "File System Access API is not available in this browser.") {
		super(message, "FileSystemAccessUnavailable");
	}
}

export class ExportCanceledError extends VideoEditorError {
	constructor(message = "Export canceled: no output file selected.") {
		super(message, "ExportCanceled");
	}
}

export class SaveDialogFailedError extends VideoEditorError {
	constructor(message = "Failed to open save dialog.") {
		super(message, "SaveDialogFailed");
	}
}

export class WritableStreamFailedError extends VideoEditorError {
	constructor(message = "Failed to create writable file stream.") {
		super(message, "WritableStreamFailed");
	}
}

export class JobNotFoundError extends VideoEditorError {
	constructor(message = "Job not found") {
		super(message, "JobNotFound");
	}
}

export class ExportWebGLPipelineError extends VideoEditorError {
	constructor(message = "Unable to create WebGL pipeline for export.") {
		super(message, "ExportWebGLPipeline");
	}
}

export class ExportOPFSUnavailableError extends VideoEditorError {
	constructor(message = "OPFS sync access is not available.") {
		super(message, "ExportOPFSUnavailable");
	}
}

export class ExportNoVideoTrackError extends VideoEditorError {
	constructor(message = "No video track found in input file.") {
		super(message, "ExportNoVideoTrack");
	}
}

export class ExportVideoDecodeError extends VideoEditorError {
	constructor(message = "This browser cannot decode the input video's codec.") {
		super(message, "ExportVideoDecode");
	}
}

export class ExportInvalidDimensionsError extends VideoEditorError {
	constructor(message = "Invalid source video dimensions.") {
		super(message, "ExportInvalidDimensions");
	}
}

export class ExportVideoEncodeError extends VideoEditorError {
	constructor(codecOrMessage: string) {
		const msg = codecOrMessage.startsWith("This browser")
			? codecOrMessage
			: `This browser cannot encode video codec "${codecOrMessage}".`;
		super(msg, "ExportVideoEncode");
	}
}

export class ExportAudioDecodeError extends VideoEditorError {
	constructor(message = "This browser cannot decode the input audio's codec.") {
		super(message, "ExportAudioDecode");
	}
}

export class ExportAudioEncodeError extends VideoEditorError {
	constructor(codecOrMessage: string) {
		const msg = codecOrMessage.startsWith("This browser")
			? codecOrMessage
			: `This browser cannot encode audio codec "${codecOrMessage}".`;
		super(msg, "ExportAudioEncode");
	}
}

export class ExportFrameFailureError extends VideoEditorError {
	constructor(details: string) {
		super(details, "ExportFrameFailure");
	}
}

export function fromSerializedError(payload: { message: string; code?: VideoEditorErrorCode }): VideoEditorError {
	if (payload.code) {
		const map: Record<VideoEditorErrorCode, (msg: string) => VideoEditorError> = {
			WorkerJobBusy: (m) => new WorkerJobBusyError(m),
			TranscriptionNoAudioTrack: (m) => new TranscriptionNoAudioTrackError(m),
			TranscriptionDecodeFailure: (m) => new TranscriptionDecodeFailureError(m),
			TranscriptionPipelineInit: (m) => new TranscriptionPipelineInitError(m),
			TranscriptionWorker: (m) => new TranscriptionWorkerError(m),
			DirectoryPickerUnsupported: (m) => new DirectoryPickerUnsupportedError(m),
			InvalidProjectManifest: (m) => new InvalidProjectManifestError(m),
			InvalidTranscriptFormat: (m) => new InvalidTranscriptFormatError(m),
			InvalidFilePath: (m) => new InvalidFilePathError(m),
			FileSystemAccessUnavailable: (m) => new FileSystemAccessUnavailableError(m),
			ExportCanceled: (m) => new ExportCanceledError(m),
			SaveDialogFailed: (m) => new SaveDialogFailedError(m),
			WritableStreamFailed: (m) => new WritableStreamFailedError(m),
			JobNotFound: (m) => new JobNotFoundError(m),
			ExportWebGLPipeline: (m) => new ExportWebGLPipelineError(m),
			ExportOPFSUnavailable: (m) => new ExportOPFSUnavailableError(m),
			ExportNoVideoTrack: (m) => new ExportNoVideoTrackError(m),
			ExportVideoDecode: (m) => new ExportVideoDecodeError(m),
			ExportInvalidDimensions: (m) => new ExportInvalidDimensionsError(m),
			ExportVideoEncode: (m) => new ExportVideoEncodeError(m),
			ExportAudioDecode: (m) => new ExportAudioDecodeError(m),
			ExportAudioEncode: (m) => new ExportAudioEncodeError(m),
			ExportFrameFailure: (m) => new ExportFrameFailureError(m),
		};
		const ctor = map[payload.code];
		if (ctor) return ctor(payload.message);
	}
	return new VideoEditorError(payload.message, "TranscriptionWorker");
}
