import { Pause, Play, RotateCcw } from "lucide-react";
import React from "react";

export type VideoEditorControlsProps = {
	canPlay: boolean;
	currentTimeSec: number;
	durationSec: number;
	isPlaying: boolean;
	isSyncingAudio: boolean;
	onReset: () => void;
	onSeek: (timeSec: number) => void;
	onTogglePlay: () => void;
};

export const VideoEditorControls = React.memo((props: VideoEditorControlsProps) => {
	const max = Number.isFinite(props.durationSec) && props.durationSec > 0 ? props.durationSec : 0;

	return (
		<div className="flex w-full flex-col gap-3 rounded-lg border border-gray-200 bg-white p-3">
			<div className="flex items-center gap-2">
				<button
					className="flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
					disabled={!props.canPlay}
					onClick={props.onTogglePlay}
					type="button"
				>
					{props.isPlaying ? <Pause size={18} /> : <Play size={18} />}
					{props.isPlaying ? "Pause" : "Play"}
				</button>
				<button
					className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 transition-colors hover:bg-gray-50"
					onClick={props.onReset}
					type="button"
				>
					<RotateCcw size={16} />
					Reset
				</button>
				<div className="ml-auto text-gray-600 text-sm">
					{props.isSyncingAudio ? "A/V Sync" : "Video only"} · {props.currentTimeSec.toFixed(2)}s /{" "}
					{props.durationSec.toFixed(2)}s
				</div>
			</div>

			<input
				className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600 disabled:cursor-not-allowed"
				disabled={!props.canPlay}
				max={max}
				min={0}
				onChange={(event) => props.onSeek(Number(event.target.value))}
				step={0.01}
				type="range"
				value={Math.min(props.currentTimeSec, max)}
			/>
		</div>
	);
});
