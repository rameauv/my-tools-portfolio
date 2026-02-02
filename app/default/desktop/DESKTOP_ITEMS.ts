import { appBackgroundRemover } from "../apps/app-background-remover";
import { appGitHubExplorer } from "../apps/app-github-explorer";
import { appImageConverter } from "../apps/app-image-converter";
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
	{
		data: {
			id: 3,
			appId: appBackgroundRemover.def.appId,
			icon: appBackgroundRemover.def.iconSrc,
			title: appBackgroundRemover.def.title,
			component: appBackgroundRemover.def.component,
			groupingId: appBackgroundRemover.def.groupingId,
		},
		x: 0,
		y: 200,
	},
	{
		data: {
			id: 4,
			appId: appImageConverter.def.appId,
			icon: appImageConverter.def.iconSrc,
			title: appImageConverter.def.title,
			component: appImageConverter.def.component,
			groupingId: appImageConverter.def.groupingId,
		},
		x: 0,
		y: 300,
	},
];
