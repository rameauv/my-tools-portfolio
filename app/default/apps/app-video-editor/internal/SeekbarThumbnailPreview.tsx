export const THUMBNAIL_PREVIEW_WIDTH = 160;
export const THUMBNAIL_PREVIEW_HEIGHT = 90;

export function formatTime(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s.toString().padStart(2, "0")}`;
}

type SeekbarThumbnailPreviewProps = {
	hoverPercent: number;
	hoverThumbnail: string | null;
	hoverTime: number;
};

export function SeekbarThumbnailPreview(props: SeekbarThumbnailPreviewProps) {
	return (
		<div
			className="pointer-events-none absolute bottom-full z-20 mb-2 flex flex-col items-center"
			style={{
				left: `clamp(0px, calc(${props.hoverPercent}% - ${THUMBNAIL_PREVIEW_WIDTH / 2}px), calc(100% - ${THUMBNAIL_PREVIEW_WIDTH}px))`,
				width: THUMBNAIL_PREVIEW_WIDTH,
			}}
		>
			<div className="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg ring-1 ring-slate-900/5">
				{props.hoverThumbnail ? (
					<img
						alt=""
						className="aspect-video w-full object-cover"
						height={THUMBNAIL_PREVIEW_HEIGHT}
						src={props.hoverThumbnail}
						width={THUMBNAIL_PREVIEW_WIDTH}
					/>
				) : (
					<div
						className="flex aspect-video w-full items-center justify-center bg-slate-100 text-slate-500 text-sm"
						style={{
							height: THUMBNAIL_PREVIEW_HEIGHT,
							width: THUMBNAIL_PREVIEW_WIDTH,
						}}
					>
						Loading…
					</div>
				)}
				<span className="px-2 py-1.5 font-mono text-slate-600 text-xs tabular-nums">{formatTime(props.hoverTime)}</span>
			</div>
			<div
				className="h-0 w-0 border-t-8 border-t-white border-r-8 border-r-transparent border-l-8 border-l-transparent"
				style={{ marginBottom: -1 }}
			/>
		</div>
	);
}
