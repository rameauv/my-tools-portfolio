import React, { useCallback } from "react";

export type VideoEditorPreviewProps = {
	canvasRef: React.RefObject<HTMLCanvasElement | null>;
	videoRef: React.RefObject<HTMLVideoElement | null>;
	videoUrl: string;
	onCanPlay: (videoUrl: string) => void;
	onSeeked: () => void;
};

export const VideoEditorPreview = React.memo((props: VideoEditorPreviewProps) => {
	const handleCanPlay = useCallback(() => {
		props.onCanPlay(props.videoUrl);
	}, [props.videoUrl, props.onCanPlay]);

	return (
		<>
			<canvas
				className="max-h-full max-w-full object-contain"
				onSeeked={props.onSeeked}
				ref={props.canvasRef}
				style={{ aspectRatio: "auto" }}
			/>
			<video
				className="hidden"
				crossOrigin="anonymous"
				onCanPlay={handleCanPlay}
				onSeeked={props.onSeeked}
				playsInline
				ref={props.videoRef}
				src={props.videoUrl}
			/>
		</>
	);
});
