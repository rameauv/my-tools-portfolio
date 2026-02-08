import { Download, Image as ImageIcon, RefreshCw, Settings2, Upload, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useImageConverterWorker } from "./useImageConverterWorker";

interface ImageState {
	file: File | null;
	url: string | null;
}

const SUPPORTED_FORMATS = ["WEBP", "JPEG", "PNG"];

export const ImageConverter = React.memo(() => {
	const [image, setImage] = useState<ImageState>({ file: null, url: null });
	const [targetFormat, setTargetFormat] = useState("WEBP");
	const [quality, setQuality] = useState(80);
	const [compression, setCompression] = useState(6);
	const [isConverting, setIsConverting] = useState(false);
	const [conversionProgress, setConversionProgress] = useState("");
	const [resultUrl, setResultUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const onProgress = useCallback((_jobId: string, message: string) => {
		setConversionProgress(message);
	}, []);

	const onSuccess = useCallback(
		(_jobId: string, result: ArrayBuffer) => {
			const blob = new Blob([result], {
				type: `image/${targetFormat.toLowerCase()}`,
			});
			const url = URL.createObjectURL(blob);
			setResultUrl(url);
			setIsConverting(false);
			setConversionProgress("");
		},
		[targetFormat],
	);

	const onError = useCallback((_jobId: string, error: string) => {
		setError(error);
		setIsConverting(false);
		setConversionProgress("");
	}, []);

	const imageConverterWorker = useImageConverterWorker({
		onProgress,
		onSuccess,
		onError,
	});

	const handleFileSelect = useCallback(
		(file: File | null) => {
			if (!file) return;
			if (!file.type.startsWith("image/")) {
				setError("Please select an image file.");
				return;
			}

			if (image.url) URL.revokeObjectURL(image.url);
			if (resultUrl) URL.revokeObjectURL(resultUrl);

			const url = URL.createObjectURL(file);
			setImage({ file, url });
			setResultUrl(null);
			setError(null);
			setConversionProgress("");
		},
		[image.url, resultUrl],
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			const file = e.dataTransfer.files[0];
			if (file) handleFileSelect(file);
		},
		[handleFileSelect],
	);

	const handleStartConversion = useCallback(async () => {
		if (!image.file) return;

		setIsConverting(true);
		setError(null);
		setConversionProgress("Reading image data...");

		try {
			const buffer = await image.file.arrayBuffer();
			await imageConverterWorker.convertImage(`job-${Date.now()}`, buffer, targetFormat, {
				quality,
				compression,
			});
		} catch (err: unknown) {
			const error = err instanceof Error ? err : new Error("Failed to start conversion");
			setError(error.message || "Failed to start conversion");
			setIsConverting(false);
		}
	}, [image.file, targetFormat, quality, compression, imageConverterWorker.convertImage]);

	const downloadResult = useCallback(() => {
		if (!resultUrl) return;
		const link = document.createElement("a");
		link.href = resultUrl;
		link.download = `converted-${Date.now()}.${targetFormat.toLowerCase()}`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}, [resultUrl, targetFormat]);

	useEffect(() => {
		return () => {
			if (image.url) URL.revokeObjectURL(image.url);
			if (resultUrl) URL.revokeObjectURL(resultUrl);
		};
	}, [image.url, resultUrl]);

	return (
		<div className="flex h-full flex-col overflow-hidden bg-[#f0f0f0]">
			{/* Windows-style Header or App Bar would go here if needed, 
			    but usually the Window component handles the title bar */}

			<div className="flex-1 space-y-6 overflow-y-auto p-6">
				{/* Upload Area */}
				{!image.url ? (
					<div
						className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-gray-400 border-dashed bg-white p-12 transition-colors hover:bg-gray-50"
						onClick={() => fileInputRef.current?.click()}
						onDragOver={(e) => e.preventDefault()}
						onDrop={handleDrop}
					>
						<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
							<Upload size={32} />
						</div>
						<h3 className="font-medium text-gray-800 text-xl">Drop your image here</h3>
						<p className="mt-2 text-center text-gray-500">
							Supports PNG, JPEG, WEBP, and more.
							<br />
							Processing happens entirely in your browser.
						</p>
						<input
							accept="image/*"
							className="hidden"
							onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
							ref={fileInputRef}
							type="file"
						/>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* Preview Column */}
						<div className="space-y-4">
							<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
								<div className="flex items-center justify-between border-gray-200 border-b bg-gray-50 px-4 py-2">
									<span className="flex items-center gap-2 font-medium text-gray-700 text-sm">
										<ImageIcon size={16} /> Original Preview
									</span>
									<button
										className="text-gray-400 transition-colors hover:text-red-500"
										onClick={() => setImage({ file: null, url: null })}
										type="button"
									>
										<X size={16} />
									</button>
								</div>
								<div className="relative flex aspect-video items-center justify-center bg-slate-100 p-4">
									{image.url && (
										<img alt="Original" className="max-h-full max-w-full object-contain shadow-lg" src={image.url} />
									)}
								</div>
							</div>

							{resultUrl && (
								<div className="overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm">
									<div className="flex items-center justify-between border-blue-100 border-b bg-blue-50 px-4 py-2">
										<span className="flex items-center gap-2 font-medium text-blue-700 text-sm">
											<RefreshCw className="animate-spin-slow" size={16} /> Converted Result
										</span>
									</div>
									<div className="relative flex aspect-video items-center justify-center bg-[#e5e7eb] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] p-4 [background-size:16px_16px]">
										<img alt="Result" className="max-h-full max-w-full object-contain shadow-lg" src={resultUrl} />
									</div>
									<div className="border-gray-200 border-t bg-gray-50 p-4">
										<button
											className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
											onClick={downloadResult}
											type="button"
										>
											<Download size={20} /> Download Converted Image
										</button>
									</div>
								</div>
							)}
						</div>

						{/* Settings Column */}
						<div className="space-y-6">
							<div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
								<div className="mb-2 flex items-center gap-2">
									<Settings2 className="text-blue-600" size={20} />
									<h2 className="font-semibold text-gray-800 text-lg">Conversion Settings</h2>
								</div>

								<div className="space-y-2">
									<span className="font-medium text-gray-700 text-sm">Target Format</span>
									<div className="flex gap-2">
										{SUPPORTED_FORMATS.map((fmt) => (
											<button
												className={`flex-1 rounded-lg border px-3 py-2 font-medium transition-all ${
													targetFormat === fmt
														? "border-blue-600 bg-blue-600 text-white shadow-blue-100 shadow-md"
														: "border-gray-300 bg-white text-gray-600 hover:border-blue-400"
												}`}
												key={fmt}
												onClick={() => setTargetFormat(fmt)}
												type="button"
											>
												{fmt}
											</button>
										))}
									</div>
								</div>

								{targetFormat !== "PNG" && (
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="font-medium text-gray-700 text-sm">Quality</span>
											<span className="font-bold text-blue-600 text-sm">{quality}%</span>
										</div>
										<input
											className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
											id="quality-slider"
											max="100"
											min="1"
											onChange={(e) => setQuality(Number(e.target.value))}
											type="range"
											value={quality}
										/>
										<p className="text-gray-500 text-xs italic">Higher quality results in larger file size.</p>
									</div>
								)}

								{targetFormat === "PNG" && (
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="font-medium text-gray-700 text-sm">Compression Level</span>
											<span className="font-bold text-blue-600 text-sm">{compression}</span>
										</div>
										<input
											className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
											id="compression-slider"
											max="9"
											min="0"
											onChange={(e) => setCompression(Number(e.target.value))}
											type="range"
											value={compression}
										/>
										<p className="text-gray-500 text-xs italic">
											0 is fastest (no compression), 9 is slowest (maximum compression).
										</p>
									</div>
								)}

								<button
									className={`flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 font-bold text-lg shadow-lg transition-all ${
										isConverting
											? "cursor-not-allowed bg-gray-200 text-gray-500"
											: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
									}`}
									disabled={isConverting}
									onClick={handleStartConversion}
									type="button"
								>
									{isConverting ? (
										<>
											<RefreshCw className="animate-spin" size={24} /> Converting...
										</>
									) : (
										"Convert Image"
									)}
								</button>

								{(isConverting || conversionProgress) && (
									<div className="space-y-2">
										<div className="flex justify-between font-medium text-blue-700 text-xs uppercase tracking-wider">
											<span>Processing Status</span>
											<span>{conversionProgress.includes("%") ? conversionProgress : "Working..."}</span>
										</div>
										<div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
											<div
												className={`h-full rounded-full bg-blue-600 ${isConverting ? "animate-pulse" : ""}`}
												style={{ width: "100%" }}
											></div>
										</div>
										<p className="text-center text-gray-500 text-xs">{conversionProgress}</p>
									</div>
								)}

								{error && (
									<div className="flex gap-3 rounded-lg border border-red-100 bg-red-50 p-4 text-red-700">
										<X className="shrink-0" />
										<div className="font-medium text-sm">{error}</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
});
