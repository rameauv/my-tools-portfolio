import type { AppDef } from "../../AppDef";
import { VideoEditorWebcodecs } from "./VideoEditorWebcodecs";

export const def: AppDef = {
	appId: "VIDEO_EDITOR_WEBCODECS",
	title: "Video Editor (WebCodecs)",
	iconSrc:
		"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='16' fill='%230f172a'/%3E%3Crect x='18' y='22' width='64' height='44' rx='6' fill='%23e2e8f0'/%3E%3Cpath d='M43 72h14v8H43z' fill='%2394a3b8'/%3E%3Crect x='33' y='80' width='34' height='6' rx='3' fill='%2364748b'/%3E%3C/svg%3E",
	component: VideoEditorWebcodecs,
	groupingId: "VIDEO_EDITOR_WEBCODECS",
	defaultWidth: 960,
	defaultHeight: 640,
};
