import React, { useCallback, useEffect, useRef, useState } from "react";
import { VideoDropZone } from "./VideoDropZone";
import { VideoEditorView } from "./VideoEditorView";

export const VideoEditor = React.memo(() => {
	const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = useCallback(
		(file: File | null) => {
			if (videoUrl) URL.revokeObjectURL(videoUrl);
			setVideoUrl(null);
			if (!file) return;
			if (!file.type.startsWith("video/")) return;
			const url = URL.createObjectURL(file);
			setVideoUrl(url);
		},
		[videoUrl],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const file = e.dataTransfer.files[0];
			if (file) handleFileSelect(file);
		},
		[handleFileSelect],
	);

	useEffect(() => {
		return () => {
			if (videoUrl) URL.revokeObjectURL(videoUrl);
		};
	}, [videoUrl]);

	return (
		<div className="flex h-full flex-col overflow-hidden bg-[#f0f0f0]">
			<div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
				{!videoUrl ? (
					<VideoDropZone fileInputRef={fileInputRef} onDrop={handleDrop} onFileSelect={handleFileSelect} />
				) : (
					<VideoEditorView videoUrl={videoUrl} />
				)}
			</div>
		</div>
	);
});
