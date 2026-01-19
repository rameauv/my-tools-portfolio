import type { AppDef } from "../../AppDef";
import { GitHubExplorer } from "./GitHubExplorer";

export const def: AppDef = {
	appId: "GITHUB_EXPLORER",
	title: "My Projects",
	iconSrc: "/icons/windows-xp-icons/19.ico",
	component: GitHubExplorer,
	groupingId: "GITHUB_EXPLORER",
};
