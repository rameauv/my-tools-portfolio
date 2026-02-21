import { Dialog } from "@base-ui/react";
import type * as React from "react";
import { useMemo, useRef, useState } from "react";
import { Button } from "./apps/shared/ds/Button";
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
	const [pendingCloseWindow, setPendingCloseWindow] = useState<{ id: number; text: string } | null>(null);

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
			const matchMapper = !targetWindow.isFocused ? applyFocusWindow : applyToggleWindow;
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
		const targetWindow = windows.find((window) => window.id === id);
		if (targetWindow == null) {
			return;
		}
		const canCloseDataPromise = targetWindow.canCloseStatusProvider?.();
		if (canCloseDataPromise == null) {
			setWindows(windows.filter((window) => window.id !== id));
			return;
		}
		canCloseDataPromise.then((data) => {
			if (data == null) {
				setWindows(windows.filter((window) => window.id !== id));
				return;
			}
			setPendingCloseWindow({ id: id, text: data.text });
		});
	}

	function onCancelCloseConfirmation() {
		setPendingCloseWindow(null);
	}

	function onConfirmClose() {
		if (pendingCloseWindow == null) {
			return;
		}
		setWindows((prevWindows) => prevWindows.filter((window) => window.id !== pendingCloseWindow.id));
		setPendingCloseWindow(null);
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

	const windowApi = useMemo(() => {
		return {
			onSetCanCloseStatusProvider: (id: number, provider: () => Promise<{ text: string } | null>) => {
				setWindows((prevWindows) =>
					prevWindows.map((window) => (window.id === id ? { ...window, canCloseStatusProvider: provider } : window)),
				);
			},
		};
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
									onFocus={() => {
										onFocus(window.id);
									}}
									onMinimize={() => onMinimize(window.id)}
									windowsContainerRef={windowsContainerRef}
								>
									<Component
										api={windowApi}
										data={window.componentData}
										id={window.id}
										key={`window-content-${window.id}`}
									/>
								</Window>
							);
						})}
						<Desktop onOpenItem={onOpenItem} />
					</div>
				</WindowSnapping>
			</Shell>
			<ConfirmCloseModal
				onCancel={onCancelCloseConfirmation}
				onConfirm={onConfirmClose}
				pendingCloseWindow={pendingCloseWindow}
			/>
		</WindowProvider>
	);
}

function ConfirmCloseModal(props: {
	onCancel: () => void;
	onConfirm: () => void;
	pendingCloseWindow: { id: number; text: string } | null;
}) {
	return (
		<Dialog.Root
			onOpenChange={(open) => {
				if (!open) {
					props.onCancel();
				}
			}}
			open={props.pendingCloseWindow != null}
		>
			<Dialog.Portal>
				<Dialog.Backdrop className="fixed inset-0 z-300 bg-black/30" />
				<Dialog.Popup className="fixed top-1/2 left-1/2 z-300 w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-t-lg border-2 border-[#0054e3] bg-[#ece9d8] shadow-xl">
					<div className="flex select-none items-center justify-between bg-linear-to-b from-[#0058e6] via-[#2576ff] to-[#0058e6] px-2 py-1">
						<span className="truncate font-bold text-sm text-white shadow-sm">Confirm close</span>
					</div>
					<div className="m-1 flex flex-col gap-4 border border-gray-400 bg-white p-4">
						<p className="text-sm">{props.pendingCloseWindow?.text}</p>
						<div className="flex justify-end gap-2">
							<Button onClick={props.onCancel} type="button">
								Close
							</Button>
						</div>
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
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
