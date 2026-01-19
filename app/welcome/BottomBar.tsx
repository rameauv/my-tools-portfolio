import { Menu, Popover } from "@base-ui/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StartButton } from "./StartButton";
import { StartMenu } from "./StartMenu";
import { StatusSectionClock } from "./StatusSectionClock";
import type { WindowConfig } from "./window";

export function BottomBar(props: {
	windows: WindowConfig[];
	onToggleWindow: (id: number) => void;
}) {
	return (
		<footer
			className="flex items-center h-[30px] bg-linear-to-b from-[#245edb] via-[#3f8cf3] to-[#245edb] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] relative z-50"
			style={{
				borderTop: "1px solid #00309c",
			}}
		>
			<div className="shrink-0 h-full">
				<StartButton>
					<StartMenu />
				</StartButton>
			</div>
			<div className="flex-1 h-full px-1 overflow-hidden flex items-center justify-start">
				<Taskbar
					onToggleWindow={props.onToggleWindow}
					windows={props.windows}
				/>
			</div>
			<div className="shrink-0 h-full">
				<StatusIconsSection />
			</div>
		</footer>
	);
}

function Taskbar(props: {
	windows: WindowConfig[];
	onToggleWindow: (id: number) => void;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [availableWidth, setAvailableWidth] = useState(0);

	useEffect(() => {
		if (!containerRef.current) return;
		const observer = new ResizeObserver((entries) => {
			for (const entry of entries) {
				setAvailableWidth(entry.contentRect.width);
			}
		});
		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);

	const MIN_WIDTH = 40;
	const GAP = 4;

	const taskbarItems = useMemo(() => {
		const groups: Record<string, WindowConfig[]> = {};
		for (const window of props.windows) {
			const key = window.groupingId;
			if (!groups[key]) groups[key] = [];
			groups[key].push(window);
		}

		const entries = Object.entries(groups).map(([id, windows]) => ({
			id,
			windows,
			isGrouped: false,
		}));

		// Initial required width (no grouping)
		const calculateWidth = (currentEntries: typeof entries) => {
			let total = 0;
			let count = 0;
			for (const entry of currentEntries) {
				if (entry.isGrouped) {
					total += MIN_WIDTH;
					count++;
				} else {
					total += entry.windows.length * MIN_WIDTH;
					count += entry.windows.length;
				}
			}
			return total + (count > 0 ? (count - 1) * GAP : 0);
		};

		// Sort entries by number of windows (descending) to group the ones with most windows first
		const sortedEntries = [...entries].sort(
			(a, b) => b.windows.length - a.windows.length,
		);

		while (
			calculateWidth(sortedEntries) > availableWidth &&
			availableWidth > 0
		) {
			// Find the first entry that has more than 1 window and is not grouped
			const toGroup = sortedEntries.find(
				(e) => !e.isGrouped && e.windows.length > 1,
			);
			if (!toGroup) break;
			toGroup.isGrouped = true;
		}

		return sortedEntries;
	}, [props.windows, availableWidth]);

	// Re-sort back to some stable order if necessary, or just render
	// We'll sort by the first window's ID or something to keep order stable
	const finalItems = useMemo(() => {
		return [...taskbarItems].sort((a, b) => a.windows[0].id - b.windows[0].id);
	}, [taskbarItems]);

	return (
		<div
			className="w-full h-full flex items-center gap-1 overflow-hidden"
			ref={containerRef}
		>
			{finalItems.flatMap((entry) => {
				if (entry.isGrouped) {
					return [
						<GroupedTaskbarButton
							icon={entry.windows[0].iconSrc}
							key={`group-${entry.id}`}
							onToggleWindow={props.onToggleWindow}
							title={entry.windows[0].title.split(" - ")[0] || "Group"}
							windows={entry.windows.map((w) => ({
								id: w.id,
								title: w.title,
								isFocused: w.isFocused,
							}))}
						/>,
					];
				}
				return entry.windows.map((window) => (
					<TaskbarButton
						active={window.isFocused}
						icon={window.iconSrc}
						key={window.id}
						onClick={() => props.onToggleWindow(window.id)}
						title={window.title}
					/>
				));
			})}
		</div>
	);
}

export function TaskbarButton(props: {
	title: string;
	active?: boolean;
	icon?: string;
	onClick: () => void;
	className?: string;
}) {
	return (
		<div
			className={`
        flex items-center h-[24px] min-w-[40px] max-w-[200px] flex-1 px-2 rounded-sm cursor-pointer select-none overflow-hidden
        ${
					props.active
						? "bg-[#1e52b7] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] border-[#163f8c]"
						: "bg-linear-to-b from-[#3c81f0] to-[#245edb] hover:from-[#4c91ff] hover:to-[#346efb] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] border-[#1c56c5]"
				}
        border ${props.className ?? ""}
      `}
			onClick={() => props.onClick()}
			title={props.title}
		>
			{props.icon && (
				<img alt="" className="w-4 h-4 mr-1.5 shrink-0" src={props.icon} />
			)}
			<span
				className="text-white text-[11px] truncate"
				style={{ fontFamily: "Tahoma, sans-serif" }}
			>
				{props.title}
			</span>
		</div>
	);
}

export interface GroupedWindow {
	id: number;
	title: string;
	isFocused: boolean;
}

export function GroupedTaskbarButton(props: {
	title: string;
	icon?: string;
	windows: GroupedWindow[];
	onToggleWindow: (id: number) => void;
}) {
	const isAnyActive = props.windows.some((w) => w.isFocused);

	return (
		<Popover.Root>
			<Popover.Trigger
				className={`
          flex items-center h-[24px] min-w-[40px] max-w-[200px] flex-1 px-2 rounded-sm cursor-pointer select-none overflow-hidden
          ${
						isAnyActive
							? "bg-[#1e52b7] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] border-[#163f8c]"
							: "bg-linear-to-b from-[#3c81f0] to-[#245edb] hover:from-[#4c91ff] hover:to-[#346efb] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] border-[#1c56c5]"
					}
          border
        `}
			>
				{props.icon && (
					<img alt="" className="w-4 h-4 mr-1.5 shrink-0" src={props.icon} />
				)}
				<span
					className="text-white text-[11px] truncate flex-1 text-left"
					style={{ fontFamily: "Tahoma, sans-serif" }}
				>
					{props.title}
				</span>
				<span className="text-white text-[9px] ml-1">▼</span>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner align="start" side="top" sideOffset={4}>
					<Popover.Popup
						className="bg-[#ece9d8] border-2 border-[#0054e3] shadow-xl py-1 min-w-[150px] z-50"
						style={{ fontFamily: "Tahoma, sans-serif" }}
					>
						<Menu.Root>
							{props.windows.map((window) => (
								<Menu.Item
									className="px-4 py-1.5 text-[11px] text-black hover:bg-[#316ac5] hover:text-white cursor-default truncate"
									key={window.id}
									onClick={() => props.onToggleWindow(window.id)}
								>
									{window.title}
								</Menu.Item>
							))}
						</Menu.Root>
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
}

function StatusIconsSection(props: {}) {
	return (
		<div
			className="flex items-center gap-2 h-full px-2 border-l border-[#00309c] shadow-[inset_1px_0_0_rgba(255,255,255,0.2)]"
			style={{
				background: "linear-gradient(to bottom, #107ceb 0%, #107ceb 100%)",
				backgroundColor: "#107ceb",
			}}
		>
			<StatusSectionClock />
		</div>
	);
}
