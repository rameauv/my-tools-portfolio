import type { FilterType } from "../shaders";

export type ExportStep = "idle" | "demux" | "audio" | "video" | "mux";

export interface ExportProgress {
	step: ExportStep;
	percent: number;
}

export interface ExportParams {
	fileBuffer: ArrayBuffer;
	filterType: FilterType;
	intensity: number;
	gain: number;
	videoCodec: string;
	audioCodec: string;
	framerate: number;
}

export type Mp4ExportWorkerRequest =
	| { type: "RUN_EXPORT"; id: string; params: ExportParams }
	| { type: "ABORT"; id: string };

export type Mp4ExportWorkerResponse =
	| { type: "PROGRESS"; id: string; step: ExportStep; percent: number }
	| { type: "TEMP_FILE_CREATED"; id: string; tempFileName: string }
	| { type: "SUCCESS"; id: string; tempFileName: string }
	| { type: "ERROR"; id: string; message: string }
	| { type: "CANCELLED"; id: string };
