import type Vips from "wasm-vips";

export type VipsInstance = Awaited<ReturnType<typeof Vips>>;

export type ConversionSettings = {
	quality?: number;
	compression?: number;
};

export type ConvertStrategy = (vips: VipsInstance, imageData: ArrayBuffer, settings: ConversionSettings) => ArrayBuffer;
