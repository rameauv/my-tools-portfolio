interface ProgressBarProps {
	percentage?: number; // 0-100, undefined for indeterminate
	className?: string;
}

export function ProgressBar({ percentage, className = "" }: ProgressBarProps) {
	const isIndeterminate = percentage === undefined;

	return (
		<div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
			{isIndeterminate ? (
				<div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '50%' }} />
			) : (
				<div
					className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
					style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
				/>
			)}
		</div>
	);
}
