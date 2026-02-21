import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useEffect, useRef } from "react";
import type { FilterType } from "./shaders";
import { TranscriptionChunkButton } from "./TranscriptionChunkButton";
import { formatTranscriptionLanguageId } from "./TranscriptionLanguageSelect";
import { formatTranscriptionModelId } from "./TranscriptionModelSelect";

export type TranscriptChunk = {
	id: string;
	time: [number, number];
	text: string;
	words: { timestamp: [number, number]; text: string }[];
};
export interface TranscriptChunkWithPlayingState extends TranscriptChunk {
	isCurrentlyPlaying: boolean;
	words: { timestamp: [number, number]; text: string; isCurrentlyPlaying: boolean }[];
}

export type TranscriptParams = {
	modelId: string;
	language: string;
	powerPreference: "high-performance" | "low-power";
};

export type TranscriptionSuccessPanelProps = {
	transcript: TranscriptChunk[];
	transcriptParams?: TranscriptParams | null;
	onRegenerate: () => void;
	onSeek: (time: number) => void;
	autoscrollEnabled: boolean;
	matchingSentenceIndex: number | undefined;
	matchingWordIndex: number | undefined;
	thumbnailProvider:
		| ((time: number, filter: FilterType, intensity: number, signal?: AbortSignal) => Promise<string | null>)
		| null;
	filterType: FilterType;
	intensity: number;
	savedThumbnails?: Map<string, string>;
	isVideoReady?: boolean;
};

export const TranscriptionSuccessPanel = React.memo(function TranscriptionSuccessPanel(
	props: TranscriptionSuccessPanelProps,
) {
	const parentRef = useRef<HTMLDivElement>(null);

	const virtualizer = useVirtualizer({
		count: props.transcript.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 56,
		overscan: 5,
	});

	const virtualItems = virtualizer.getVirtualItems();

	useEffect(() => {
		if (props.autoscrollEnabled && props.matchingSentenceIndex !== undefined) {
			virtualizer.scrollToIndex(props.matchingSentenceIndex, {
				align: "center",
				behavior: "smooth",
			});
		}
	}, [props.matchingSentenceIndex, props.autoscrollEnabled, virtualizer]);

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-2 pr-1">
			<TranscriptionSuccessSettingsBar onRegenerate={props.onRegenerate} transcriptParams={props.transcriptParams} />
			<div
				className="min-h-0 flex-1 overflow-y-auto"
				ref={parentRef}
				style={{ contain: "strict", overflowAnchor: "none" }}
			>
				<div
					style={{
						height: virtualizer.getTotalSize(),
						position: "relative",
						width: "100%",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							width: "100%",
							transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
						}}
					>
						{virtualItems.map((virtualRow) => {
							const chunk = props.transcript[virtualRow.index];
							const isSentenceActive = props.matchingSentenceIndex === virtualRow.index;
							return (
								<div
									className="w-full"
									data-index={virtualRow.index}
									key={virtualRow.key}
									ref={virtualizer.measureElement}
								>
									<TranscriptionChunkButton
										chunk={chunk}
										filterType={props.filterType}
										intensity={props.intensity}
										isSentenceActive={isSentenceActive}
										isVideoReady={props.isVideoReady}
										matchingWordIndex={isSentenceActive ? props.matchingWordIndex : undefined}
										onSeek={props.onSeek}
										savedThumbnailUrl={props.savedThumbnails?.get(chunk.id)}
										thumbnailProvider={props.thumbnailProvider}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
});

const TranscriptionSuccessSettingsBar = React.memo(function TranscriptionSuccessSettingsBar(props: {
	transcriptParams: TranscriptParams | null | undefined;
	onRegenerate: () => void;
}) {
	return (
		<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded border border-gray-200 bg-gray-50 px-3 py-2 text-gray-600 text-xs">
			{props.transcriptParams ? (
				<div className="flex flex-wrap items-center gap-x-4 gap-y-1">
					<span>
						<strong>Model:</strong> {formatTranscriptionModelId(props.transcriptParams.modelId)}
					</span>
					<span>
						<strong>Language:</strong> {formatTranscriptionLanguageId(props.transcriptParams.language)}
					</span>
					<span>
						<strong>Power:</strong>{" "}
						{props.transcriptParams.powerPreference === "high-performance" ? "High performance" : "Low power"}
					</span>
				</div>
			) : (
				<span>Transcription</span>
			)}
			<button
				className="rounded border border-gray-300 bg-white px-2 py-1 font-medium text-gray-700 text-xs transition hover:bg-gray-100"
				onClick={props.onRegenerate}
				type="button"
			>
				Regenerate
			</button>
		</div>
	);
});
