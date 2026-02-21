import { Dialog } from "@base-ui/react";
import { useThrottledValue } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useExportCodecSupport } from "./core/useExportCodecSupport";
import { useVideoEditorMp4Export } from "./core/useVideoEditorMp4Export";
import { ExportJobHistory } from "./ExportJobHistory";
import type { ExportFramerateOption } from "./exportCodecOptions";
import { EXPORT_FRAMERATE_OPTIONS } from "./exportCodecOptions";
import { deleteJob as deleteJobFromDb, getAllJobs, type StoredJob } from "./mp4ExportDB";
import { resizeCanvasToMatchVideo } from "./resizeCanvasToMatchVideo";
import { FILTER_GRAYSCALE, FILTER_NONE, FILTER_SEPIA, FILTER_VIGNETTE, type FilterType } from "./shaders";
import { streamOPFSToUserFile } from "./streamOPFSToUserFile";
import type { SavedTranscriptState } from "./TranscriptionView";
import { TranscriptionView } from "./TranscriptionView";
import type { TranscriptionCancelHandlers } from "./transcriptionTypes";
import { useSetupVideoEditorPipeline } from "./useSetupVideoEditorPipeline";
import { useSyncVideoPlayingState } from "./useSyncVideoPlayingState";
import { useVideoAudioGain } from "./useVideoAudioGain";
import { useVideoEditorRenderLoop } from "./useVideoEditorRenderLoop";
import { useVideoEditorSource } from "./useVideoEditorSource";
import { useVideoThumbnailProvider } from "./useVideoThumbnailProvider";
import { VideoEditorControls } from "./VideoEditorControls";
import { VideoEditorPreview } from "./VideoEditorPreview";
import { VideoSeekbar } from "./VideoSeekbar";
import {
	ensureFolderPermission,
	type ProjectManifest,
	type ProjectManifestSnapshot,
	type ProjectManifestTranscript,
	pickProjectFolder,
	readProjectManifest,
	type SavedTranscriptPayload,
	writeProjectManifest,
	writeSourceVideoToFolder,
	writeThumbnailToFolder,
	writeTranscriptToFolder,
} from "./videoEditorProjectFolderStorage";
import { saveProjectIndex } from "./videoEditorProjectIndexDB";

export type FilterPreset = "none" | "grayscale" | "sepia" | "vignette";

const PRESET_TO_TYPE: Record<FilterPreset, FilterType> = {
	none: FILTER_NONE,
	grayscale: FILTER_GRAYSCALE,
	sepia: FILTER_SEPIA,
	vignette: FILTER_VIGNETTE,
};

export type VideoEditorViewProps = {
	file: File | null;
	initialTranscript:
		| {
				id?: string;
				thumbnailId?: string;
				time: [number, number];
				text: string;
				words: { timestamp: [number, number]; text: string }[];
		  }[]
		| null;
	initialTranscriptParams: {
		modelId: string;
		language: string;
		powerPreference: "high-performance" | "low-power";
	} | null;
	videoUrl: string;
	projectId: string | null;
	clipId: string | null;
	projectName: string | null;
	folderHandle: FileSystemDirectoryHandle | null;
	savedSnapshot: ProjectManifestSnapshot | null;
	canCloseProject: boolean;
	onCloseProject: () => void;
	onDirtyChange: (isDirty: boolean) => void;
	onProjectSaved: (payload: {
		projectId: string;
		clipId: string;
		projectName: string;
		snapshot: ProjectManifestSnapshot;
		folderHandle: FileSystemDirectoryHandle;
	}) => void;
	onTranscriptionRunningChange: (isRunning: boolean) => void;
	initialSavedThumbnails?: Map<string, string>;
	transcriptionCancelRef?: React.MutableRefObject<TranscriptionCancelHandlers | null>;
};

const THROTTLED_CURRENT_TIME_CONFIG = {
	wait: 1000,
	trailing: true,
};

export const VideoEditorView = React.memo((props: VideoEditorViewProps) => {
	const [canPlayVideoUrl, setCanPlayVideoUrl] = useState<string | null>(null);
	const [filter, setFilter] = useState<FilterPreset>("none");
	const [intensity, setIntensity] = useState(1);
	const [isPlaying, setIsPlaying] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null);
	const [exportVideoCodec, setExportVideoCodec] = useState<string>("avc");
	const [exportAudioCodec, setExportAudioCodec] = useState<string>("aac");
	const [exportFramerate, setExportFramerate] = useState<ExportFramerateOption>("source");
	const [volume, setVolume] = useState(1);
	const [projectSaveError, setProjectSaveError] = useState<string | null>(null);
	const [isSavingProject, setIsSavingProject] = useState(false);
	const [savedTranscriptState, setSavedTranscriptState] = useState<SavedTranscriptState | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const thumbnailProvider = useVideoThumbnailProvider(canPlayVideoUrl, PRESET_TO_TYPE[filter], intensity);
	const videoSource = useVideoEditorSource(videoRef, canPlayVideoUrl);
	const seekbarCurrentTime = useThrottledValue(videoSource.currentTime, THROTTLED_CURRENT_TIME_CONFIG)[0];
	const isCanPlayVideoUrlPending = canPlayVideoUrl !== props.videoUrl;

	const codecSupport = useExportCodecSupport({ dimensions: videoDimensions });
	useEffect(() => {
		if (codecSupport.videoCodecs.length > 0 && !codecSupport.videoCodecs.some((c) => c.value === exportVideoCodec)) {
			setExportVideoCodec(codecSupport.defaultVideoCodec);
		}
		if (codecSupport.audioCodecs.length > 0 && !codecSupport.audioCodecs.some((c) => c.value === exportAudioCodec)) {
			setExportAudioCodec(codecSupport.defaultAudioCodec);
		}
	}, [
		codecSupport.videoCodecs,
		codecSupport.audioCodecs,
		codecSupport.defaultVideoCodec,
		codecSupport.defaultAudioCodec,
		exportVideoCodec,
		exportAudioCodec,
	]);

	const togglePlay = useCallback(() => {
		const video = videoRef.current;
		if (!video) return;
		if (video.paused) {
			video.play().catch(() => setError("Playback failed"));
			setIsPlaying(true);
		} else {
			video.pause();
			setIsPlaying(false);
		}
	}, []);

	const pipeline = useSetupVideoEditorPipeline({
		canvasRef,
		videoRef,
	});

	const jobHistoryQuery = useQuery({
		queryKey: ["mp4ExportJobHistory"],
		queryFn: async () => {
			const jobs = await getAllJobs();
			return jobs.sort((a, b) => b.timestamp - a.timestamp);
		},
		staleTime: 10,
		initialData: [],
	});

	const mp4Export = useVideoEditorMp4Export({
		file: props.file,
		filterType: PRESET_TO_TYPE[filter],
		intensity,
		gain: volume,
		videoCodec: exportVideoCodec,
		audioCodec: exportAudioCodec,
		framerate: exportFramerate === "source" ? 0 : Number(exportFramerate),
		onJobListInvalidate: jobHistoryQuery.refetch,
		videoUrl: canPlayVideoUrl,
	});

	const handleDeleteJob = useCallback(
		async (job: StoredJob) => {
			if (job.status === "running") {
				return;
			}
			try {
				await deleteJobFromDb(job.id);
				if (job.id === mp4Export.pendingJobId) {
					mp4Export.clearPendingExport();
				}
				jobHistoryQuery.refetch();
			} catch (err) {
				console.error("Failed to delete job:", err);
			}
		},
		[jobHistoryQuery, mp4Export],
	);

	const handleSaveJobExport = useCallback(
		async (job: { id: string; tempFileName?: string }) => {
			if (!job.tempFileName) return;
			try {
				await streamOPFSToUserFile(job.tempFileName);
				await deleteJobFromDb(job.id);
				if (job.id === mp4Export.pendingJobId) {
					mp4Export.clearPendingExport();
				}
				jobHistoryQuery.refetch();
			} catch {}
		},
		[jobHistoryQuery, mp4Export],
	);

	const formatDate = useCallback((timestamp: number) => {
		return new Date(timestamp).toLocaleString();
	}, []);

	const videoEditorRenderLoop = useVideoEditorRenderLoop({
		canvasRef,
		videoRef,
		pipeline,
		readyVideoUrl: canPlayVideoUrl,
		filterType: PRESET_TO_TYPE[filter],
		intensity,
		isPlaying,
	});

	const handleSeek = useCallback((time: number) => {
		const video = videoRef.current;
		if (!video) return;
		video.currentTime = time;
	}, []);

	const handleSeeked = useCallback(() => {
		const video = videoRef.current;
		if (!video) return;
		const time = video.currentTime;
		videoEditorRenderLoop.updateFrame(performance.now() - time * 1000);
	}, [videoEditorRenderLoop.updateFrame]);

	const seekbarThumbnailProvider = useCallback(
		(time: number) => {
			return thumbnailProvider(time, PRESET_TO_TYPE[filter], intensity);
		},
		[filter, intensity, thumbnailProvider],
	);

	useSyncVideoPlayingState({
		videoRef,
		canPlayVideoUrl,
		onPlayingChange: setIsPlaying,
	});

	useVideoAudioGain(videoRef, canPlayVideoUrl, volume);

	const handleCanPlay = useCallback((videoUrl: string) => {
		const canvas = canvasRef.current;
		const video = videoRef.current;
		if (canvas && video) {
			resizeCanvasToMatchVideo(canvas, video);
			setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
		}
		setCanPlayVideoUrl(videoUrl);
	}, []);

	const exportToMp4Handler = useCallback(() => {
		void mp4Export.exportMp4();
	}, [mp4Export.exportMp4]);

	const saveExportedMp4Handler = useCallback(() => {
		void mp4Export.saveExportedMp4();
	}, [mp4Export.saveExportedMp4]);

	const saveProjectHandler = useCallback(() => {
		void (async () => {
			if (!props.file || !canPlayVideoUrl) {
				setProjectSaveError("Video is not ready for project save.");
				return;
			}
			setProjectSaveError(null);
			setIsSavingProject(true);
			try {
				const folderHandle = props.folderHandle ?? (await pickProjectFolder());
				const hasFolderPermission = await ensureFolderPermission(folderHandle, "readwrite");
				if (!hasFolderPermission) {
					setProjectSaveError("Folder permission was denied. Cannot save project.");
					return;
				}
				const now = Date.now();
				const nextProjectId = props.projectId ?? crypto.randomUUID();
				const nextClipId = props.clipId ?? crypto.randomUUID();
				const snapshot: ProjectManifestSnapshot = {
					filter,
					intensity,
					volume,
				};
				let existingManifest: ProjectManifest | null = null;
				try {
					existingManifest = await readProjectManifest(folderHandle);
				} catch {
					existingManifest = null;
				}
				const projectName = props.projectName ?? props.file.name;
				const filterType = PRESET_TO_TYPE[filter];

				const existingClip = existingManifest?.clips.find((clip) => clip.id === nextClipId);
				let savedVideo: { filePath: string; fileName: string };
				if (existingClip) {
					savedVideo = { filePath: existingClip.filePath, fileName: existingClip.fileName };
				} else {
					const fileUuid = crypto.randomUUID();
					savedVideo = await writeSourceVideoToFolder({
						folderHandle,
						clipId: nextClipId,
						file: props.file,
						fileUuid,
					});
				}

				const thumbnailTimes = buildThumbnailTimes(videoSource.duration);
				const requiredThumbnailTimes = new Set<number>(thumbnailTimes);
				if (savedTranscriptState) {
					for (const chunk of savedTranscriptState.result.chunks) {
						requiredThumbnailTimes.add(chunk.timestamp[0]);
					}
				}
				const existingThumbnailsByKey = new Map<string, { id: string; path: string }>();
				for (const thumb of existingManifest?.thumbnails ?? []) {
					if (thumb.clipId === nextClipId) {
						const key = `${Number(thumb.time).toFixed(2)}|${thumb.filterType}|${thumb.intensity}`;
						existingThumbnailsByKey.set(key, { id: thumb.id, path: thumb.path });
					}
				}
				const currentClipThumbnails: Array<{
					id: string;
					clipId: string;
					path: string;
					time: number;
					filterType: FilterType;
					intensity: number;
					createdAt: number;
				}> = [];
				const thumbnailsByBucket = new Map<string, string>();

				for (const time of requiredThumbnailTimes) {
					const key = `${Number(time).toFixed(2)}|${filterType}|${intensity}`;
					const existing = existingThumbnailsByKey.get(key);
					if (existing) {
						currentClipThumbnails.push({
							id: existing.id,
							clipId: nextClipId,
							path: existing.path,
							time: Number(time.toFixed(2)),
							filterType,
							intensity,
							createdAt: now,
						});
						thumbnailsByBucket.set(Number(time).toFixed(2), existing.id);
					} else {
						const dataUrl = await thumbnailProvider(time, filterType, intensity);
						if (!dataUrl) continue;
						const thumbnailBlob = await dataUrlToBlob(dataUrl);
						const thumbnailId = crypto.randomUUID();
						const filePath = await writeThumbnailToFolder({
							folderHandle,
							thumbnailId,
							blob: thumbnailBlob,
						});
						currentClipThumbnails.push({
							id: thumbnailId,
							clipId: nextClipId,
							path: filePath,
							time: Number(time.toFixed(2)),
							filterType,
							intensity,
							createdAt: now,
						});
						thumbnailsByBucket.set(Number(time).toFixed(2), thumbnailId);
					}
				}

				const thumbnails = [
					...(existingManifest?.thumbnails ?? []).filter((t) => t.clipId !== nextClipId),
					...currentClipThumbnails,
				];

				const otherClips = (existingManifest?.clips ?? []).filter((c) => c.id !== nextClipId);
				const clips = [
					...otherClips,
					{
						id: nextClipId,
						fileName: savedVideo.fileName,
						filePath: savedVideo.filePath,
						mimeType: props.file.type,
						duration: Math.max(videoSource.duration, 0),
						createdAt: existingClip?.createdAt ?? now,
					},
				];

				const otherTranscripts = (existingManifest?.transcripts ?? []).filter((t) => t.clipId !== nextClipId);
				let transcripts: ProjectManifestTranscript[] = otherTranscripts;

				if (savedTranscriptState) {
					const latestExistingTranscript = (existingManifest?.transcripts ?? [])
						.filter((t) => t.clipId === nextClipId)
						.sort((a, b) => b.createdAt - a.createdAt)[0];
					const transcriptId = latestExistingTranscript?.transcriptId ?? crypto.randomUUID();
					const chunksWithThumbnailId = savedTranscriptState.result.chunks.map((chunk) => {
						const time = chunk.timestamp[0];
						const bucket = Number(time).toFixed(2);
						const thumbnailId = thumbnailsByBucket.get(bucket);
						return {
							...chunk,
							thumbnailId: thumbnailId ?? undefined,
						};
					});
					const transcriptPayload: SavedTranscriptPayload = {
						id: transcriptId,
						projectId: nextProjectId,
						clipId: nextClipId,
						createdAt: now,
						params: {
							modelId: savedTranscriptState.params.modelId,
							language: savedTranscriptState.params.language,
							powerPreference: savedTranscriptState.params.powerPreference,
						},
						result: {
							text: savedTranscriptState.result.text,
							chunks: chunksWithThumbnailId,
						},
					};
					const transcriptPath = await writeTranscriptToFolder({
						folderHandle,
						transcript: transcriptPayload,
					});
					transcripts = [
						...transcripts,
						{
							transcriptId,
							clipId: nextClipId,
							path: transcriptPath,
							createdAt: now,
							modelId: transcriptPayload.params.modelId,
							language: transcriptPayload.params.language,
							powerPreference: transcriptPayload.params.powerPreference,
						},
					];
				}

				const manifest: ProjectManifest = {
					projectId: nextProjectId,
					projectName,
					createdAt: existingManifest?.createdAt ?? now,
					updatedAt: now,
					activeClipId: nextClipId,
					snapshot,
					clips,
					thumbnails,
					transcripts,
				};
				await writeProjectManifest(folderHandle, manifest);
				await saveProjectIndex({
					projectId: nextProjectId,
					projectName,
					updatedAt: now,
					folderHandle,
				});
				props.onProjectSaved({
					projectId: nextProjectId,
					clipId: nextClipId,
					projectName,
					snapshot,
					folderHandle,
				});
			} catch (err) {
				console.error("Failed to save project", err);
				setProjectSaveError("Failed to save project.");
			} finally {
				setIsSavingProject(false);
			}
		})();
	}, [
		canPlayVideoUrl,
		filter,
		intensity,
		props.clipId,
		props.file,
		props.folderHandle,
		props.onProjectSaved,
		props.projectId,
		props.projectName,
		savedTranscriptState,
		thumbnailProvider,
		videoSource.duration,
		volume,
	]);

	useEffect(() => {
		const snapshot = props.savedSnapshot;
		setFilter(parseSavedFilter(snapshot?.filter));
		setIntensity(snapshot?.intensity ?? 1);
		setVolume(snapshot?.volume ?? 1);
		setProjectSaveError(null);
	}, [props.savedSnapshot]);

	useEffect(() => {
		const snapshot = props.savedSnapshot;
		const nextIsDirty =
			!snapshot || snapshot.filter !== filter || snapshot.intensity !== intensity || snapshot.volume !== volume;
		props.onDirtyChange(nextIsDirty);
		return () => {
			props.onDirtyChange(false);
		};
	}, [filter, intensity, props.onDirtyChange, props.savedSnapshot, volume]);

	const displayJobs = useMemo(() => {
		const jobs = jobHistoryQuery.data ?? [];
		if (!mp4Export.isExporting || !mp4Export.currentJobId) {
			return jobs;
		}
		return jobs.map((job) => {
			if (job.id !== mp4Export.currentJobId) {
				return job;
			}
			return {
				...job,
				status: "running" as const,
				step: mp4Export.progressStep,
				progressPercentage: mp4Export.progressPercentage,
			};
		});
	}, [
		jobHistoryQuery.data,
		mp4Export.isExporting,
		mp4Export.currentJobId,
		mp4Export.progressStep,
		mp4Export.progressPercentage,
	]);

	const filterMatchesSaved =
		props.savedSnapshot &&
		filter === parseSavedFilter(props.savedSnapshot.filter) &&
		intensity === (props.savedSnapshot.intensity ?? 1);

	return (
		<Dialog.Root modal={false}>
			<div className="relative flex h-full w-full flex-row gap-4 overflow-hidden">
				{/* Left Container */}
				<div className="flex min-w-0 flex-1 basis-1/2 flex-col gap-3">
					<div className="relative flex min-h-80 min-w-0 flex-1 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-black">
						<VideoEditorPreview
							canvasRef={canvasRef}
							onCanPlay={handleCanPlay}
							onSeeked={handleSeeked}
							videoRef={videoRef}
							videoUrl={props.videoUrl}
						/>
						{isCanPlayVideoUrlPending && (
							<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg bg-black/60 backdrop-blur-sm">
								<div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
								<span className="text-sm text-white/60">Loading video…</span>
							</div>
						)}
					</div>
					<div className="flex min-h-0 min-w-0 shrink-0 flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3">
						<VideoSeekbar
							currentTime={seekbarCurrentTime}
							duration={videoSource.duration}
							isPlaying={isPlaying}
							onSeek={handleSeek}
							thumbnailProvider={seekbarThumbnailProvider}
						/>
						<VideoEditorControls
							audioCodecs={codecSupport.audioCodecs}
							canCloseProject={props.canCloseProject}
							cancelExport={mp4Export.cancelExport}
							canExport={mp4Export.canExport}
							canSaveExport={mp4Export.canSaveExport}
							exportAudioCodec={exportAudioCodec}
							exportFramerate={exportFramerate}
							exportFramerateOptions={EXPORT_FRAMERATE_OPTIONS}
							exportProgressLabel={mp4Export.progressLabel}
							exportVideoCodec={exportVideoCodec}
							filter={filter}
							intensity={intensity}
							isExporting={mp4Export.isExporting}
							isPlaying={isPlaying}
							isSavingProject={isSavingProject}
							onCloseProject={props.onCloseProject}
							onExportAudioCodecChange={setExportAudioCodec}
							onExportFramerateChange={setExportFramerate}
							onExportMp4={exportToMp4Handler}
							onExportVideoCodecChange={setExportVideoCodec}
							onFilterChange={setFilter}
							onIntensityChange={setIntensity}
							onSaveExportMp4={saveExportedMp4Handler}
							onSaveProject={saveProjectHandler}
							onTogglePlay={togglePlay}
							onVolumeChange={setVolume}
							videoCodecs={codecSupport.videoCodecs}
							volume={volume}
						/>
					</div>
				</div>
				{/* Right Container */}
				<TranscriptionView
					currentTime={videoSource.currentTime}
					file={props.file}
					filterType={PRESET_TO_TYPE[filter]}
					initialTranscript={props.initialTranscript}
					initialTranscriptParams={props.initialTranscriptParams}
					intensity={intensity}
					isVideoReady={!!canPlayVideoUrl}
					onRunningStateChange={props.onTranscriptionRunningChange}
					onSavedTranscriptStateChange={setSavedTranscriptState}
					onSeek={handleSeek}
					savedThumbnails={filterMatchesSaved ? props.initialSavedThumbnails : undefined}
					thumbnailProvider={thumbnailProvider}
					transcriptionCancelRef={props.transcriptionCancelRef}
				/>
			</div>

			<Dialog.Popup className="absolute top-0 right-0 z-50 flex h-full w-[500px] max-w-full flex-col gap-3 rounded-l-xl border-gray-200 border-l bg-white p-4 shadow-[-4px_0_24px_rgba(0,0,0,0.1)] outline-none">
				<div className="flex items-center justify-between border-gray-100 border-b pb-3">
					<Dialog.Title className="font-semibold text-gray-900 text-lg">Export history</Dialog.Title>
					<Dialog.Close className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900">
						<X size={18} />
					</Dialog.Close>
				</div>
				<div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
					<ExportJobHistory
						formatDate={formatDate}
						jobs={displayJobs}
						onDeleteJob={(job) => void handleDeleteJob(job)}
						onSaveJob={(job) => void handleSaveJobExport(job)}
						pendingJobId={mp4Export.pendingJobId}
					/>
				</div>
			</Dialog.Popup>

			{(error || mp4Export.error || projectSaveError) && (
				<div className="absolute bottom-4 left-4 z-50 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 text-sm shadow-lg">
					{projectSaveError ?? error ?? mp4Export.error}
				</div>
			)}
		</Dialog.Root>
	);
});

function parseSavedFilter(filter: string | undefined): FilterPreset {
	if (filter === "grayscale" || filter === "sepia" || filter === "vignette") {
		return filter;
	}
	return "none";
}

function buildThumbnailTimes(duration: number): number[] {
	if (!Number.isFinite(duration) || duration <= 0) {
		return [0];
	}
	const step = 2;
	const maxCount = 30;
	const values: number[] = [0];
	let current = step;
	while (current < duration && values.length < maxCount - 1) {
		values.push(Number(current.toFixed(2)));
		current += step;
	}
	values.push(Number(duration.toFixed(2)));
	return Array.from(new Set(values));
}

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
	const response = await fetch(dataUrl);
	return response.blob();
}
