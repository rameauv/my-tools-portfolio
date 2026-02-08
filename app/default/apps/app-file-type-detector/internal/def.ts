import type { AppDef } from "../../AppDef";
import { FileTypeDetector } from "./FileTypeDetector";

export const def: AppDef = {
	appId: "FILE_TYPE_DETECTOR",
	title: "File Type Detector",
	iconSrc: "/assets/icons/shell32/170-my-recent-document-48.ico",
	component: FileTypeDetector,
	groupingId: "FILE_TYPE_DETECTOR",
	defaultWidth: 500,
	defaultHeight: 400,
};
