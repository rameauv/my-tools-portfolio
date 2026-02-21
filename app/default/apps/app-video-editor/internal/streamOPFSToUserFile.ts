import {
	ExportCanceledError,
	FileSystemAccessUnavailableError,
	SaveDialogFailedError,
	WritableStreamFailedError,
} from "./videoEditorErrors";

type WritableFileStreamLike = WritableStream<unknown> & {
	close: () => Promise<void>;
	write: (data: BufferSource | Blob) => Promise<void>;
};

async function showSavePickerAndGetWritable(): Promise<WritableFileStreamLike> {
	const win = window as Window & {
		showSaveFilePicker?: (options?: unknown) => Promise<{
			createWritable: () => Promise<WritableFileStreamLike>;
		}>;
	};
	if (!win.showSaveFilePicker) {
		throw new FileSystemAccessUnavailableError();
	}
	let fileHandle: { createWritable: () => Promise<WritableFileStreamLike> };
	try {
		fileHandle = await win.showSaveFilePicker({
			suggestedName: `edited-${Date.now()}.mp4`,
			types: [{ description: "MP4 video", accept: { "video/mp4": [".mp4"] } }],
		});
	} catch (err) {
		if (err instanceof DOMException && err.name === "AbortError") {
			throw new ExportCanceledError();
		}
		throw new SaveDialogFailedError();
	}
	try {
		return await fileHandle.createWritable();
	} catch {
		throw new WritableStreamFailedError();
	}
}

export async function streamOPFSToUserFile(tempFileName: string): Promise<void> {
	const root = await navigator.storage.getDirectory();
	const handle = await root.getFileHandle(tempFileName);
	const file = await handle.getFile();
	const writable = await showSavePickerAndGetWritable();
	const reader = file.stream().getReader();
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			await writable.write(value);
		}
	} finally {
		reader.releaseLock();
		await writable.close();
	}
	await root.removeEntry(tempFileName);
}
