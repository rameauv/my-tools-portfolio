import type * as React from "react";
import { createContext, useContext, useMemo, useState } from "react";

interface WindowContextType {
	isSnappingWindow: boolean;
	setIsSnappingWindow: (dragging: boolean) => void;
	snappingSide: "left" | "right" | null;
	setSnappingSide: (side: "left" | "right" | null) => void;
	openWindow: (config: OpenWindowConfig) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export function WindowProvider({
	children,
	openWindow,
}: {
	children: React.ReactNode;
	openWindow: (config: OpenWindowConfig) => void;
}) {
	const [isSnappingWindow, setIsSnappingWindow] = useState(false);
	const [snappingSide, setSnappingSide] = useState<"left" | "right" | null>(
		null,
	);

	const value = useMemo(
		() => ({
			isSnappingWindow,
			setIsSnappingWindow,
			snappingSide,
			setSnappingSide,
			openWindow,
		}),
		[isSnappingWindow, snappingSide, openWindow],
	);

	return (
		<WindowContext.Provider value={value}>{children}</WindowContext.Provider>
	);
}

export function useWindowContext() {
	const context = useContext(WindowContext);
	if (context === undefined) {
		throw new Error("useWindowContext must be used within a WindowProvider");
	}
	return context;
}

interface OpenWindowConfig {
	appId: string;
	title: string;
	iconSrc: string;
	component: React.ComponentType<object>;
	isMinimized?: boolean;
	isFocused?: boolean;
	componentProps?: Record<string, unknown>;
	defaultWidth?: number;
	defaultHeight?: number;
	groupingId: string;
}
