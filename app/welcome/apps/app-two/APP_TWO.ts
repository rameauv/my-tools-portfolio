import type { AppDef } from "../AppDef";
import { GitHubExplorer } from "./AppTwo";

export const APP_TWO: AppDef = {
	appId: "GITHUB_EXPLORER",
	title: "GitHub Explorer",
	iconSrc: "/my-documents.png",
	component: GitHubExplorer,
	groupingId: "GITHUB_EXPLORER",
};
