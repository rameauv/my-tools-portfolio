export interface VideoEditorProjectIndexRecord {
	projectId: string;
	projectName: string;
	updatedAt: number;
	folderHandle: FileSystemDirectoryHandle;
}

const DB_NAME = "videoEditorProjectIndexDB";
const DB_VERSION = 1;
const STORE_NAME = "projects";

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
				const store = db.createObjectStore(STORE_NAME, { keyPath: "projectId" });
				store.createIndex("updatedAt", "updatedAt", { unique: false });
			}
		};
	});
	return dbPromise;
}

export async function saveProjectIndex(record: VideoEditorProjectIndexRecord): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction([STORE_NAME], "readwrite");
		const request = tx.objectStore(STORE_NAME).put(record);
		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

export async function getProjectIndex(projectId: string): Promise<VideoEditorProjectIndexRecord | null> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction([STORE_NAME], "readonly");
		const request = tx.objectStore(STORE_NAME).get(projectId);
		request.onsuccess = () => resolve((request.result as VideoEditorProjectIndexRecord | undefined) ?? null);
		request.onerror = () => reject(request.error);
	});
}

export async function getProjectIndexes(): Promise<VideoEditorProjectIndexRecord[]> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const tx = db.transaction([STORE_NAME], "readonly");
		const request = tx.objectStore(STORE_NAME).getAll();
		request.onsuccess = () => {
			const list = (request.result as VideoEditorProjectIndexRecord[] | undefined) ?? [];
			resolve(list.sort((a, b) => b.updatedAt - a.updatedAt));
		};
		request.onerror = () => reject(request.error);
	});
}
