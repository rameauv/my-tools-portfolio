import type { AppDef } from "../../AppDef";
import { LinkedIn } from "./LinkedIn";

export const DEF: AppDef = {
	appId: "LINKEDIN",
	title: "LinkedIn Profile",
	iconSrc: "/my-documents.png",
	component: LinkedIn,
	groupingId: "LINKEDIN",
};
