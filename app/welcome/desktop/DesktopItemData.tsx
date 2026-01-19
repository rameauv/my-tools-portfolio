import type * as React from "react";

export interface DesktopItemData {
	id: number;
	appId: string;
	icon: string;
	title: string;
	groupingId: string;
	component: React.ComponentType<object>;
}
