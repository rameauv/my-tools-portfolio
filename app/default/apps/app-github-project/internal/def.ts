import type { AppDef } from "../../AppDef";
import type { GithubRepo } from "../../app-github-explorer/internal/GithubRepo";
import { GithubProject } from "./GithubProject";

export const def = (config: {
	projectId: string;
	title: string;
	config: { repo: GithubRepo };
}): AppDef => {
	console.log("def", config);
	return {
		appId: `GITHUB_PROJECT_${config.projectId}`,
		title: `${config.title} - Microsoft Word`,
		iconSrc: "icons/windows-xp-icons/19.ico",
		componentProps: config.config,
		component: GithubProject,
		groupingId: "GITHUB_PROJECT",
	};
};
