import {
	Download,
	Image as ImageIcon,
	RefreshCw,
	Settings2,
	Upload,
	X,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useImageConverterWorker } from "./useImageConverterWorker";

interface ImageState {
	file: File | null;
	url: string | null;
}

const SUPPORTED_FORMATS = ["WEBP", "JPEG", "PNG"];

export const ImageConverter = React.memo(function ImageConverter() {
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

	const { convertImage } = useImageConverterWorker({
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
			await convertImage(`job-${Date.now()}`, buffer, targetFormat, {
				quality,
				compression,
			});
		} catch (err: any) {
			setError(err.message || "Failed to start conversion");
			setIsConverting(false);
		}
	}, [image.file, targetFormat, quality, compression, convertImage]);

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
		<div className="flex flex-col h-full bg-[#f0f0f0] overflow-hidden">
			{/* Windows-style Header or App Bar would go here if needed, 
			    but usually the Window component handles the title bar */}

			<div className="flex-1 overflow-y-auto p-6 space-y-6">
				{/* Upload Area */}
				{!image.url ? (
					<div
						className="border-2 border-dashed border-gray-400 rounded-xl p-12 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer group"
						onClick={() => fileInputRef.current?.click()}
						onDragOver={(e) => e.preventDefault()}
						onDrop={handleDrop}
					>
						<div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
							<Upload size={32} />
						</div>
						<h3 className="text-xl font-medium text-gray-800">
							Drop your image here
						</h3>
						<p className="text-gray-500 mt-2 text-center">
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
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Preview Column */}
						<div className="space-y-4">
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
								<div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
									<span className="text-sm font-medium text-gray-700 flex items-center gap-2">
										<ImageIcon size={16} /> Original Preview
									</span>
									<button
										className="text-gray-400 hover:text-red-500 transition-colors"
										onClick={() => setImage({ file: null, url: null })}
										type="button"
									>
										<X size={16} />
									</button>
								</div>
								<div className="aspect-video relative bg-slate-100 flex items-center justify-center p-4">
									{image.url && (
										<img
											alt="Original"
											className="max-h-full max-w-full object-contain shadow-lg"
											src={image.url}
										/>
									)}
								</div>
							</div>

							{resultUrl && (
								<div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden">
									<div className="bg-blue-50 px-4 py-2 border-b border-blue-100 flex items-center justify-between">
										<span className="text-sm font-medium text-blue-700 flex items-center gap-2">
											<RefreshCw className="animate-spin-slow" size={16} />{" "}
											Converted Result
										</span>
									</div>
									<div className="aspect-video relative bg-[#e5e7eb] flex items-center justify-center p-4 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]">
										<img
											alt="Result"
											className="max-h-full max-w-full object-contain shadow-lg"
											src={resultUrl}
										/>
									</div>
									<div className="p-4 bg-gray-50 border-t border-gray-200">
										<button
											className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
							<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
								<div className="flex items-center gap-2 mb-2">
									<Settings2 className="text-blue-600" size={20} />
									<h2 className="text-lg font-semibold text-gray-800">
										Conversion Settings
									</h2>
								</div>

								<div className="space-y-2">
									<span className="text-sm font-medium text-gray-700">
										Target Format
									</span>
									<div className="flex gap-2">
										{SUPPORTED_FORMATS.map((fmt) => (
											<button
												className={`flex-1 py-2 px-3 rounded-lg border font-medium transition-all ${
													targetFormat === fmt
														? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
														: "bg-white border-gray-300 text-gray-600 hover:border-blue-400"
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
											<span className="text-sm font-medium text-gray-700">
												Quality
											</span>
											<span className="text-sm font-bold text-blue-600">
												{quality}%
											</span>
										</div>
										<input
											className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
											id="quality-slider"
											max="100"
											min="1"
											onChange={(e) => setQuality(Number(e.target.value))}
											type="range"
											value={quality}
										/>
										<p className="text-xs text-gray-500 italic">
											Higher quality results in larger file size.
										</p>
									</div>
								)}

								{targetFormat === "PNG" && (
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-sm font-medium text-gray-700">
												Compression Level
											</span>
											<span className="text-sm font-bold text-blue-600">
												{compression}
											</span>
										</div>
										<input
											className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
											id="compression-slider"
											max="9"
											min="0"
											onChange={(e) => setCompression(Number(e.target.value))}
											type="range"
											value={compression}
										/>
										<p className="text-xs text-gray-500 italic">
											0 is fastest (no compression), 9 is slowest (maximum
											compression).
										</p>
									</div>
								)}

								<button
									className={`w-full py-3 px-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
										isConverting
											? "bg-gray-200 text-gray-500 cursor-not-allowed"
											: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
									}`}
									disabled={isConverting}
									onClick={handleStartConversion}
									type="button"
								>
									{isConverting ? (
										<>
											<RefreshCw className="animate-spin" size={24} />{" "}
											Converting...
										</>
									) : (
										"Convert Image"
									)}
								</button>

								{(isConverting || conversionProgress) && (
									<div className="space-y-2">
										<div className="flex justify-between text-xs font-medium text-blue-700 uppercase tracking-wider">
											<span>Processing Status</span>
											<span>
												{conversionProgress.includes("%")
													? conversionProgress
													: "Working..."}
											</span>
										</div>
										<div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
											<div
												className={`bg-blue-600 h-full rounded-full ${isConverting ? "animate-pulse" : ""}`}
												style={{ width: "100%" }}
											></div>
										</div>
										<p className="text-xs text-gray-500 text-center">
											{conversionProgress}
										</p>
									</div>
								)}

								{error && (
									<div className="p-4 bg-red-50 border border-red-100 rounded-lg flex gap-3 text-red-700">
										<X className="shrink-0" />
										<div className="text-sm font-medium">{error}</div>
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
