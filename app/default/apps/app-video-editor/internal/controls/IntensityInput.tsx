import React from "react";

export type IntensityInputProps = {
	value: number;
	onChange: (value: number) => void;
};

export const IntensityInput = React.memo((props: IntensityInputProps) => {
	return (
		<div className="flex items-center gap-2">
			<span className="font-medium text-gray-700 text-sm">Intensity</span>
			<input
				className="h-2 w-24 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
				max={2}
				min={0}
				onChange={(e) => props.onChange(Number(e.target.value))}
				step={0.05}
				type="range"
				value={props.value}
			/>
			<span className="text-gray-500 text-xs">{props.value.toFixed(2)}</span>
		</div>
	);
});
