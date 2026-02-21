import React from "react";
import type { ExportFramerateOption } from "../exportCodecOptions";

export type ExportFramerateSelectProps = {
	value: ExportFramerateOption;
	onChange: (value: ExportFramerateOption) => void;
	options: readonly { value: string; label: string }[];
	disabled?: boolean;
};

export const ExportFramerateSelect = React.memo((props: ExportFramerateSelectProps) => {
	return (
		<div className="flex items-center gap-2">
			<span className="font-medium text-gray-700 text-sm">Framerate</span>
			<select
				className="cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed"
				disabled={props.disabled}
				onChange={(e) => props.onChange(e.target.value as ExportFramerateOption)}
				value={props.value}
			>
				{props.options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	);
});
