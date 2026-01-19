import { APP_ONE } from "../apps/app-one/APP_ONE";
import { APP_LINKEDIN } from "../apps/linkedin/APP_LINKEDIN";
import type { DesktopItem } from "./DesktopItem";

export const DESKTOP_ITEMS: DesktopItem[] = [
	{
		data: {
			id: 1,
			appId: APP_ONE.appId,
			icon: APP_ONE.iconSrc,
			title: APP_ONE.title,
			component: APP_ONE.component,
			groupingId: APP_ONE.groupingId,
		},
		x: 0,
		y: 0,
	},
	{
		data: {
			id: 2,
			appId: APP_LINKEDIN.appId,
			icon: APP_LINKEDIN.iconSrc,
			title: APP_LINKEDIN.title,
			component: APP_LINKEDIN.component,
			groupingId: APP_LINKEDIN.groupingId,
		},
		x: 0,
		y: 100,
	},
];
