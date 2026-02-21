import { Upload } from "lucide-react";
import React from "react";

export type VideoDropZoneProps = {
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	onDrop: (event: React.DragEvent) => void;
	onFileSelect: (file: File | null) => void;
};

export const VideoDropZone = React.memo((props: VideoDropZoneProps) => {
	return (
		<div
			className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-400 border-dashed bg-white p-12 transition-colors hover:bg-gray-50"
			onClick={() => props.fileInputRef.current?.click()}
			onDragOver={(event) => event.preventDefault()}
			onDrop={props.onDrop}
		>
			<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
				<Upload size={32} />
			</div>
			<h3 className="font-medium text-gray-800 text-xl">Drop an MP4 video or click to browse</h3>
			<p className="mt-2 text-center text-gray-500">WebCodecs playback based on the official W3C sample pipeline.</p>
			<input
				accept="video/mp4,.mp4"
				className="hidden"
				onChange={(event) => props.onFileSelect(event.target.files?.[0] ?? null)}
				ref={props.fileInputRef}
				type="file"
			/>
		</div>
	);
});
