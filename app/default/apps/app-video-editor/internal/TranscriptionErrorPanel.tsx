import React from "react";

export type TranscriptionErrorPanelProps = {
	errorMessage: string | null;
	onRetry: () => void;
	onDismiss: () => void;
};

export const TranscriptionErrorPanel = React.memo((props: TranscriptionErrorPanelProps) => {
	return (
		<div className="rounded bg-red-50 p-2 text-red-600 text-sm">
			{props.errorMessage}
			<div className="mt-2 flex gap-2">
				<button
					className="block flex-1 rounded bg-red-100 py-1 font-medium text-red-700 text-xs transition hover:bg-red-200"
					onClick={props.onRetry}
					type="button"
				>
					Retry
				</button>
				<button
					className="block flex-1 rounded bg-gray-200 py-1 font-medium text-gray-700 text-xs transition hover:bg-gray-300"
					onClick={props.onDismiss}
					type="button"
				>
					Cancel
				</button>
			</div>
		</div>
	);
});
