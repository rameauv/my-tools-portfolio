import type { AppDef } from "../../AppDef";
import { BackgroundRemover } from "./BackgroundRemover";

export const def: AppDef = {
	appId: "BACKGROUND_REMOVER",
	title: "Background Remover",
	iconSrc: "icons/windows-xp-icons/19.ico",
	component: BackgroundRemover,
	groupingId: "BACKGROUND_REMOVER",
};
