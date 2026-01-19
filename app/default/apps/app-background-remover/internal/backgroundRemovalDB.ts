export type JobStatus = 'running' | 'failed' | 'success' | 'cancelled';

export interface StoredJob {
	id: string;
	status: JobStatus;
	timestamp: number;
	startTime: number;
	endTime?: number;
	powerPreference: 'high-performance' | 'low-power';
	originalImage: Blob;
	processedImage?: Blob; // Only present for successful jobs
	error?: {
		message: string;
		code?: string;
	}; // Only present for failed jobs
	progress?: string; // Current progress message
	progressPercentage?: number; // Progress percentage (0-100)
}

const DB_NAME = 'backgroundRemovalDB';
const DB_VERSION = 1;
const STORE_NAME = 'jobs';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
	if (dbPromise) {
		return dbPromise;
	}

	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => {
			reject(request.error);
		};

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
				objectStore.createIndex('status', 'status', { unique: false });
				objectStore.createIndex('timestamp', 'timestamp', { unique: false });
			}
		};
	});

	return dbPromise;
}

export async function saveJob(job: StoredJob): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.put(job);

		request.onsuccess = () => {
			resolve();
		};

		request.onerror = () => {
			reject(request.error);
		};
	});
}

export async function updateJobStatus(
	id: string,
	status: JobStatus,
	updates?: Partial<Pick<StoredJob, 'error' | 'processedImage' | 'progress' | 'progressPercentage' | 'endTime'>>,
): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const getRequest = store.get(id);

		getRequest.onsuccess = () => {
			const job = getRequest.result;
			if (!job) {
				reject(new Error(`Job with id ${id} not found`));
				return;
			}

			const updatedJob: StoredJob = {
				...job,
				status,
				...(updates || {}),
			};

			if (status === 'cancelled' || status === 'failed' || status === 'success') {
				updatedJob.endTime = Date.now();
			}

			const putRequest = store.put(updatedJob);
			putRequest.onsuccess = () => {
				resolve();
			};
			putRequest.onerror = () => {
				reject(putRequest.error);
			};
		};

		getRequest.onerror = () => {
			reject(getRequest.error);
		};
	});
}

export async function getJob(id: string): Promise<StoredJob | undefined> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get(id);

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onerror = () => {
			reject(request.error);
		};
	});
}

export async function getAllJobs(): Promise<StoredJob[]> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.getAll();

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onerror = () => {
			reject(request.error);
		};
	});
}

export async function getJobsByStatus(status: JobStatus): Promise<StoredJob[]> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const index = store.index('status');
		const request = index.getAll(status);

		request.onsuccess = () => {
			resolve(request.result);
		};

		request.onerror = () => {
			reject(request.error);
		};
	});
}

export async function deleteJob(id: string): Promise<void> {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.delete(id);

		request.onsuccess = () => {
			resolve();
		};

		request.onerror = () => {
			reject(request.error);
		};
	});
}

/**
 * Marks all jobs with status "running" as "cancelled".
 * This should be called on app startup to clean up jobs that were interrupted
 * by browser close or other unexpected termination.
 */
export async function cancelStaleRunningJobs(): Promise<number> {
	const runningJobs = await getJobsByStatus('running');
	const now = Date.now();
	const STALE_THRESHOLD = 60 * 60 * 1000; // 1 hour

	let cancelledCount = 0;

	for (const job of runningJobs) {
		// Mark as cancelled if it's been running for more than 1 hour, or just mark all as cancelled
		const isStale = now - job.startTime > STALE_THRESHOLD;
		if (isStale || true) { // Always cancel stale running jobs on startup
			await updateJobStatus(job.id, 'cancelled', {
				endTime: now,
			});
			cancelledCount++;
		}
	}

	return cancelledCount;
}
