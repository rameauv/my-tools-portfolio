interface ProgressBarProps {
	percentage?: number; // 0-100, undefined for indeterminate
	className?: string;
}

export function ProgressBar(props: ProgressBarProps) {
	const isIndeterminate = props.percentage === undefined;

	return (
		<div className={`h-2 w-full overflow-hidden rounded-full bg-gray-200 ${props.className ?? ""}`}>
			{isIndeterminate ? (
				<div className="h-full animate-pulse rounded-full bg-blue-600" style={{ width: "50%" }} />
			) : (
				<div
					className="h-full rounded-full bg-blue-600 transition-all duration-300 ease-out"
					style={{ width: `${Math.min(100, Math.max(0, props.percentage ?? 0))}%` }}
				/>
			)}
		</div>
	);
}
