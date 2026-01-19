import { APP_LINKEDIN } from "../apps/app-linkedin";
import { APP_WELCOME } from "../apps/app-welcome";
import type { DesktopItem } from "./DesktopItem";

export const DESKTOP_ITEMS: DesktopItem[] = [
	{
		data: {
			id: 1,
			appId: APP_WELCOME.def.appId,
			icon: APP_WELCOME.def.iconSrc,
			title: APP_WELCOME.def.title,
			component: APP_WELCOME.def.component,
			groupingId: APP_WELCOME.def.groupingId,
		},
		x: 0,
		y: 0,
	},
	{
		data: {
			id: 2,
			appId: APP_LINKEDIN.def.appId,
			icon: APP_LINKEDIN.def.iconSrc,
			title: APP_LINKEDIN.def.title,
			component: APP_LINKEDIN.def.component,
			groupingId: APP_LINKEDIN.def.groupingId,
		},
		x: 0,
		y: 100,
	},
];
