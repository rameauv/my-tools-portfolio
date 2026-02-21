import React from "react";

export type ExportAudioCodecSelectProps = {
	value: string;
	onChange: (value: string) => void;
	options: readonly { value: string; label: string }[];
	disabled?: boolean;
};

export const ExportAudioCodecSelect = React.memo((props: ExportAudioCodecSelectProps) => {
	return (
		<div className="flex items-center gap-2">
			<span className="font-medium text-gray-700 text-sm">Export audio</span>
			<select
				className="cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-sm disabled:cursor-not-allowed"
				disabled={props.disabled}
				onChange={(e) => props.onChange(e.target.value)}
				value={props.value}
			>
				{props.options.map((c) => (
					<option key={c.value} value={c.value}>
						{c.label}
					</option>
				))}
			</select>
		</div>
	);
});
