import type { AppDef } from "../../AppDef";
import { GitHubExplorer } from "./GitHubExplorer";

export const def: AppDef = {
	appId: "GITHUB_EXPLORER",
	title: "My Projects",
	iconSrc: "/assets/icons/shell32/23-folder-48.ico",
	component: GitHubExplorer,
	groupingId: "GITHUB_EXPLORER",
	defaultWidth: 900,
	defaultHeight: 700,
};
