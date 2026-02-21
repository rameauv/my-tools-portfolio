import React from "react";
import { cn } from "~/utils/cn";
import type { FilterType } from "./shaders";
import type { TranscriptChunk } from "./TranscriptionSuccessPanel";
import { useSentenceThumbnail } from "./useSentenceThumbnail";

export type TranscriptionChunkButtonProps = {
	chunk: TranscriptChunk;
	isSentenceActive: boolean;
	matchingWordIndex: number | undefined;
	onSeek: (time: number) => void;
	thumbnailProvider:
		| ((time: number, filter: FilterType, intensity: number, signal?: AbortSignal) => Promise<string | null>)
		| null;
	filterType: FilterType;
	intensity: number;
	savedThumbnailUrl?: string | null;
	isVideoReady?: boolean;
};

export const TranscriptionChunkButton = React.memo(
	React.forwardRef<HTMLButtonElement, TranscriptionChunkButtonProps>(function TranscriptionChunkButton(props, ref) {
		const thumbnailUrl = useSentenceThumbnail(
			props.chunk.time[0],
			props.thumbnailProvider,
			props.filterType,
			props.intensity,
			props.savedThumbnailUrl,
			props.isVideoReady,
		);

		const showThumbnailSkeleton =
			props.thumbnailProvider && props.isVideoReady && !props.savedThumbnailUrl && !thumbnailUrl;

		return (
			<button
				className={`flex w-full cursor-pointer items-start gap-2 rounded p-2 text-left text-sm transition-colors ${
					props.isSentenceActive ? "bg-blue-50 text-blue-900" : "text-gray-700 hover:bg-gray-50"
				}`}
				onClick={() => props.onSeek(props.chunk.time[0])}
				ref={ref}
				type="button"
			>
				<span className="min-w-0 flex-1">
					{props.chunk.words.map((word, wordIndex) => {
						const isWordActive = props.matchingWordIndex === wordIndex && props.isSentenceActive;
						return (
							<span
								className={cn("rounded", isWordActive && "bg-blue-200 transition-all duration-75")}
								key={
									// biome-ignore lint/suspicious/noArrayIndexKey: sentence index + word index should be fine for now
									wordIndex
								}
							>
								{word.text}
							</span>
						);
					})}
				</span>
				{thumbnailUrl ? (
					<img alt="" className="h-12 w-16 shrink-0 rounded object-cover" src={thumbnailUrl} />
				) : showThumbnailSkeleton ? (
					<div aria-hidden className="h-12 w-16 shrink-0 animate-pulse rounded bg-gray-200" role="presentation" />
				) : null}
			</button>
		);
	}),
);
