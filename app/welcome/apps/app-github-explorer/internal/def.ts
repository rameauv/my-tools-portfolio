import type { AppDef } from "../../AppDef";
import { GitHubExplorer } from "./GitHubExplorer";

export const def: AppDef = {
	appId: "GITHUB_EXPLORER",
	title: "My Projects",
	iconSrc: "/my-documents.png",
	component: GitHubExplorer,
	groupingId: "GITHUB_EXPLORER",
};
