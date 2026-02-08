import type { AppDef } from "../../AppDef";
import type { GithubRepo } from "../../app-github-explorer/internal/GithubRepo";
import type { WindowContentProps } from "../../WindowContentProps";
import { GithubProject } from "./GithubProject";

export const def = (config: { projectId: string; title: string; config: { repo: GithubRepo } }): AppDef => {
	return {
		appId: `GITHUB_PROJECT_${config.projectId}`,
		title: `${config.title} - Microsoft Word`,
		iconSrc: "/assets/icons/shell32/23-folder-48.ico",
		componentData: config.config as unknown,
		component: GithubProject as React.ComponentType<WindowContentProps>,
		groupingId: "GITHUB_PROJECT",
		defaultWidth: 900,
		defaultHeight: 700,
	};
};
