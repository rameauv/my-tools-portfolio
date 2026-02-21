import { useCallback, useEffect, useRef, useState } from "react";
import type { ExportStep } from "../mp4ExportDB";
import { cleanupStaleJobs, deleteJob, getJob, saveJob, updateJobStatus } from "../mp4ExportDB";
import type { FilterType } from "../shaders";
import { streamOPFSToUserFile } from "../streamOPFSToUserFile";
import { canStartJob, releaseJob, tryAcquireJob } from "../videoEditorWorkers";
import type { Mp4ExportWorkerRequest, Mp4ExportWorkerResponse } from "../worker/mp4-export-worker-types";

export type UseVideoEditorMp4ExportProps = {
	audioCodec: string;
	file: File | null;
	filterType: FilterType;
	framerate: number;
	gain: number;
	intensity: number;
	onJobListInvalidate?: () => void;
	videoCodec: string;
	videoUrl: string | null;
};

export type UseVideoEditorMp4ExportResult = {
	cancelExport: () => void;
	canExport: boolean;
	canSaveExport: boolean;
	clearPendingExport: () => void;
	currentJobId: string | null;
	error: string | null;
	exportMp4: () => Promise<void>;
	isExporting: boolean;
	pendingJobId: string | null;
	progressPercentage: number;
	progressStep: ExportStep;
	progressLabel: string | null;
	saveExportedMp4: () => Promise<void>;
};

const getProgressLabel = (step: ExportStep, percent: number) => {
	if (step === "demux") return "Preparing source media...";
	if (step === "audio") return `Encoding audio... ${Math.round(percent)}%`;
	if (step === "video") return `Encoding video... ${Math.round(percent)}%`;
	if (step === "mux") return "Muxing MP4...";
	return null;
};

const PROGRESS_THROTTLE_MS = 300;

export const useVideoEditorMp4Export = (props: UseVideoEditorMp4ExportProps): UseVideoEditorMp4ExportResult => {
	const [step, setStep] = useState<ExportStep>("idle");
	const [percent, setPercent] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [isExporting, setIsExporting] = useState(false);
	const [pendingTempFileName, setPendingTempFileName] = useState<string | null>(null);
	const [pendingJobId, setPendingJobId] = useState<string | null>(null);
	const [currentJobId, setCurrentJobId] = useState<string | null>(null);

	const jobIdRef = useRef<string | null>(null);
	const workerRef = useRef<Worker | null>(null);
	const lastProgressTimeRef = useRef(0);

	const onJobUpdated = useCallback(async () => {
		console.log("onJobUpdated");
		const id = jobIdRef.current;
		if (!id) {
			setCurrentJobId(null);
			return;
		}
		const job = await getJob(id);
		if (!job) {
			setCurrentJobId(null);
			return;
		}
		setStep(job.step);
		setPercent(job.progressPercentage);
		setError(job.error?.message ?? null);
		setIsExporting(job.status === "running");
		setCurrentJobId(job.status === "running" ? id : null);
		if (job.status !== "running") {
			props.onJobListInvalidate?.();
		}
	}, [props.onJobListInvalidate]);

	useEffect(() => {
		cleanupStaleJobs().catch(() => {});
	}, []);

	useEffect(() => {
		if (!isExporting) return;
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [isExporting]);

	const cancelExport = useCallback(() => {
		const worker = workerRef.current;
		const jobId = jobIdRef.current;
		if (worker && jobId) {
			worker.postMessage({ type: "ABORT", id: jobId } satisfies Mp4ExportWorkerRequest);
		}
	}, []);

	const clearPendingExport = useCallback(() => {
		setPendingTempFileName(null);
		setPendingJobId(null);
		setCurrentJobId(null);
		jobIdRef.current = null;
		setStep("idle");
		setPercent(0);
		setIsExporting(false);
	}, []);

	const saveExportedMp4 = useCallback(async () => {
		const tempFileName = pendingTempFileName;
		const jobId = pendingJobId;
		if (!tempFileName || !jobId) return;
		try {
			setError(null);
			await streamOPFSToUserFile(tempFileName);
			await deleteJob(jobId);
			clearPendingExport();
			props.onJobListInvalidate?.();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save exported file.");
		}
	}, [pendingJobId, pendingTempFileName, clearPendingExport, props.onJobListInvalidate]);

	const exportMp4 = useCallback(async () => {
		if (!props.file || !props.videoUrl || isExporting) return;
		if (!canStartJob("export")) {
			setError("Another job is already running. Please wait for it to complete.");
			return;
		}

		const jobId = `mp4-export-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
		jobIdRef.current = jobId;
		setCurrentJobId(jobId);
		const startTime = Date.now();

		await saveJob({
			id: jobId,
			status: "running",
			step: "demux",
			progressPercentage: 0,
			startTime,
			timestamp: startTime,
		});
		onJobUpdated();
		props.onJobListInvalidate?.();

		const worker = new Worker(new URL("../worker/mp4-export.worker.ts", import.meta.url), { type: "module" });
		if (!tryAcquireJob("export", worker, jobId)) {
			worker.terminate();
			setError("Another job is already running. Please wait for it to complete.");
			await updateJobStatus(jobId, "failed", {
				error: { message: "Another job is already running." },
				endTime: Date.now(),
			});
			onJobUpdated();
			return;
		}
		workerRef.current = worker;

		let tempFileName: string | null = null;

		const throttledProgress = (step: ExportStep, percent: number) => {
			const now = Date.now();
			if (now - lastProgressTimeRef.current >= PROGRESS_THROTTLE_MS) {
				lastProgressTimeRef.current = now;
				updateJobStatus(jobId, "running", { step, progressPercentage: percent })
					.then(onJobUpdated)
					.catch(() => {});
			}
		};

		try {
			const fileBuffer = await props.file.arrayBuffer();
			const params = {
				fileBuffer,
				filterType: props.filterType,
				intensity: props.intensity,
				gain: props.gain,
				videoCodec: props.videoCodec,
				audioCodec: props.audioCodec,
				framerate: props.framerate,
			};

			const result = await new Promise<string>((resolve, reject) => {
				worker.onmessage = (e: MessageEvent<Mp4ExportWorkerResponse>) => {
					const msg = e.data;
					if (!msg || typeof msg !== "object" || msg.id !== jobId) return;

					switch (msg.type) {
						case "PROGRESS":
							throttledProgress(msg.step, msg.percent);
							break;
						case "TEMP_FILE_CREATED":
							tempFileName = msg.tempFileName;
							updateJobStatus(jobId, "running", { tempFileName: msg.tempFileName })
								.then(onJobUpdated)
								.catch(() => {});
							break;
						case "SUCCESS":
							resolve(msg.tempFileName);
							break;
						case "ERROR":
							reject(new Error(msg.message));
							break;
						case "CANCELLED":
							reject(new DOMException("Aborted", "AbortError"));
							break;
					}
				};

				worker.postMessage({
					type: "RUN_EXPORT",
					id: jobId,
					params,
				} satisfies Mp4ExportWorkerRequest);
			});

			tempFileName = result;

			await updateJobStatus(jobId, "success", {
				step: "mux",
				progressPercentage: 100,
				tempFileName: result,
				endTime: Date.now(),
			});
			onJobUpdated();
			setPendingTempFileName(result);
			setPendingJobId(jobId);
			setIsExporting(false);
		} catch (err) {
			const isAbort = err instanceof DOMException && err.name === "AbortError";
			await updateJobStatus(jobId, isAbort ? "cancelled" : "failed", {
				error: { message: err instanceof Error ? err.message : "Export failed" },
				endTime: Date.now(),
			});
			onJobUpdated();

			if (tempFileName) {
				try {
					const root = await navigator.storage.getDirectory();
					await root.removeEntry(tempFileName);
				} catch {}
			}
			if (!isAbort) {
				setError(err instanceof Error ? err.message : "Export failed");
			}
			jobIdRef.current = null;
			setCurrentJobId(null);
			setIsExporting(false);
		} finally {
			releaseJob();
			worker.terminate();
			workerRef.current = null;
		}
	}, [
		props.file,
		props.videoUrl,
		props.filterType,
		props.intensity,
		props.gain,
		props.videoCodec,
		props.audioCodec,
		props.framerate,
		props.onJobListInvalidate,
		isExporting,
		onJobUpdated,
	]);

	const canExport = Boolean(props.file && props.videoUrl && !isExporting);
	const canSaveExport = Boolean(!isExporting && pendingTempFileName && pendingJobId);

	return {
		cancelExport,
		canExport,
		canSaveExport,
		clearPendingExport,
		currentJobId,
		error,
		exportMp4,
		isExporting,
		pendingJobId,
		progressPercentage: percent,
		progressStep: step,
		progressLabel: isExporting ? getProgressLabel(step, percent) : null,
		saveExportedMp4,
	};
};
