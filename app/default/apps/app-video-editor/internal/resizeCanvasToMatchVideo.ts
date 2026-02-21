export function resizeCanvasToMatchVideo(canvas: HTMLCanvasElement, video: HTMLVideoElement): void {
	const w = video.videoWidth;
	const h = video.videoHeight;
	if (w <= 0 || h <= 0) return;
	const dpr = Math.min(2, window.devicePixelRatio ?? 1);
	canvas.width = Math.floor(w * dpr);
	canvas.height = Math.floor(h * dpr);
	canvas.style.width = `${w}px`;
	canvas.style.height = `${h}px`;
}
