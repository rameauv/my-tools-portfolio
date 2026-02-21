import React, { useCallback, useRef, useState } from "react";
import { VideoDropZone } from "./VideoDropZone";
import { VideoEditorView } from "./VideoEditorView";

export const VideoEditorWebcodecs = React.memo(() => {
	const [file, setFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = useCallback((selectedFile: File | null) => {
		if (!selectedFile) return;
		const isMp4 = selectedFile.type === "video/mp4" || selectedFile.name.toLowerCase().endsWith(".mp4");
		if (!isMp4) return;
		setFile(selectedFile);
	}, []);

	const handleDrop = useCallback(
		(event: React.DragEvent) => {
			event.preventDefault();
			const droppedFile = event.dataTransfer.files[0];
			handleFileSelect(droppedFile ?? null);
		},
		[handleFileSelect],
	);

	const handleReset = useCallback(() => {
		setFile(null);
	}, []);

	return (
		<div className="flex h-full flex-col overflow-hidden bg-[#f0f0f0]">
			<div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
				{file ? (
					<VideoEditorView file={file} onReset={handleReset} />
				) : (
					<VideoDropZone fileInputRef={fileInputRef} onDrop={handleDrop} onFileSelect={handleFileSelect} />
				)}
			</div>
		</div>
	);
});
