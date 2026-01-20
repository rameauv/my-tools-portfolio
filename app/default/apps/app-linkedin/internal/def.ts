import type { AppDef } from "../../AppDef";
import { LinkedIn } from "./LinkedIn";

export const def: AppDef = {
	appId: "LINKEDIN",
	title: "LinkedIn Profile",
	iconSrc: "/assets/icons/shell32/1484-internet-explorer-48.ico",
	component: LinkedIn,
	groupingId: "LINKEDIN",
};
