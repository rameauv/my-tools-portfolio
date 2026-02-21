import { Film } from "lucide-react";
import React from "react";
import type { FilterPreset } from "../VideoEditorView";

const FILTER_OPTIONS: { value: FilterPreset; label: string }[] = [
	{ value: "none", label: "None" },
	{ value: "grayscale", label: "Grayscale" },
	{ value: "sepia", label: "Sepia" },
	{ value: "vignette", label: "Vignette" },
];

export type FilterSelectProps = {
	value: FilterPreset;
	onChange: (value: FilterPreset) => void;
};

export const FilterSelect = React.memo((props: FilterSelectProps) => {
	return (
		<div className="flex items-center gap-2">
			<Film className="text-gray-600" size={18} />
			<span className="font-medium text-gray-700 text-sm">Filter</span>
			<select
				className="cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-sm"
				onChange={(e) => props.onChange(e.target.value as FilterPreset)}
				value={props.value}
			>
				{FILTER_OPTIONS.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	);
});
