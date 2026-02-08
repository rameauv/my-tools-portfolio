import type * as React from "react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { cancelRunningJobs } from "./apps/app-background-remover/internal/backgroundRemovalDB";
import type { WindowContentProps } from "./apps/WindowContentProps";
import { BottomBar } from "./bottom-bar/BottomBar";
import { Desktop } from "./desktop/Desktop";
import type { DesktopItemData } from "./desktop/DesktopItemData";
import type { WindowConfig } from "./window/models/WindowConfig";
import { Window } from "./window/Window";
import { WindowProvider } from "./window-snapping/WindowContext";
import { WindowSnapping } from "./window-snapping/WindowSnapping";

let windowId = 0;

export function Default() {
	const [windows, setWindows] = useState<WindowConfig[]>([]);

	function onMinimize(id: number) {
		setWindows(
			windows.map((window) =>
				window.id === id ? { ...window, isMinimized: !window.isMinimized, isFocused: false } : window,
			),
		);
	}

	function onToggleWindow(id: number) {
		setWindows((windows) => {
			const focusedWindow = windows.find((window) => window.isFocused);
			if (focusedWindow != null && focusedWindow.id !== id) {
				return windows.map((window) => {
					if (window.id === id) {
						return {
							...window,
							isFocused: true,
							isMinimized: false,
							depth: windows.length - 1,
						};
					} else {
						return { ...window, isFocused: false, depth: window.depth - 1 };
					}
				});
			}
			return windows.map((window) =>
				window.id === id
					? {
							...window,
							isMinimized: !window.isMinimized,
							isFocused: window.isMinimized,
							depth: windows.length - 1,
						}
					: { ...window, isFocused: false, depth: window.depth - 1 },
			);
		});
	}

	function onFocus(id: number) {
		setWindows(
			windows.map((window) =>
				window.id === id
					? {
							...window,
							isFocused: true,
							depth: windows.length - 1,
						}
					: { ...window, isFocused: false, depth: window.depth - 1 },
			),
		);
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
		const newId = windowId++;
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
		setWindows(windows.map((w) => ({ ...w, isFocused: false, depth: w.depth - 1 })).concat(newWindow));
	}

	const onOpenItem = useEffectEvent((item: DesktopItemData) => {
		openWindow({
			appId: item.appId,
			title: item.title,
			iconSrc: item.icon,
			component: item.component,
			groupingId: item.groupingId,
			defaultWidth: item.defaultWidth,
			defaultHeight: item.defaultHeight,
		});
	});

	const windowsContainerRef = useRef<HTMLDivElement>(null);

	// Cleanup stale running jobs on startup
	useEffect(() => {
		cancelRunningJobs().catch((error) => {
			console.error("Failed to cancel stale running jobs:", error);
		});
	}, []);

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
									onFocus={() => onFocus(window.id)}
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
