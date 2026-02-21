import { JobNotFoundError } from "./videoEditorErrors";

export type ExportStep = "idle" | "demux" | "audio" | "video" | "mux";

export type JobStatus = "running" | "failed" | "success" | "cancelled";

export interface StoredJob {
	id: string;
	status: JobStatus;
	step: ExportStep;
	progressPercentage: number;
	startTime: number;
	timestamp: number;
	endTime?: number;
	error?: { message: string };
	tempFileName?: string;
}

const DB_NAME = "mp4ExportDB";
const DB_VERSION = 1;
const STORE_NAME = "jobs";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
	if (dbPromise) {
		return dbPromise;
	}
	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);
		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
				store.createIndex("status", "status", { unique: false });
				store.createIndex("timestamp", "timestamp", { unique: false });
			}
		};
	});
	return dbPromise;
}

export async function saveJob(job: StoredJob): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction([STORE_NAME], "readwrite");
		const request = tx.objectStore(STORE_NAME).put(job);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

export type JobStatusUpdate = Partial<
	Pick<StoredJob, "step" | "progressPercentage" | "error" | "tempFileName" | "endTime">
>;

export async function updateJobStatus(id: string, status: JobStatus, updates?: JobStatusUpdate): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction([STORE_NAME], "readwrite");
		const store = tx.objectStore(STORE_NAME);
		const getRequest = store.get(id);
		getRequest.onsuccess = () => {
			const job = getRequest.result as StoredJob | undefined;
			if (!job) {
				reject(new JobNotFoundError(`Job ${id} not found`));
				return;
			}
			const updated: StoredJob = {
				...job,
				status,
				...(updates ?? {}),
			};
			if (status === "cancelled" || status === "failed" || status === "success") {
				updated.endTime = Date.now();
			}
			const putRequest = store.put(updated);
			putRequest.onsuccess = () => resolve();
			putRequest.onerror = () => reject(putRequest.error);
		};
		getRequest.onerror = () => reject(getRequest.error);
	});
}

export async function getJob(id: string): Promise<StoredJob | undefined> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction([STORE_NAME], "readonly");
		const request = tx.objectStore(STORE_NAME).get(id);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function getAllJobs(): Promise<StoredJob[]> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction([STORE_NAME], "readonly");
		const request = tx.objectStore(STORE_NAME).getAll();
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function getJobsByStatus(status: JobStatus): Promise<StoredJob[]> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction([STORE_NAME], "readonly");
		const request = tx.objectStore(STORE_NAME).index("status").getAll(status);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

export async function deleteJob(id: string): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction([STORE_NAME], "readwrite");
		const request = tx.objectStore(STORE_NAME).delete(id);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

export async function cleanupStaleJobs(): Promise<number> {
	const running = await getJobsByStatus("running");
	let count = 0;
	let root: FileSystemDirectoryHandle | undefined;
	for (const job of running) {
		if (job.tempFileName) {
			try {
				root ??= await navigator.storage.getDirectory();
				await root.removeEntry(job.tempFileName);
			} catch {}
		}
		await updateJobStatus(job.id, "cancelled", { endTime: Date.now() });
		count++;
	}
	return count;
}
