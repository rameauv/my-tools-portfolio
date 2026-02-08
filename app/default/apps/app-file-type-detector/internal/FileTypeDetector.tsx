import { fileTypeFromBlob } from "file-type";
import { Loader2, Upload } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

export const FileTypeDetector = React.memo(() => {
	const [file, setFile] = useState<File | null>(null);
	const [detected, setDetected] = useState<{
		mime: string;
		ext?: string;
	} | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = useCallback((selectedFile: File | null) => {
		setFile(selectedFile ?? null);
		setDetected(null);
		setError(null);
	}, []);

	useEffect(() => {
		if (!file) {
			setDetected(null);
			setLoading(false);
			return;
		}
		let cancelled = false;
		setLoading(true);
		fileTypeFromBlob(file)
			.then((result) => {
				if (!cancelled) {
					setDetected(result ?? null);
					setLoading(false);
				}
			})
			.catch((err) => {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : "Detection failed");
					setDetected(null);
					setLoading(false);
				}
			});
		return () => {
			cancelled = true;
		};
	}, [file]);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const droppedFile = e.dataTransfer.files[0];
			if (droppedFile) handleFileSelect(droppedFile);
		},
		[handleFileSelect],
	);

	const mimeDisplay = detected ? detected.mime : file && !loading && !error ? "Unknown (no magic-number match)" : null;

	return (
		<div className="flex h-full flex-col overflow-hidden bg-[#f0f0f0]">
			<div className="flex-1 space-y-6 overflow-y-auto p-6">
				{!file ? (
					<div
						className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-400 border-dashed bg-white p-12 transition-colors hover:bg-gray-50"
						onClick={() => fileInputRef.current?.click()}
						onDragOver={(e) => e.preventDefault()}
						onDrop={handleDrop}
					>
						<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
							<Upload size={32} />
						</div>
						<h3 className="font-medium text-gray-800 text-xl">Drop a file or click to browse</h3>
						<p className="mt-2 text-center text-gray-500">Select any file to see its MIME type.</p>
						<input
							className="hidden"
							onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
							ref={fileInputRef}
							type="file"
						/>
					</div>
				) : (
					<div className="space-y-4">
						<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
							<div className="mb-4 flex items-center justify-between">
								<span className="font-medium text-gray-700 text-sm">Selected file</span>
								<button
									className="text-gray-500 text-sm underline hover:text-gray-700"
									onClick={() => fileInputRef.current?.click()}
									type="button"
								>
									Choose another
								</button>
							</div>
							<p className="truncate font-mono text-gray-800" title={file.name}>
								{file.name}
							</p>
							<input
								className="hidden"
								onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
								ref={fileInputRef}
								type="file"
							/>
						</div>
						<div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
							<div>
								<span className="mb-2 block font-medium text-gray-700 text-sm">Detected type (file-type)</span>
								{loading ? (
									<p className="flex items-center gap-2 font-mono text-gray-500 text-lg">
										<Loader2 className="size-5 animate-spin" />
										Detecting…
									</p>
								) : (
									<>
										<p className="break-all font-mono text-blue-700 text-lg">{mimeDisplay}</p>
										{detected?.ext != null && (
											<p className="mt-1 font-mono text-gray-600 text-sm">Extension: .{detected.ext}</p>
										)}
									</>
								)}
							</div>
							{error && <p className="text-red-600 text-sm">{error}</p>}
							{file.type && file.type.trim() !== "" && (
								<div className="border-gray-100 border-t pt-2">
									<span className="mb-1 block font-medium text-gray-500 text-xs">Reported by browser</span>
									<p className="break-all font-mono text-gray-600 text-sm">{file.type}</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
});
