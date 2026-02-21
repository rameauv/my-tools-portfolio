import { Dialog } from "@base-ui/react";
import { Download, List, Pause, Play, X } from "lucide-react";
import React from "react";
import { ExportAudioCodecSelect } from "./controls/ExportAudioCodecSelect";
import { ExportFramerateSelect } from "./controls/ExportFramerateSelect";
import { ExportVideoCodecSelect } from "./controls/ExportVideoCodecSelect";
import { FilterSelect } from "./controls/FilterSelect";
import { IntensityInput } from "./controls/IntensityInput";
import { VolumeGainInput } from "./controls/VolumeGainInput";
import type { ExportFramerateOption } from "./exportCodecOptions";
import type { FilterPreset } from "./VideoEditorView";

export type VideoEditorControlsProps = {
	audioCodecs: { value: string; label: string }[];
	cancelExport: () => void;
	canExport: boolean;
	canCloseProject: boolean;
	canSaveExport: boolean;
	exportAudioCodec: string;
	exportFramerate: ExportFramerateOption;
	exportFramerateOptions: readonly { value: string; label: string }[];
	exportProgressLabel: string | null;
	exportVideoCodec: string;
	filter: FilterPreset;
	intensity: number;
	isExporting: boolean;
	isSavingProject: boolean;
	isPlaying: boolean;
	onCloseProject: () => void;
	onExportMp4: () => void;
	onExportVideoCodecChange: (value: string) => void;
	onExportAudioCodecChange: (value: string) => void;
	onExportFramerateChange: (value: ExportFramerateOption) => void;
	onFilterChange: (value: FilterPreset) => void;
	onIntensityChange: (value: number) => void;
	onSaveProject: () => void;
	onSaveExportMp4: () => void;
	onTogglePlay: () => void;
	onVolumeChange: (value: number) => void;
	videoCodecs: { value: string; label: string }[];
	volume: number;
};

export const VideoEditorControls = React.memo((props: VideoEditorControlsProps) => {
	return (
		<div className="flex flex-wrap items-center gap-4">
			<button
				className="flex cursor-pointer items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
				disabled={props.isExporting}
				onClick={props.onTogglePlay}
				type="button"
			>
				{props.isPlaying ? <Pause size={18} /> : <Play size={18} />}
				{props.isPlaying ? "Pause" : "Play"}
			</button>
			<VolumeGainInput onChange={props.onVolumeChange} value={props.volume} />
			<FilterSelect onChange={props.onFilterChange} value={props.filter} />
			<IntensityInput onChange={props.onIntensityChange} value={props.intensity} />
			<ExportVideoCodecSelect
				disabled={props.isExporting}
				onChange={props.onExportVideoCodecChange}
				options={props.videoCodecs}
				value={props.exportVideoCodec}
			/>
			<ExportAudioCodecSelect
				disabled={props.isExporting}
				onChange={props.onExportAudioCodecChange}
				options={props.audioCodecs}
				value={props.exportAudioCodec}
			/>
			<ExportFramerateSelect
				disabled={props.isExporting}
				onChange={props.onExportFramerateChange}
				options={props.exportFramerateOptions}
				value={props.exportFramerate}
			/>
			<button
				className="flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
				disabled={props.isSavingProject || props.isExporting}
				onClick={props.onSaveProject}
				type="button"
			>
				<Download size={18} />
				{props.isSavingProject ? "Saving..." : "Save project"}
			</button>
			<button
				className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
				disabled={!props.canCloseProject || props.isSavingProject}
				onClick={props.onCloseProject}
				type="button"
			>
				Close project
			</button>
			{props.isExporting ? (
				<button
					className="ml-auto flex cursor-pointer items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
					onClick={props.cancelExport}
					type="button"
				>
					<X size={18} />
					Cancel
				</button>
			) : props.canSaveExport ? (
				<button
					className="ml-auto flex cursor-pointer items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
					onClick={props.onSaveExportMp4}
					type="button"
				>
					<Download size={18} />
					Save MP4
				</button>
			) : (
				<button
					className="ml-auto flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
					disabled={!props.canExport}
					onClick={props.onExportMp4}
					type="button"
				>
					<Download size={18} />
					Export MP4
				</button>
			)}
			{props.isExporting && props.exportProgressLabel && (
				<span className="text-gray-600 text-sm tabular-nums">{props.exportProgressLabel}</span>
			)}
			<Dialog.Trigger className="ml-2 flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-50">
				<List size={18} />
			</Dialog.Trigger>
		</div>
	);
});
