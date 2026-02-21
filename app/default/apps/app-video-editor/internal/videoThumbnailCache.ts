import type { ThumbnailEffectParams, VideoThumbnailExtractor } from "./videoThumbnailExtractor";

export interface VideoThumbnailCacheEntry {
	mediaId: string;
	dataUrl: string;
}

export interface VideoThumbnailCacheOptions {
	extractor: VideoThumbnailExtractor;
	mediaKey: string;
}

type PendingExtraction = {
	time: number;
	effect: ThumbnailEffectParams | undefined;
	key: string;
	resolve: (value: string | null) => void;
	signal?: AbortSignal;
	removeAbortListener?: () => void;
};

export class VideoThumbnailCache {
	private cache = new Map<string, VideoThumbnailCacheEntry>();
	private options: VideoThumbnailCacheOptions;
	private queue: PendingExtraction[] = [];
	private isProcessing = false;
	private currentItem: PendingExtraction | null = null;

	constructor(options: VideoThumbnailCacheOptions) {
		this.options = options;
	}

	getOrLoad(time: number, effect: ThumbnailEffectParams | undefined, signal?: AbortSignal): Promise<string | null> {
		if (time < 0) return Promise.resolve(null);
		const key = cacheKey(this.options.mediaKey, time, effect);
		const cached = this.cache.get(key);
		if (cached !== undefined) {
			if (cached.mediaId === this.options.mediaKey) return Promise.resolve(cached.dataUrl);
			this.cache.delete(key);
		}

		return new Promise<string | null>((resolve) => {
			const pending: PendingExtraction = { time, effect, key, resolve, signal };
			if (signal) {
				const handler = () => {
					pending.removeAbortListener?.();
					const idx = this.queue.indexOf(pending);
					if (idx >= 0) {
						this.queue.splice(idx, 1);
						resolve(null);
					} else if (this.currentItem === pending) {
						this.options.extractor.abortCurrentExtraction();
					}
				};
				signal.addEventListener("abort", handler);
				pending.removeAbortListener = () => signal.removeEventListener("abort", handler);
			}
			this.queue.push(pending);
			this.processQueue();
		});
	}

	private processQueue(): void {
		if (this.isProcessing || this.queue.length === 0) return;
		const next = this.queue.shift();
		if (!next) return;
		if (next.signal?.aborted) {
			next.resolve(null);
			next.removeAbortListener?.();
			this.processQueue();
			return;
		}
		this.isProcessing = true;
		this.currentItem = next;
		const cached = this.cache.get(next.key);
		if (cached !== undefined && cached.mediaId === this.options.mediaKey) {
			next.resolve(cached.dataUrl);
			next.removeAbortListener?.();
			this.currentItem = null;
			this.isProcessing = false;
			if (this.queue.length > 0) this.processQueue();
			return;
		}
		const { time, effect, key, resolve } = next;
		this.options.extractor
			.extractAt(time, effect)
			.then((dataUrl) => {
				next.removeAbortListener?.();
				this.currentItem = null;
				if (dataUrl !== null) {
					this.cache.set(key, { mediaId: this.options.mediaKey, dataUrl });
					resolve(dataUrl);
				} else {
					resolve(null);
				}
			})
			.catch(() => {
				next.removeAbortListener?.();
				this.currentItem = null;
				resolve(null);
			})
			.finally(() => {
				this.isProcessing = false;
				if (this.queue.length > 0) {
					this.processQueue();
				}
			});
	}

	clear(): void {
		this.cache.clear();
		this.options.extractor.abortCurrentExtraction();
		for (const item of this.queue) {
			item.removeAbortListener?.();
			item.resolve(null);
		}
		this.queue = [];
		this.currentItem = null;
	}

	clearByMedia(): void {
		const prefix = `${this.options.mediaKey}_`;
		for (const k of this.cache.keys()) {
			if (k.startsWith(prefix)) this.cache.delete(k);
		}
	}

	setMediaKey(mediaKey: string): void {
		if (this.options.mediaKey === mediaKey) return;
		this.options.mediaKey = mediaKey;
		this.clear();
	}
}

function bucketKey(time: number): string {
	return time.toFixed(2);
}

function effectSignature(effect: ThumbnailEffectParams | undefined): string {
	if (!effect) return "none";
	return `${effect.filterType}_${effect.intensity.toFixed(2)}`;
}

function cacheKey(mediaKey: string, time: number, effect: ThumbnailEffectParams | undefined): string {
	return `${mediaKey}_${bucketKey(time)}_${effectSignature(effect)}`;
}
