export interface AppDef {
	appId: string;
	title: string;
	iconSrc: string;
	component: React.ComponentType;
	componentProps?: Record<string, unknown>;
	groupingId: string;
}
