import type * as React from "react";
import type { WindowContentProps } from "../apps/WindowContentProps";

export interface DesktopItemData {
	id: number;
	appId: string;
	icon: string;
	title: string;
	groupingId: string;
	component: React.ComponentType<WindowContentProps>;
	defaultWidth?: number;
	defaultHeight?: number;
}
