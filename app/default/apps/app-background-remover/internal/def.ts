import type { AppDef } from "../../AppDef";
import { BackgroundRemover } from "./BackgroundRemover";

export const def: AppDef = {
	appId: "BACKGROUND_REMOVER",
	title: "Background Remover",
	iconSrc: "/assets/app/background-remover/icon.webp",
	component: BackgroundRemover,
	groupingId: "BACKGROUND_REMOVER",
	defaultWidth: 900,
	defaultHeight: 700,
};
