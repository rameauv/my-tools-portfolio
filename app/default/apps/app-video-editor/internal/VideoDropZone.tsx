import { Upload } from "lucide-react";
import React from "react";

export type VideoDropZoneProps = {
	fileInputRef: React.RefObject<HTMLInputElement | null>;
	onDrop: (e: React.DragEvent) => void;
	onFileSelect: (file: File | null) => void;
};

export const VideoDropZone = React.memo((props: VideoDropZoneProps) => {
	return (
		<div
			className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-400 border-dashed bg-white p-12 transition-colors hover:bg-gray-50"
			onClick={() => props.fileInputRef.current?.click()}
			onDragOver={(e) => e.preventDefault()}
			onDrop={props.onDrop}
		>
			<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
				<Upload size={32} />
			</div>
			<h3 className="font-medium text-gray-800 text-xl">Drop a video or click to browse</h3>
			<p className="mt-2 text-center text-gray-500">Supports common video formats. Real-time shader filters applied.</p>
			<input
				accept="video/*"
				className="hidden"
				onChange={(e) => props.onFileSelect(e.target.files?.[0] ?? null)}
				ref={props.fileInputRef}
				type="file"
			/>
		</div>
	);
});