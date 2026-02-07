import type { WindowContentProps } from "./WindowContentProps";

export interface AppDef {
	appId: string;
	title: string;
	iconSrc: string;
	component: React.ComponentType<WindowContentProps>;
	componentData?: unknown;
	groupingId: string;
	defaultWidth?: number;
	defaultHeight?: number;
}
