import React from "react";

export type TranscriptionRunningPanelProps = {
	progress: { message: string; percentage: number };
	onCancel: () => void;
};

export const TranscriptionRunningPanel = React.memo((props: TranscriptionRunningPanelProps) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center justify-between text-gray-600 text-xs">
				<span className="truncate pr-2">{props.progress.message}</span>
				<span>{props.progress.percentage}%</span>
			</div>
			<div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
				<div
					className="h-full bg-blue-600 transition-all duration-300"
					style={{ width: `${props.progress.percentage}%` }}
				/>
			</div>
			<button
				className="mt-2 w-full rounded bg-gray-100 py-1.5 font-medium text-gray-700 text-xs transition hover:bg-gray-200"
				onClick={props.onCancel}
				type="button"
			>
				Cancel
			</button>
		</div>
	);
});
