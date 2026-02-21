import type * as React from "react";
import type { WindowContentProps } from "../../apps/WindowContentProps";

export interface WindowConfig {
	id: number;
	appId: string;
	title: string;
	iconSrc: string;
	component: React.ComponentType<WindowContentProps>;
	depth: number;
	groupingId: string;
	isMinimized: boolean;
	isFocused: boolean;
	componentData?: unknown;
	defaultWidth?: number;
	defaultHeight?: number;
	canCloseStatusProvider?: () => Promise<{ text: string } | null>;
}
