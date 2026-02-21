export type FolderPermissionMode = "read" | "readwrite";

export type TranscriptPowerPreference = "high-performance" | "low-power";

export interface TranscriptWord {
	timestamp: [number, number];
	text: string;
}

export interface TranscriptChunkPayload {
	id?: string;
	thumbnailId?: string;
	timestamp: [number, number];
	text: string;
	words: TranscriptWord[];
}

export interface SavedTranscriptPayload {
	id: string;
	projectId: string;
	clipId: string;
	createdAt: number;
	params: {
		modelId: string;
		language: string;
		powerPreference: TranscriptPowerPreference;
	};
	result: {
		text: string;
		chunks: TranscriptChunkPayload[];
	};
}

export interface ProjectManifestSnapshot {
	filter: string;
	intensity: number;
	volume: number;
}

export interface ProjectManifestClip {
	id: string;
	fileName: string;
	filePath: string;
	mimeType: string;
	duration: number;
	createdAt: number;
}

export interface ProjectManifestThumbnail {
	id: string;
	clipId: string;
	path: string;
	time: number;
	filterType: number;
	intensity: number;
	createdAt: number;
}

export interface ProjectManifestTranscript {
	transcriptId: string;
	clipId: string;
	path: string;
	createdAt: number;
	modelId: string;
	language: string;
	powerPreference: TranscriptPowerPreference;
}

export interface ProjectManifest {
	projectId: string;
	projectName: string;
	createdAt: number;
	updatedAt: number;
	activeClipId: string;
	snapshot: ProjectManifestSnapshot;
	clips: ProjectManifestClip[];
	thumbnails: ProjectManifestThumbnail[];
	transcripts: ProjectManifestTranscript[];
}

export interface WriteSourceVideoInput {
	folderHandle: FileSystemDirectoryHandle;
	clipId: string;
	fileUuid: string;
	file: File;
}

export interface WriteThumbnailInput {
	folderHandle: FileSystemDirectoryHandle;
	thumbnailId: string;
	blob: Blob;
}

export interface WriteTranscriptInput {
	folderHandle: FileSystemDirectoryHandle;
	transcript: SavedTranscriptPayload;
}

import {
	DirectoryPickerUnsupportedError,
	InvalidFilePathError,
	InvalidProjectManifestError,
	InvalidTranscriptFormatError,
} from "./videoEditorErrors";

const MANIFEST_FILE_NAME = "project.json";

export async function pickProjectFolder(): Promise<FileSystemDirectoryHandle> {
	const pickerWindow = window as Window & {
		showDirectoryPicker?: (options?: { mode?: FolderPermissionMode }) => Promise<FileSystemDirectoryHandle>;
	};
	if (typeof pickerWindow.showDirectoryPicker !== "function") {
		throw new DirectoryPickerUnsupportedError();
	}
	return pickerWindow.showDirectoryPicker({ mode: "readwrite" });
}

export async function ensureFolderPermission(
	handle: FileSystemDirectoryHandle,
	mode: FolderPermissionMode,
): Promise<boolean> {
	const permissionHandle = handle as FileSystemDirectoryHandle & {
		queryPermission?: (descriptor?: { mode?: FolderPermissionMode }) => Promise<PermissionState>;
		requestPermission?: (descriptor?: { mode?: FolderPermissionMode }) => Promise<PermissionState>;
	};
	if (!permissionHandle.queryPermission || !permissionHandle.requestPermission) {
		return true;
	}
	const queryPermission = await permissionHandle.queryPermission({ mode });
	if (queryPermission === "granted") {
		return true;
	}
	if (queryPermission === "denied") {
		return false;
	}
	const requestPermission = await permissionHandle.requestPermission({ mode });
	return requestPermission === "granted";
}

export async function writeProjectManifest(
	folderHandle: FileSystemDirectoryHandle,
	manifest: ProjectManifest,
): Promise<void> {
	await writeJsonFile(folderHandle, MANIFEST_FILE_NAME, manifest);
}

export async function readProjectManifest(folderHandle: FileSystemDirectoryHandle): Promise<ProjectManifest> {
	const text = await readTextFile(folderHandle, MANIFEST_FILE_NAME);
	const parsed = JSON.parse(text) as Partial<ProjectManifest>;
	if (!parsed.projectId || !parsed.projectName || !parsed.activeClipId) {
		throw new InvalidProjectManifestError();
	}
	return {
		projectId: parsed.projectId,
		projectName: parsed.projectName,
		createdAt: parsed.createdAt ?? Date.now(),
		updatedAt: parsed.updatedAt ?? Date.now(),
		activeClipId: parsed.activeClipId,
		snapshot: parsed.snapshot ?? { filter: "none", intensity: 1, volume: 1 },
		clips: parsed.clips ?? [],
		thumbnails: parsed.thumbnails ?? [],
		transcripts: parsed.transcripts ?? [],
	};
}

export async function writeSourceVideoToFolder(
	input: WriteSourceVideoInput,
): Promise<{ filePath: string; fileName: string }> {
	const extension = getFileExtension(input.file.name, input.file.type);
	const fileName = `${input.clipId}-${input.fileUuid}.${extension}`;
	const filePath = `clips/${fileName}`;
	const clipDirectory = await input.folderHandle.getDirectoryHandle("clips", { create: true });
	await writeBlobFile(clipDirectory, fileName, input.file);
	return { filePath, fileName };
}

export async function writeThumbnailToFolder(input: WriteThumbnailInput): Promise<string> {
	const fileName = `${input.thumbnailId}.png`;
	const filePath = `thumbnails/${fileName}`;
	const thumbnailDirectory = await input.folderHandle.getDirectoryHandle("thumbnails", { create: true });
	await writeBlobFile(thumbnailDirectory, fileName, input.blob);
	return filePath;
}

export async function writeTranscriptToFolder(input: WriteTranscriptInput): Promise<string> {
	const fileName = `${input.transcript.id}.json`;
	const filePath = `transcripts/${fileName}`;
	const transcriptDirectory = await input.folderHandle.getDirectoryHandle("transcripts", { create: true });
	await writeJsonFile(transcriptDirectory, fileName, input.transcript);
	return filePath;
}

export async function readVideoFileFromFolder(
	folderHandle: FileSystemDirectoryHandle,
	relativePath: string,
	metadata: { fileName: string; mimeType: string },
): Promise<File> {
	const sourceFile = await readFileFromPath(folderHandle, relativePath);
	const bytes = await sourceFile.arrayBuffer();
	return new File([bytes], metadata.fileName, { type: metadata.mimeType, lastModified: Date.now() });
}

export async function readTranscriptFromFolder(
	folderHandle: FileSystemDirectoryHandle,
	relativePath: string,
): Promise<SavedTranscriptPayload> {
	const text = await readTextFileFromPath(folderHandle, relativePath);
	const parsed = JSON.parse(text) as SavedTranscriptPayload;
	if (!parsed.id || !parsed.result?.chunks) {
		throw new InvalidTranscriptFormatError();
	}
	return parsed;
}

export async function readFileFromFolder(folderHandle: FileSystemDirectoryHandle, relativePath: string): Promise<File> {
	return readFileFromPath(folderHandle, relativePath);
}

async function readTextFileFromPath(folderHandle: FileSystemDirectoryHandle, relativePath: string): Promise<string> {
	const segments = relativePath.split("/").filter(Boolean);
	if (segments.length === 0) {
		throw new InvalidFilePathError();
	}
	const fileName = segments[segments.length - 1];
	let currentDirectory = folderHandle;
	for (let i = 0; i < segments.length - 1; i++) {
		currentDirectory = await currentDirectory.getDirectoryHandle(segments[i]);
	}
	const fileHandle = await currentDirectory.getFileHandle(fileName);
	const file = await fileHandle.getFile();
	return file.text();
}

async function readFileFromPath(folderHandle: FileSystemDirectoryHandle, relativePath: string): Promise<File> {
	const segments = relativePath.split("/").filter(Boolean);
	if (segments.length === 0) {
		throw new InvalidFilePathError();
	}
	const fileName = segments[segments.length - 1];
	let currentDirectory = folderHandle;
	for (let i = 0; i < segments.length - 1; i++) {
		currentDirectory = await currentDirectory.getDirectoryHandle(segments[i]);
	}
	const fileHandle = await currentDirectory.getFileHandle(fileName);
	return fileHandle.getFile();
}

async function writeJsonFile(
	directoryHandle: FileSystemDirectoryHandle,
	fileName: string,
	payload: unknown,
): Promise<void> {
	const data = JSON.stringify(payload, null, 2);
	const blob = new Blob([data], { type: "application/json" });
	await writeBlobFile(directoryHandle, fileName, blob);
}

async function readTextFile(directoryHandle: FileSystemDirectoryHandle, fileName: string): Promise<string> {
	const fileHandle = await directoryHandle.getFileHandle(fileName);
	const file = await fileHandle.getFile();
	return file.text();
}

async function writeBlobFile(directoryHandle: FileSystemDirectoryHandle, fileName: string, blob: Blob): Promise<void> {
	const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
	const writable = await fileHandle.createWritable();
	await writable.write(blob);
	await writable.close();
}

function getFileExtension(fileName: string, mimeType: string): string {
	const normalized = fileName.trim();
	const dotIndex = normalized.lastIndexOf(".");
	if (dotIndex > 0 && dotIndex < normalized.length - 1) {
		return normalized.slice(dotIndex + 1).toLowerCase();
	}
	if (mimeType.includes("mp4")) return "mp4";
	if (mimeType.includes("webm")) return "webm";
	if (mimeType.includes("ogg")) return "ogg";
	return "bin";
}
