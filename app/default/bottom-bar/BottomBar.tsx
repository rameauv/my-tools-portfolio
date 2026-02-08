import { Menu, Popover } from "@base-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { WindowConfig } from "../window/models/WindowConfig";
import { StartButton } from "./StartButton";
import { StartMenu } from "./StartMenu";
import { StatusSectionClock } from "./StatusSectionClock";

export function BottomBar(props: { windows: WindowConfig[]; onToggleWindow: (id: number) => void }) {
	return (
		<footer
			className="relative z-50 flex h-[30px] items-center bg-linear-to-b from-[#245edb] via-[#3f8cf3] to-[#245edb] shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]"
			style={{
				borderTop: "1px solid #00309c",
			}}
		>
			<div className="h-full shrink-0">
				<StartButton>
					<StartMenu />
				</StartButton>
			</div>
			<div className="flex h-full flex-1 items-center justify-start overflow-hidden px-1">
				<Taskbar onToggleWindow={props.onToggleWindow} windows={props.windows} />
			</div>
			<div className="h-full shrink-0">
				<StatusIconsSection />
			</div>
		</footer>
	);
}

function Taskbar(props: { windows: WindowConfig[]; onToggleWindow: (id: number) => void }) {
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
		const sortedEntries = [...entries].sort((a, b) => b.windows.length - a.windows.length);

		while (calculateWidth(sortedEntries) > availableWidth && availableWidth > 0) {
			// Find the first entry that has more than 1 window and is not grouped
			const toGroup = sortedEntries.find((e) => !e.isGrouped && e.windows.length > 1);
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
		<div className="flex h-full w-full items-center gap-1 overflow-hidden" ref={containerRef}>
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
			className={`flex h-[24px] min-w-[40px] max-w-[200px] flex-1 cursor-pointer select-none items-center overflow-hidden rounded-sm px-2 ${
				props.active
					? "border-[#163f8c] bg-[#1e52b7] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]"
					: "border-[#1c56c5] bg-linear-to-b from-[#3c81f0] to-[#245edb] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] hover:from-[#4c91ff] hover:to-[#346efb]"
			}border ${props.className ?? ""}
      `}
			onClick={() => props.onClick()}
			title={props.title}
		>
			{props.icon && <img alt="" className="mr-1.5 h-4 w-4 shrink-0" src={props.icon} />}
			<span className="truncate text-[11px] text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
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
				className={`flex h-[24px] min-w-[40px] max-w-[200px] flex-1 cursor-pointer select-none items-center overflow-hidden rounded-sm px-2 ${
					isAnyActive
						? "border-[#163f8c] bg-[#1e52b7] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)]"
						: "border-[#1c56c5] bg-linear-to-b from-[#3c81f0] to-[#245edb] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] hover:from-[#4c91ff] hover:to-[#346efb]"
				}border`}
			>
				{props.icon && <img alt="" className="mr-1.5 h-4 w-4 shrink-0" src={props.icon} />}
				<span className="flex-1 truncate text-left text-[11px] text-white" style={{ fontFamily: "Tahoma, sans-serif" }}>
					{props.title}
				</span>
				<span className="ml-1 text-[9px] text-white">▼</span>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner align="start" side="top" sideOffset={4}>
					<Popover.Popup
						className="z-50 min-w-[150px] border-2 border-[#0054e3] bg-[#ece9d8] py-1 shadow-xl"
						style={{ fontFamily: "Tahoma, sans-serif" }}
					>
						<Menu.Root>
							{props.windows.map((window) => (
								<Menu.Item
									className="cursor-default truncate px-4 py-1.5 text-[11px] text-black hover:bg-[#316ac5] hover:text-white"
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

function StatusIconsSection() {
	return (
		<div
			className="flex h-full items-center gap-2 border-[#00309c] border-l px-2 shadow-[inset_1px_0_0_rgba(255,255,255,0.2)]"
			style={{
				background: "linear-gradient(to bottom, #107ceb 0%, #107ceb 100%)",
				backgroundColor: "#107ceb",
			}}
		>
			<StatusSectionClock />
		</div>
	);
}
