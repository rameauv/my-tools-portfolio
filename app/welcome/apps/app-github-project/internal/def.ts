import type { AppDef } from "../../AppDef";
import type { GithubRepo } from "../../app-github-explorer/internal/GithubRepo";
import { GithubProject } from "./GithubProject";

export const def = (config: {
	projectId: string;
	title: string;
	componentProps: { repo: GithubRepo };
}): AppDef => {
	return {
		appId: `GITHUB_PROJECT_${config.projectId}`,
		title: `${config.title} - Microsoft Word`,
		iconSrc: "/my-documents.png",
		componentProps: config.componentProps,
		component: GithubProject,
		groupingId: "GITHUB_PROJECT",
	};
};
