import { appGitHubExplorer } from "../apps/app-github-explorer";
import { appLinkedin } from "../apps/app-linkedin";
import type { DesktopItem } from "./DesktopItem";

export const DESKTOP_ITEMS: DesktopItem[] = [
	{
		data: {
			id: 1,
			appId: appGitHubExplorer.def.appId,
			icon: appGitHubExplorer.def.iconSrc,
			title: appGitHubExplorer.def.title,
			component: appGitHubExplorer.def.component,
			groupingId: appGitHubExplorer.def.groupingId,
		},
		x: 0,
		y: 0,
	},
	{
		data: {
			id: 2,
			appId: appLinkedin.def.appId,
			icon: appLinkedin.def.iconSrc,
			title: appLinkedin.def.title,
			component: appLinkedin.def.component,
			groupingId: appLinkedin.def.groupingId,
		},
		x: 0,
		y: 100,
	},
];
