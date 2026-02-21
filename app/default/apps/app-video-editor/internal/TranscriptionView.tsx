import React, { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { FilterType } from "./shaders";
import { TranscriptionErrorPanel } from "./TranscriptionErrorPanel";
import { TranscriptionIdlePanel } from "./TranscriptionIdlePanel";
import { TranscriptionRunningPanel } from "./TranscriptionRunningPanel";
import { type TranscriptChunk, TranscriptionSuccessPanel } from "./TranscriptionSuccessPanel";
import type { TranscriptionResultPayload } from "./transcriptionService";
import { transcribeVideo } from "./transcriptionService";
import type { TranscriptionCancelHandlers } from "./transcriptionTypes";
import type { TranscriptPowerPreference } from "./videoEditorProjectFolderStorage";

const EMPTY_TRANSCRIPT_RESULT: TranscriptionResultPayload = {
	text: "",
	chunks: [],
};

type TranscribeParams = {
	model: string;
	language: string;
	powerPreference: TranscriptPowerPreference;
};

export interface SavedTranscriptState {
	params: {
		modelId: string;
		language: string;
		powerPreference: TranscriptPowerPreference;
	};
	result: TranscriptionResultPayload;
}

export type TranscriptChunkLike = {
	id?: string;
	thumbnailId?: string;
	time: [number, number];
	text: string;
	words: { timestamp: [number, number]; text: string }[];
};

export type TranscriptParams = {
	modelId: string;
	language: string;
	powerPreference: TranscriptPowerPreference;
};

export type TranscriptionViewProps = {
	file: File | null;
	currentTime: number;
	initialTranscript?: TranscriptChunkLike[] | null;
	initialTranscriptParams?: TranscriptParams | null;
	onSeek: (time: number) => void;
	onRunningStateChange?: (isRunning: boolean) => void;
	onSavedTranscriptStateChange?: (value: SavedTranscriptState | null) => void;
	thumbnailProvider?:
		| ((time: number, filter: FilterType, intensity: number, signal?: AbortSignal) => Promise<string | null>)
		| null;
	filterType?: FilterType;
	intensity?: number;
	savedThumbnails?: Map<string, string>;
	transcriptionCancelRef?: React.MutableRefObject<TranscriptionCancelHandlers | null>;
	isVideoReady?: boolean;
};

export const TranscriptionView = React.memo((props: TranscriptionViewProps) => {
	const deferredCurrentTime = useDeferredValue(props.currentTime);
	const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
	const [progress, setProgress] = useState<{ message: string; percentage: number } | null>(null);
	const [transcript, setTranscript] = useState<TranscriptChunk[] | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [abortController, setAbortController] = useState<AbortController | null>(null);
	const [autoscrollEnabled, setAutoscrollEnabled] = useState(true);
	const [latestTranscriptResult, setLatestTranscriptResult] =
		useState<TranscriptionResultPayload>(EMPTY_TRANSCRIPT_RESULT);
	const [transcriptParams, setTranscriptParams] = useState<TranscriptParams | null>(null);
	const lastTranscribeParamsRef = useRef<TranscribeParams | null>(null);

	const missingThumbnailCount = useMemo(() => {
		if (status !== "success" || !transcript?.length) return 0;
		return transcript.filter((c) => !props.savedThumbnails?.has(c.id)).length;
	}, [status, transcript, props.savedThumbnails]);

	const matchingSentenceAndWordIndex = useMemo(() => {
		const matchingSentenceIndex = transcript?.findIndex((sentence) => {
			return deferredCurrentTime >= sentence.time[0] && deferredCurrentTime <= sentence.time[1];
		});
		if (matchingSentenceIndex === undefined) {
			return null;
		}
		const matchingWord = transcript?.[matchingSentenceIndex]?.words.findIndex((word) => {
			return deferredCurrentTime >= word.timestamp[0] && deferredCurrentTime <= word.timestamp[1];
		});
		if (matchingWord === undefined) {
			return null;
		}
		return { sentenceIndex: matchingSentenceIndex, wordIndex: matchingWord };
	}, [deferredCurrentTime, transcript]);

	const handleTranscribe = useCallback(
		(params: TranscribeParams) => {
			if (!props.file) return;

			lastTranscribeParamsRef.current = params;
			setStatus("running");
			setProgress({ message: "Starting...", percentage: 0 });
			setErrorMessage(null);
			setLatestTranscriptResult(EMPTY_TRANSCRIPT_RESULT);

			const controller = new AbortController();
			setAbortController(controller);

			controller.signal.addEventListener("abort", () => {
				setStatus("idle");
				setProgress(null);
			});

			transcribeVideo(props.file, params.model, params.powerPreference, params.language, {
				onEvent: (event) => {
					if (event.type === "progress") {
						setProgress({ message: event.message, percentage: event.percentage });
					} else if (event.type === "success" && lastTranscribeParamsRef.current) {
						setStatus("success");
						setTranscriptParams({
							modelId: lastTranscribeParamsRef.current.model,
							language: lastTranscribeParamsRef.current.language,
							powerPreference: lastTranscribeParamsRef.current.powerPreference,
						});
						setLatestTranscriptResult(event.result);
						setTranscript(
							event.result.chunks.map((c) => ({
								id: c.id,
								time: c.timestamp,
								text: c.text,
								words: c.words,
							})),
						);
						setProgress(null);
					} else if (event.type === "cancelled") {
						setStatus("idle");
						setProgress(null);
					}
				},
				onError: (error) => {
					setStatus("error");
					setErrorMessage(error?.message ?? "Transcription failed");
				},
				signal: controller.signal,
			});
		},
		[props.file],
	);

	const handleCancel = useCallback(() => {
		if (abortController) {
			abortController.abort();
		}
	}, [abortController]);

	const handleRetry = useCallback(() => {
		const params = lastTranscribeParamsRef.current;
		if (params) {
			handleTranscribe(params);
		}
	}, [handleTranscribe]);

	const handleErrorDismiss = useCallback(() => {
		setStatus("idle");
		setErrorMessage(null);
	}, []);

	const handleRegenerate = useCallback(() => {
		setStatus("idle");
	}, []);

	const handleCancelRegenerate = useCallback(() => {
		setStatus("success");
	}, []);

	useEffect(() => {
		return () => {
			handleCancel();
		};
	}, [handleCancel]);

	useEffect(() => {
		props.onRunningStateChange?.(status === "running");
	}, [props.onRunningStateChange, status]);

	useEffect(() => {
		if (props.transcriptionCancelRef) {
			props.transcriptionCancelRef.current = { cancelTranscription: handleCancel };
			return () => {
				if (props.transcriptionCancelRef) {
					props.transcriptionCancelRef.current = null;
				}
			};
		}
	}, [handleCancel, props.transcriptionCancelRef]);

	useEffect(() => {
		const initial = props.initialTranscript;
		const params = props.initialTranscriptParams;
		if (initial && initial.length > 0) {
			const chunksWithId = initial.map((c) => ({
				id: c.id ?? crypto.randomUUID(),
				time: c.time,
				text: c.text,
				words: c.words,
			}));
			setTranscript(chunksWithId);
			setTranscriptParams(params ?? null);
			setStatus("success");
			const result = {
				text: initial.map((c) => c.text).join(" "),
				chunks: chunksWithId.map((c) => ({ id: c.id, timestamp: c.time, text: c.text, words: c.words })),
			};
			setLatestTranscriptResult(result);
			lastTranscribeParamsRef.current = params
				? { model: params.modelId, language: params.language, powerPreference: params.powerPreference }
				: { model: "openai/whisper-large-v3", language: "en", powerPreference: "high-performance" as const };
		} else if (initial !== undefined && (initial === null || initial.length === 0)) {
			lastTranscribeParamsRef.current = null;
			setTranscript(null);
			setTranscriptParams(null);
			setStatus("idle");
			setLatestTranscriptResult(EMPTY_TRANSCRIPT_RESULT);
		}
	}, [props.initialTranscript, props.initialTranscriptParams]);

	useEffect(() => {
		if (status !== "success" || !lastTranscribeParamsRef.current) {
			if (status === "idle" || status === "running" || status === "error") {
				props.onSavedTranscriptStateChange?.(null);
			}
			return;
		}
		props.onSavedTranscriptStateChange?.({
			params: {
				modelId: lastTranscribeParamsRef.current.model,
				language: lastTranscribeParamsRef.current.language,
				powerPreference: lastTranscribeParamsRef.current.powerPreference,
			},
			result: latestTranscriptResult,
		});
	}, [latestTranscriptResult, props.onSavedTranscriptStateChange, status]);

	return (
		<div className="flex h-full min-w-0 flex-1 shrink-0 basis-1/2 flex-col gap-3 overflow-hidden rounded-lg border border-gray-200 bg-white p-3">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-gray-800 text-sm">Transcription</h3>
				<label className="flex cursor-pointer items-center gap-2">
					<input
						checked={autoscrollEnabled}
						className="rounded border-gray-300 bg-white"
						onChange={(e) => setAutoscrollEnabled(e.target.checked)}
						type="checkbox"
					/>
					<span className="relative top-0.5 select-none text-gray-700 text-xs">Autoscroll</span>
				</label>
			</div>

			{status === "success" && missingThumbnailCount > 0 && (
				<div className="text-gray-600 text-xs">
					{props.isVideoReady
						? `${missingThumbnailCount} thumbnail${missingThumbnailCount === 1 ? "" : "s"} (load on scroll)`
						: `${missingThumbnailCount} thumbnail${missingThumbnailCount === 1 ? "" : "s"} pending (waiting for video)`}
				</div>
			)}

			{status === "idle" && (
				<TranscriptionIdlePanel
					file={props.file}
					initialLanguage={transcriptParams?.language}
					initialModel={transcriptParams?.modelId}
					initialPowerPreference={transcriptParams?.powerPreference}
					onCancel={transcript && transcriptParams ? handleCancelRegenerate : undefined}
					onTranscribe={handleTranscribe}
				/>
			)}

			{status === "running" && progress && <TranscriptionRunningPanel onCancel={handleCancel} progress={progress} />}

			{status === "error" && (
				<TranscriptionErrorPanel errorMessage={errorMessage} onDismiss={handleErrorDismiss} onRetry={handleRetry} />
			)}

			{status === "success" && transcript && (
				<TranscriptionSuccessPanel
					autoscrollEnabled={autoscrollEnabled}
					filterType={props.filterType ?? 0}
					intensity={props.intensity ?? 1}
					isVideoReady={props.isVideoReady}
					matchingSentenceIndex={matchingSentenceAndWordIndex?.sentenceIndex}
					matchingWordIndex={matchingSentenceAndWordIndex?.wordIndex}
					onRegenerate={handleRegenerate}
					onSeek={props.onSeek}
					savedThumbnails={props.savedThumbnails}
					thumbnailProvider={props.thumbnailProvider ?? null}
					transcript={transcript}
					transcriptParams={transcriptParams}
				/>
			)}
		</div>
	);
});
