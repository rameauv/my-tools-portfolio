import type { AppDef } from "../../AppDef";
import { ImageConverter } from "./ImageConverter";

export const def: AppDef = {
	appId: "IMAGE_CONVERTER",
	title: "Image Converter",
	iconSrc:
		"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%233b82f6'/%3E%3Cpath d='M30 50h40M55 35l15 15-15 15' stroke='white' stroke-width='8' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Cpath d='M30 35v30' stroke='white' stroke-width='8' stroke-linecap='round' fill='none'/%3E%3C/svg%3E",
	component: ImageConverter,
	groupingId: "IMAGE_CONVERTER",
};
