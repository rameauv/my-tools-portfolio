import type { FilterType } from "./shaders";
import type { VideoEditorGLPipeline } from "./webgl";
import { createVideoEditorPipeline } from "./webgl";

const MAX_CAPTURE_RETRIES = 10;
const RETRY_DELAY_MS = 200;
const MIN_DATAURL_LENGTH = 128;
const FILTER_NONE = 0;

export type GetCanceled = () => boolean;

export interface ThumbnailEffectParams {
	filterType: FilterType;
	intensity: number;
}

export interface VideoThumbnailExtractorOptions {
	maxWidth?: number;
}

export class VideoThumbnailExtractor {
	private video: HTMLVideoElement;
	private canvas: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D | null = null;
	private glCanvas: HTMLCanvasElement | null = null;
	private glPipeline: VideoEditorGLPipeline | null = null;
	private maxWidth: number;
	private sourceUrl: string | null = null;
	private seekResolve: ((value: string | null) => void) | null = null;
	private seekedListener: (() => void) | null = null;
	private errorListener: (() => void) | null = null;

	constructor(options: VideoThumbnailExtractorOptions = {}) {
		this.maxWidth = options.maxWidth ?? 256;
		this.video = document.createElement("video");
		this.video.crossOrigin = "anonymous";
		this.video.muted = true;
		this.video.playsInline = true;
		this.video.preload = "metadata";

		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
	}

	setSource(url: string | null): void {
		if (url === this.sourceUrl) return;
		this.abortCurrentSeek();
		this.sourceUrl = url;
		if (!url) {
			this.video.removeAttribute("src");
			this.video.load();
			return;
		}
		this.video.src = url;
	}

	extractAt(time: number, effect: ThumbnailEffectParams | undefined): Promise<string | null> {
		if (time < 0 || !this.sourceUrl) return Promise.resolve(null);
		const run = (): Promise<string | null> =>
			new Promise((resolve) => {
				this.seekResolve = resolve;

				const cleanup = () => {
					if (this.seekedListener) {
						this.video.removeEventListener("seeked", this.seekedListener);
						this.seekedListener = null;
					}
					if (this.errorListener) {
						this.video.removeEventListener("error", this.errorListener);
						this.errorListener = null;
					}
					this.seekResolve = null;
				};

				this.seekedListener = () => {
					cleanup();
					this.captureToDataUrl(resolve, 0, effect, time);
				};

				this.errorListener = () => {
					cleanup();
					resolve(null);
				};

				this.video.addEventListener("seeked", this.seekedListener, { once: true });
				this.video.addEventListener("error", this.errorListener, { once: true });

				if (this.video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
					const onCanPlay = () => {
						this.video.removeEventListener("canplay", onCanPlay);
						this.seekTo(time);
					};
					this.video.addEventListener("canplay", onCanPlay, { once: true });
					return;
				}

				this.seekTo(time);
			});

		return run();
	}

	abortCurrentExtraction(): void {
		this.abortCurrentSeek();
	}

	destroy(): void {
		this.abortCurrentSeek();
		this.glPipeline?.destroy();
		this.glPipeline = null;
		this.glCanvas = null;
		this.setSource(null);
		this.video.removeAttribute("src");
		this.video.load();
	}

	private seekTo(time: number): void {
		const current = this.video.currentTime;
		this.video.currentTime = current === time ? time + 0.01 : time;
	}

	private ensureGlPipeline(cw: number, ch: number): boolean {
		const dpr = Math.min(2, window.devicePixelRatio ?? 1);
		const width = Math.floor(cw * dpr);
		const height = Math.floor(ch * dpr);
		if (!this.glCanvas) {
			this.glCanvas = document.createElement("canvas");
		}
		if (this.glCanvas.width !== width || this.glCanvas.height !== height) {
			this.glCanvas.width = width;
			this.glCanvas.height = height;
			if (this.glPipeline) {
				this.glPipeline.destroy();
				this.glPipeline = null;
			}
		}
		if (!this.glPipeline) {
			this.glPipeline = createVideoEditorPipeline(this.glCanvas, this.video);
		}
		return this.glPipeline !== null;
	}

	private captureToDataUrl(
		resolve: (value: string | null) => void,
		retryCount = 0,
		effect?: ThumbnailEffectParams,
		seekTime?: number,
	): void {
		if (!this.video.videoWidth || !this.video.videoHeight) {
			resolve(null);
			return;
		}

		const w = this.video.videoWidth;
		const h = this.video.videoHeight;
		const scale = Math.min(1, this.maxWidth / w);
		const cw = Math.floor(w * scale);
		const ch = Math.floor(h * scale);

		if (hasEffect(effect) && effect && seekTime !== undefined) {
			if (!this.ensureGlPipeline(cw, ch) || !this.glCanvas || !this.glPipeline) {
				resolve(null);
				return;
			}
			this.glPipeline.render({
				filterType: effect.filterType,
				intensity: effect.intensity,
				time: seekTime,
			});
			try {
				const dataUrl = this.glCanvas.toDataURL();
				if (dataUrl.length < MIN_DATAURL_LENGTH && retryCount < MAX_CAPTURE_RETRIES) {
					setTimeout(() => this.captureToDataUrl(resolve, retryCount + 1, effect, seekTime), RETRY_DELAY_MS);
					return;
				}
				resolve(dataUrl);
			} catch {
				resolve(null);
			}
			return;
		}

		if (!this.ctx) {
			resolve(null);
			return;
		}
		const dpr = Math.min(2, window.devicePixelRatio ?? 1);
		this.canvas.width = cw * dpr;
		this.canvas.height = ch * dpr;
		this.ctx.scale(dpr, dpr);
		this.ctx.drawImage(this.video, 0, 0, cw, ch);
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);

		try {
			const dataUrl = this.canvas.toDataURL();
			if (dataUrl.length < MIN_DATAURL_LENGTH && retryCount < MAX_CAPTURE_RETRIES) {
				setTimeout(() => this.captureToDataUrl(resolve, retryCount + 1, effect, seekTime), RETRY_DELAY_MS);
				return;
			}
			resolve(dataUrl);
		} catch {
			resolve(null);
		}
	}

	private abortCurrentSeek(): void {
		if (this.seekedListener) {
			this.video.removeEventListener("seeked", this.seekedListener);
			this.seekedListener = null;
		}
		if (this.errorListener) {
			this.video.removeEventListener("error", this.errorListener);
			this.errorListener = null;
		}
		if (this.seekResolve) {
			this.seekResolve(null);
			this.seekResolve = null;
		}
	}
}

function hasEffect(effect: ThumbnailEffectParams | undefined): boolean {
	if (!effect) return false;
	return effect.filterType !== FILTER_NONE || effect.intensity !== 1;
}
