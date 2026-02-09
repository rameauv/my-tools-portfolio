import type * as React from "react";
import { useRef, useState } from "react";
import type { WindowContentProps } from "./apps/WindowContentProps";
import { BottomBar } from "./bottom-bar/BottomBar";
import { Desktop } from "./desktop/Desktop";
import type { DesktopItemData } from "./desktop/DesktopItemData";
import { NextWindowId } from "./NextWindowId";
import { useCancelStaleRunningJobs } from "./useCancelStaleRunningJobs";
import type { WindowConfig } from "./window/models/WindowConfig";
import { Window } from "./window/Window";
import { WindowProvider } from "./window-snapping/WindowContext";
import { WindowSnapping } from "./window-snapping/WindowSnapping";

export function Default() {
	const [windows, setWindows] = useState<WindowConfig[]>([]);

	const windowsContainerRef = useRef<HTMLDivElement>(null);

	useCancelStaleRunningJobs();

	function onMinimize(id: number) {
		setWindows(windows.map((window) => (window.id === id ? applyToggleMinimizeWindow(window) : window)));
	}

	function onToggleWindow(id: number) {
		setWindows((prevWindows) => {
			const targetWindow = prevWindows.find((window) => window.id === id);
			if (targetWindow == null) {
				return prevWindows;
			}
			const focusedWindow = prevWindows.find((window) => window.isFocused);
			const targetWindowIsNotTheFocusedWindow = focusedWindow != null && focusedWindow.id !== id;
			const matchMapper = targetWindowIsNotTheFocusedWindow ? applyFocusWindow : applyToggleWindow;
			return prevWindows.map((window) =>
				window.id === id ? matchMapper(window, prevWindows.length) : applyShiftWindowFocus(window, targetWindow),
			);
		});
	}

	function onFocus(id: number) {
		setWindows((prevWindows) => {
			const targetWindow = prevWindows.find((window) => window.id === id);
			if (targetWindow == null) {
				return prevWindows;
			}
			return prevWindows.map((window) =>
				window.id === id ? applyFocusWindow(window, prevWindows.length) : applyShiftWindowFocus(window, targetWindow),
			);
		});
	}

	function onClose(id: number) {
		setWindows(windows.filter((window) => window.id !== id));
	}

	function openWindow(config: {
		appId: string;
		title: string;
		iconSrc: string;
		component: React.ComponentType<WindowContentProps>;
		componentData?: unknown;
		groupingId: string;
		defaultWidth?: number;
		defaultHeight?: number;
	}) {
		const existingWindow = windows.find((windowItem) => windowItem.appId === config.appId);
		if (existingWindow != null) {
			onFocus(existingWindow.id);
			return;
		}
		const newId = NextWindowId.get();
		const newWindow: WindowConfig = {
			id: newId,
			appId: config.appId,
			title: config.title,
			isMinimized: false,
			iconSrc: config.iconSrc,
			isFocused: true,
			component: config.component,
			componentData: config.componentData,
			defaultWidth: config.defaultWidth,
			defaultHeight: config.defaultHeight,
			groupingId: config.groupingId,
			depth: windows.length,
		};
		setWindows(windows.map((w) => ({ ...w, isFocused: false })).concat(newWindow));
	}

	function onOpenItem(item: DesktopItemData) {
		openWindow({
			appId: item.appId,
			title: item.title,
			iconSrc: item.icon,
			component: item.component,
			groupingId: item.groupingId,
			defaultWidth: item.defaultWidth,
			defaultHeight: item.defaultHeight,
		});
	}

	return (
		<WindowProvider openWindow={openWindow}>
			<Shell bottomBar={<BottomBar onToggleWindow={onToggleWindow} windows={windows} />}>
				<WindowSnapping>
					<div className="h-full w-full" ref={windowsContainerRef}>
						{windows.map((window) => {
							const Component = window.component;
							return (
								<Window
									config={window}
									key={`window-${window.id}`}
									onClose={() => onClose(window.id)}
									onFocus={() => {
										onFocus(window.id);
									}}
									onMinimize={() => onMinimize(window.id)}
									windowsContainerRef={windowsContainerRef}
								>
									<Component data={window.componentData} key={`window-content-${window.id}`} />
								</Window>
							);
						})}
						<Desktop onOpenItem={onOpenItem} />
					</div>
				</WindowSnapping>
			</Shell>
		</WindowProvider>
	);
}

function Shell(props: { children: React.ReactNode; bottomBar: React.ReactNode }) {
	return (
		<main className="flex h-dvh flex-col overflow-hidden">
			<div className="relative flex-1 overflow-hidden">{props.children}</div>
			{props.bottomBar}
		</main>
	);
}

function applyShiftWindowFocus(window: WindowConfig, targetWindow: WindowConfig) {
	return { ...window, isFocused: false, depth: window.depth > targetWindow.depth ? window.depth - 1 : window.depth };
}

function applyFocusWindow(window: WindowConfig, windowCount: number) {
	return {
		...window,
		isFocused: true,
		isMinimized: false,
		depth: windowCount - 1,
	};
}

function applyToggleWindow(window: WindowConfig, windowCount: number) {
	return {
		...window,
		isMinimized: !window.isMinimized,
		isFocused: window.isMinimized,
		depth: windowCount - 1,
	};
}

function applyToggleMinimizeWindow(window: WindowConfig) {
	return { ...window, isMinimized: !window.isMinimized, isFocused: false };
}
