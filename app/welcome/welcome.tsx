import type * as React from "react";
import { useEffectEvent, useRef, useState } from "react";
import { APP_GITHUB_EXPLORER } from "./apps/app-github-explorer";
import { APP_LINKEDIN } from "./apps/app-linkedin";
import { APP_WELCOME } from "./apps/app-welcome";
import { BottomBar } from "./BottomBar";
import { Desktop } from "./desktop/Desktop";
import type { DesktopItemData } from "./desktop/DesktopItemData";
import { WindowProvider } from "./WindowContext";
import { WindowSnapping } from "./WindowSnapping";
import { Window, type WindowConfig } from "./window";

let windowId = 0;

export function Welcome() {
	const [windows, setWindows] = useState<WindowConfig[]>([
		{
			id: windowId++,
			appId: APP_WELCOME.def.appId,
			isMinimized: false,
			isFocused: true,
			depth: 0,
			component: APP_WELCOME.def.component,
			title: APP_WELCOME.def.title,
			iconSrc: APP_WELCOME.def.iconSrc,
			groupingId: APP_WELCOME.def.groupingId,
		},
		{
			id: windowId++,
			appId: APP_GITHUB_EXPLORER.def.appId,
			title: APP_GITHUB_EXPLORER.def.title,
			isMinimized: false,
			iconSrc: APP_GITHUB_EXPLORER.def.iconSrc,
			isFocused: false,
			component: APP_GITHUB_EXPLORER.def.component,
			depth: 1,
			groupingId: APP_GITHUB_EXPLORER.def.groupingId,
		},
		{
			id: windowId++,
			appId: APP_LINKEDIN.def.appId,
			title: APP_LINKEDIN.def.title,
			isMinimized: false,
			iconSrc: APP_LINKEDIN.def.iconSrc,
			isFocused: false,
			component: APP_LINKEDIN.def.component,
			defaultWidth: 900,
			defaultHeight: 700,
			depth: 2,
			groupingId: APP_LINKEDIN.def.groupingId,
		},
	]);

	function onMinimize(id: number) {
		setWindows(
			windows.map((window) =>
				window.id === id
					? { ...window, isMinimized: !window.isMinimized, isFocused: false }
					: window,
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
		component: React.ComponentType<any>;
		componentProps?: Record<string, unknown>;
		groupingId: string;
		defaultWidth?: number;
		defaultHeight?: number;
	}) {
		const existingWindow = windows.find(
			(windowItem) => windowItem.appId === config.appId,
		);
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
			componentProps: config.componentProps,
			defaultWidth: config.defaultWidth,
			defaultHeight: config.defaultHeight,
			groupingId: config.groupingId,
			depth: windows.length,
		};
		setWindows(
			windows
				.map((w) => ({ ...w, isFocused: false, depth: w.depth - 1 }))
				.concat(newWindow),
		);
	}

	const onOpenItem = useEffectEvent((item: DesktopItemData) => {
		openWindow({
			appId: item.appId,
			title: item.title,
			iconSrc: item.icon,
			component: item.component,
			groupingId: item.groupingId,
		});
	});

	console.log("windows", windows);
	const windowsContainerRef = useRef<HTMLDivElement>(null);

	return (
		<WindowProvider openWindow={openWindow}>
			<Shell
				bottomBar={
					<BottomBar onToggleWindow={onToggleWindow} windows={windows} />
				}
			>
				<WindowSnapping>
					<div className="w-full h-full" ref={windowsContainerRef}>
						{windows.map((window) => {
							const Component = window.component;
							return (
								<Window
									config={window}
									defaultHeight={
										window.defaultHeight ?? (window.id === 1 ? 600 : 300)
									}
									defaultWidth={
										window.defaultWidth ?? (window.id === 1 ? 800 : 400)
									}
									key={`window-${window.id}`}
									onClose={() => onClose(window.id)}
									onFocus={() => onFocus(window.id)}
									onMinimize={() => onMinimize(window.id)}
									title={window.title}
									windowsContainerRef={windowsContainerRef}
								>
									<Component
										key={`window-content-${window.id}`}
										{...window.componentProps}
									/>
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

function Shell(props: {
	children: React.ReactNode;
	bottomBar: React.ReactNode;
}) {
	return (
		<main className="flex flex-col h-screen overflow-hidden">
			<div className="flex-1 relative overflow-hidden">{props.children}</div>
			{props.bottomBar}
		</main>
	);
}
