import type { AppDef } from "../../AppDef";
import { VideoEditor } from "./VideoEditor";

export const def: AppDef = {
	appId: "VIDEO_EDITOR",
	title: "Video Editor",
	iconSrc:
		"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='16' fill='%236b21a8'/%3E%3Crect x='20' y='28' width='24' height='44' rx='4' fill='%23fff' opacity='.9'/%3E%3Crect x='56' y='28' width='24' height='44' rx='4' fill='%23fff' opacity='.9'/%3E%3Ccircle cx='50' cy='72' r='6' fill='%23fff' opacity='.9'/%3E%3C/svg%3E",
	component: VideoEditor,
	groupingId: "VIDEO_EDITOR",
	defaultWidth: 900,
	defaultHeight: 600,
};
