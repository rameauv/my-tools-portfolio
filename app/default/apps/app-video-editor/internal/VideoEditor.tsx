import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { WindowContentProps } from "../../WindowContentProps";
import { ExportJobHistory } from "./ExportJobHistory";
import { deleteJob as deleteJobFromDb, getAllJobs, type StoredJob } from "./mp4ExportDB";
import { streamOPFSToUserFile } from "./streamOPFSToUserFile";
import type { TranscriptionCancelHandlers } from "./transcriptionTypes";
import { VideoDropZone } from "./VideoDropZone";
import { VideoEditorView } from "./VideoEditorView";
import {
	ensureFolderPermission,
	type ProjectManifestSnapshot,
	readFileFromFolder,
	readProjectManifest,
	readTranscriptFromFolder,
	readVideoFileFromFolder,
} from "./videoEditorProjectFolderStorage";
import { getProjectIndexes, saveProjectIndex, type VideoEditorProjectIndexRecord } from "./videoEditorProjectIndexDB";

export const VideoEditor = React.memo((props: WindowContentProps) => {
	const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [projectId, setProjectId] = useState<string | null>(null);
	const [clipId, setClipId] = useState<string | null>(null);
	const [projectName, setProjectName] = useState<string | null>(null);
	const [folderHandle, setFolderHandle] = useState<FileSystemDirectoryHandle | null>(null);
	const [savedSnapshot, setSavedSnapshot] = useState<ProjectManifestSnapshot | null>(null);
	const [projectDirty, setProjectDirty] = useState(false);
	const [isTranscriptionRunning, setIsTranscriptionRunning] = useState(false);
	const [projectError, setProjectError] = useState<string | null>(null);
	const [initialTranscript, setInitialTranscript] = useState<
		| {
				id?: string;
				thumbnailId?: string;
				time: [number, number];
				text: string;
				words: { timestamp: [number, number]; text: string }[];
		  }[]
		| null
	>(null);
	const [initialSavedThumbnails, setInitialSavedThumbnails] = useState<Map<string, string>>(new Map());
	const transcriptionCancelRef = useRef<TranscriptionCancelHandlers | null>(null);
	const [initialTranscriptParams, setInitialTranscriptParams] = useState<{
		modelId: string;
		language: string;
		powerPreference: "high-performance" | "low-power";
	} | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const jobHistoryQuery = useQuery({
		queryKey: ["mp4ExportJobHistory"],
		queryFn: async () => {
			const jobs = await getAllJobs();
			return jobs.sort((a, b) => b.timestamp - a.timestamp);
		},
		staleTime: 10,
		initialData: [],
	});
	const projectListQuery = useQuery({
		queryKey: ["videoEditorProjectList"],
		queryFn: getProjectIndexes,
		staleTime: 10,
		initialData: [],
	});

	const handleFileSelect = useCallback(
		(file: File | null) => {
			if (videoUrl) URL.revokeObjectURL(videoUrl);
			initialSavedThumbnails.forEach((url) => {
				URL.revokeObjectURL(url);
			});
			setInitialSavedThumbnails(new Map());
			setVideoUrl(null);
			setFile(null);
			if (!file) return;
			if (!file.type.startsWith("video/")) return;
			const url = URL.createObjectURL(file);
			setFile(file);
			setVideoUrl(url);
			setProjectId(null);
			setClipId(null);
			setProjectName(file.name);
			setFolderHandle(null);
			setSavedSnapshot(null);
			setInitialTranscript(null);
			setInitialTranscriptParams(null);
			setProjectDirty(true);
			setIsTranscriptionRunning(false);
			setProjectError(null);
		},
		[videoUrl, initialSavedThumbnails],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const file = e.dataTransfer.files[0];
			if (file) handleFileSelect(file);
		},
		[handleFileSelect],
	);

	const handleDeleteJobNoVideo = useCallback(
		async (job: StoredJob) => {
			if (job.status === "running") {
				return;
			}
			try {
				await deleteJobFromDb(job.id);
				jobHistoryQuery.refetch();
			} catch (err) {
				console.error("Failed to delete job:", err);
			}
		},
		[jobHistoryQuery],
	);

	const handleSaveJobExportNoVideo = useCallback(
		async (job: { id: string; tempFileName?: string }) => {
			if (!job.tempFileName) return;
			try {
				await streamOPFSToUserFile(job.tempFileName);
				await deleteJobFromDb(job.id);
				jobHistoryQuery.refetch();
			} catch {}
		},
		[jobHistoryQuery],
	);

	const formatDate = useCallback((timestamp: number) => {
		return new Date(timestamp).toLocaleString();
	}, []);

	const closeCurrentProject = useCallback(() => {
		if (videoUrl) {
			URL.revokeObjectURL(videoUrl);
		}
		initialSavedThumbnails.forEach((url) => {
			URL.revokeObjectURL(url);
		});
		setInitialSavedThumbnails(new Map());
		setVideoUrl(null);
		setFile(null);
		setProjectId(null);
		setClipId(null);
		setProjectName(null);
		setFolderHandle(null);
		setSavedSnapshot(null);
		setInitialTranscript(null);
		setInitialTranscriptParams(null);
		setProjectDirty(false);
		setIsTranscriptionRunning(false);
		setProjectError(null);
	}, [videoUrl, initialSavedThumbnails]);

	const handleCloseProject = useCallback(() => {
		if (projectDirty) {
			setProjectError("Save project before closing it.");
			return;
		}
		if (isTranscriptionRunning) {
			transcriptionCancelRef.current?.cancelTranscription();
		}
		closeCurrentProject();
	}, [closeCurrentProject, isTranscriptionRunning, projectDirty]);

	const handleOpenProject = useCallback(
		(projectItem: VideoEditorProjectIndexRecord) => {
			void (async () => {
				try {
					const hasPermission = await ensureFolderPermission(projectItem.folderHandle, "readwrite");
					if (!hasPermission) {
						setProjectError("Cannot open project: folder permission was denied.");
						return;
					}
					const manifest = await readProjectManifest(projectItem.folderHandle);
					const activeClip = manifest.clips.find((clip) => clip.id === manifest.activeClipId) ?? manifest.clips[0];
					if (!activeClip) {
						setProjectError("Cannot open this project: no active clip found.");
						return;
					}
					const loadedFile = await readVideoFileFromFolder(projectItem.folderHandle, activeClip.filePath, {
						fileName: activeClip.fileName,
						mimeType: activeClip.mimeType,
					});
					const clipTranscripts = (manifest.transcripts ?? []).filter((t) => t.clipId === activeClip.id);
					const latestTranscriptEntry = clipTranscripts.sort((a, b) => b.createdAt - a.createdAt)[0];
					let loadedTranscript:
						| { time: [number, number]; text: string; words: { timestamp: [number, number]; text: string }[] }[]
						| null = null;
					let loadedTranscriptParams: {
						modelId: string;
						language: string;
						powerPreference: "high-performance" | "low-power";
					} | null = null;
					const savedThumbnails = new Map<string, string>();
					if (latestTranscriptEntry) {
						try {
							const transcriptPayload = await readTranscriptFromFolder(
								projectItem.folderHandle,
								latestTranscriptEntry.path,
							);
							for (const c of transcriptPayload.result.chunks) {
								if (c.id && c.thumbnailId) {
									const thumb = manifest.thumbnails.find((t) => t.id === c.thumbnailId);
									if (thumb) {
										try {
											const thumbFile = await readFileFromFolder(projectItem.folderHandle, thumb.path);
											const blobUrl = URL.createObjectURL(thumbFile);
											savedThumbnails.set(c.id, blobUrl);
										} catch {}
									}
								}
							}
							loadedTranscript = transcriptPayload.result.chunks.map((c) => ({
								id: c.id,
								thumbnailId: c.thumbnailId,
								time: c.timestamp,
								text: c.text,
								words: c.words,
							}));
							loadedTranscriptParams = latestTranscriptEntry;
						} catch {}
					}
					if (videoUrl) URL.revokeObjectURL(videoUrl);
					initialSavedThumbnails.forEach((url) => {
						URL.revokeObjectURL(url);
					});
					const url = URL.createObjectURL(loadedFile);
					setFile(loadedFile);
					setVideoUrl(url);
					setProjectId(manifest.projectId);
					setClipId(activeClip.id);
					setProjectName(manifest.projectName);
					setFolderHandle(projectItem.folderHandle);
					setSavedSnapshot(manifest.snapshot);
					setInitialTranscript(loadedTranscript);
					setInitialTranscriptParams(loadedTranscriptParams);
					setInitialSavedThumbnails(savedThumbnails);
					setProjectDirty(false);
					setIsTranscriptionRunning(false);
					setProjectError(null);
					await saveProjectIndex({
						projectId: manifest.projectId,
						projectName: manifest.projectName,
						updatedAt: manifest.updatedAt,
						folderHandle: projectItem.folderHandle,
					});
					projectListQuery.refetch();
				} catch (err) {
					console.error("Failed to open project", err);
					setProjectError("Cannot open project: missing or invalid project files.");
				}
			})();
		},
		[projectListQuery, videoUrl, initialSavedThumbnails],
	);

	const handleProjectSaved = useCallback(
		(nextProject: {
			projectId: string;
			clipId: string;
			projectName: string;
			snapshot: ProjectManifestSnapshot;
			folderHandle: FileSystemDirectoryHandle;
		}) => {
			setProjectId(nextProject.projectId);
			setClipId(nextProject.clipId);
			setProjectName(nextProject.projectName);
			setFolderHandle(nextProject.folderHandle);
			setSavedSnapshot(nextProject.snapshot);
			setProjectDirty(false);
			setProjectError(null);
			projectListQuery.refetch();
		},
		[projectListQuery],
	);

	useEffect(() => {
		return () => {
			if (videoUrl) URL.revokeObjectURL(videoUrl);
		};
	}, [videoUrl]);

	const canCloseProvider = useCallback(async () => {
		const jobs = await getAllJobs();
		const runningJob = jobs.some((job) => job.status === "running");
		if (runningJob) {
			return { text: "You cannot close the video editor while an export job is running." };
		}
		if (isTranscriptionRunning) {
			transcriptionCancelRef.current?.cancelTranscription();
		}
		if (videoUrl && projectDirty) {
			return { text: "Save the current project before closing the video editor." };
		}
		return null;
	}, [isTranscriptionRunning, projectDirty, videoUrl]);

	useEffect(() => {
		props.api.onSetCanCloseStatusProvider(props.id, canCloseProvider);
	}, [canCloseProvider, props.api, props.id]);

	return (
		<div className="flex h-full flex-col overflow-hidden bg-[#f0f0f0]">
			<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
				{!videoUrl ? (
					<>
						<div className="flex w-full flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold text-lg">Projects</h3>
								<span className="text-gray-500 text-xs">
									{projectListQuery.data.length} saved project
									{projectListQuery.data.length === 1 ? "" : "s"}
								</span>
							</div>
							{projectListQuery.data.length === 0 ? (
								<p className="text-gray-500 text-sm">No saved projects yet.</p>
							) : (
								<div className="flex flex-col gap-2">
									{projectListQuery.data.map((projectItem) => (
										<div
											className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
											key={projectItem.projectId}
										>
											<div className="flex flex-col">
												<span className="font-medium text-gray-800 text-sm">{projectItem.projectName}</span>
												<span className="text-gray-500 text-xs">Updated {formatDate(projectItem.updatedAt)}</span>
											</div>
											<button
												className="cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
												onClick={() => handleOpenProject(projectItem)}
												type="button"
											>
												Open
											</button>
										</div>
									))}
								</div>
							)}
						</div>
						<VideoDropZone fileInputRef={fileInputRef} onDrop={handleDrop} onFileSelect={handleFileSelect} />
						<div className="flex w-full flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3">
							<h3 className="font-semibold text-lg">Export history</h3>
							<ExportJobHistory
								formatDate={formatDate}
								jobs={jobHistoryQuery.data ?? []}
								onDeleteJob={(job) => void handleDeleteJobNoVideo(job)}
								onSaveJob={(job) => void handleSaveJobExportNoVideo(job)}
								pendingJobId={null}
							/>
						</div>
					</>
				) : (
					<VideoEditorView
						canCloseProject={!projectDirty && !isTranscriptionRunning}
						clipId={clipId}
						file={file}
						folderHandle={folderHandle}
						initialSavedThumbnails={initialSavedThumbnails}
						initialTranscript={initialTranscript}
						initialTranscriptParams={initialTranscriptParams}
						onCloseProject={handleCloseProject}
						onDirtyChange={setProjectDirty}
						onProjectSaved={handleProjectSaved}
						onTranscriptionRunningChange={setIsTranscriptionRunning}
						projectId={projectId}
						projectName={projectName}
						savedSnapshot={savedSnapshot}
						transcriptionCancelRef={transcriptionCancelRef}
						videoUrl={videoUrl}
					/>
				)}
				{projectError && (
					<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 text-sm">
						{projectError}
					</div>
				)}
			</div>
		</div>
	);
});
