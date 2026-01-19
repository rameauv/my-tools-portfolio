import { Dialog } from "@base-ui/react";
import * as React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useWindowContext } from "../window-snapping/WindowContext";
import {
	CloseActiveIcon,
	CloseClickedIcon,
	CloseHoverIcon,
	CloseInactiveIcon,
} from "./CloseButtonIcons";
import {
	MaximizeActiveIcon,
	MaximizeClickedIcon,
	MaximizeHoverIcon,
	MaximizeInactiveIcon,
} from "./MaximizeIcons";
import {
	MinimizeActiveIcon,
	MinimizeClickedIcon,
	MinimizeHoverIcon,
	MinimizeInactiveIcon,
} from "./MinimizeIcons";
import { useWindowDrag } from "./useWindowDrag";
import { useWindowResize } from "./useWindowResize";

const TASKBAR_HEIGHT = 30;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mql = window.matchMedia("(max-width: 768px)");
		const onChange = () => setIsMobile(mql.matches);
		mql.addEventListener("change", onChange);
		setIsMobile(mql.matches);
		return () => mql.removeEventListener("change", onChange);
	}, []);

	return isMobile;
}

export interface WindowConfig {
	id: number;
	appId: string;
	title: string;
	iconSrc: string;
	component: React.ComponentType<object>;
	depth: number;
	groupingId: string;
	isMinimized: boolean;
	isFocused: boolean;
	componentProps?: Record<string, unknown>;
	defaultWidth?: number;
	defaultHeight?: number;
}

function mapWindowDepthToZIndex(depth: number): number {
	return 50 + depth;
}

export function Window(props: {
	children: React.ReactNode;
	windowsContainerRef: React.RefObject<HTMLDivElement | null>;
	title?: string;
	onClose?: () => void;
	defaultWidth?: number;
	defaultHeight?: number;
	config: WindowConfig;
	onMinimize?: () => void;
	onFocus: () => void;
}) {
	const open = true;
	const [x, setX] = useState(100);
	const [y, setY] = useState(100);
	const [width, setWidth] = useState(props.defaultWidth ?? 200);
	const [height, setHeight] = useState(props.defaultHeight ?? 200);

	const isMobile = useIsMobile();

	useEffect(() => {
		if (isMobile) {
			setX(0);
			setY(0);
			setWidth(window.innerWidth);
			setHeight(window.innerHeight - TASKBAR_HEIGHT);
		}
	}, [isMobile]);

	// Use refs to access current values in resize handler without re-creating the effect
	const windowBoundsRef = useRef({ x, y, width, height });
	useEffect(() => {
		windowBoundsRef.current = { x, y, width, height };
	}, [x, y, width, height]);

	// Listen for browser window resize events to keep window within viewport bounds
	useEffect(() => {
		const handleWindowResize = () => {
			if (isMobile) {
				setX(0);
				setY(0);
				setWidth(window.innerWidth);
				setHeight(window.innerHeight - TASKBAR_HEIGHT);
				return;
			}
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			const current = windowBoundsRef.current;
			const maxX = viewportWidth - current.width;
			const maxY = viewportHeight - current.height - TASKBAR_HEIGHT;

			let newX = current.x;
			let newY = current.y;
			let newWidth = current.width;
			let newHeight = current.height;

			// Clamp position if window extends beyond viewport boundaries
			if (current.x + current.width > viewportWidth) {
				// Window extends beyond right edge
				newX = Math.max(0, Math.min(current.x, maxX));
				// If position adjustment isn't enough, reduce width
				if (newX + newWidth > viewportWidth) {
					newWidth = Math.max(MIN_WIDTH, viewportWidth - newX);
				}
			}
			if (current.y + current.height > viewportHeight - TASKBAR_HEIGHT) {
				// Window extends beyond bottom edge
				newY = Math.max(0, Math.min(current.y, maxY));
				// If position adjustment isn't enough, reduce height
				if (newY + newHeight > viewportHeight - TASKBAR_HEIGHT) {
					newHeight = Math.max(
						MIN_HEIGHT,
						viewportHeight - newY - TASKBAR_HEIGHT,
					);
				}
			}

			// Clamp position to ensure window doesn't go negative
			if (newX < 0) {
				newX = 0;
			}
			if (newY < 0) {
				newY = 0;
			}

			// Ensure window fits within viewport width
			if (newWidth > viewportWidth) {
				newWidth = Math.max(MIN_WIDTH, viewportWidth);
				newX = 0;
			}

			// Ensure window fits within viewport height
			if (newHeight > viewportHeight - TASKBAR_HEIGHT) {
				newHeight = Math.max(MIN_HEIGHT, viewportHeight - TASKBAR_HEIGHT);
				newY = 0;
			}

			// Only update if changes were made
			if (
				newX !== current.x ||
				newY !== current.y ||
				newWidth !== current.width ||
				newHeight !== current.height
			) {
				setX(newX);
				setY(newY);
				setWidth(newWidth);
				setHeight(newHeight);
			}
		};

		window.addEventListener("resize", handleWindowResize);
		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, [isMobile]);

	return (
		<Dialog.Root modal={false} open={open}>
			<Dialog.Portal container={props.windowsContainerRef}>
				<Dialog.Popup
					className={`
            fixed bg-[#ece9d8] border-2 shadow-xl z-50 overflow-hidden rounded-t-lg
            ${props.config.isFocused ? "border-[#0054e3]" : "border-[#7a96df]"}
          `}
					onFocus={() => props.onFocus()}
					style={{
						top: 0,
						left: 0,
						transform: `translate3d(${x}px, ${y}px, 0)`,
						width: width,
						height: height,
						opacity: props.config.isMinimized ? 0 : 1,
						pointerEvents: props.config.isMinimized ? "none" : "auto",
						zIndex: mapWindowDepthToZIndex(props.config.depth),
						borderRadius: isMobile ? 0 : undefined,
					}}
				>
					<WindowContent
						height={height}
						isFocused={props.config.isFocused}
						isMobile={isMobile}
						onClose={props.onClose}
						onMinimize={props.onMinimize}
						setHeight={setHeight}
						setWidth={setWidth}
						setX={setX}
						setY={setY}
						title={props.title}
						width={width}
						x={x}
						y={y}
					>
						{props.children}
					</WindowContent>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

function WindowContent(props: {
	children: React.ReactNode;
	title?: string;
	onClose?: () => void;
	x: number;
	y: number;
	setX: (x: number) => void;
	setY: (y: number) => void;
	width: number;
	height: number;
	setWidth: (width: number) => void;
	setHeight: (height: number) => void;
	onMinimize?: () => void;
	isFocused: boolean;
	isMobile: boolean;
}) {
	const {
		onResizeMouseDown,
		onResizeMouseMove,
		onResizeMouseUp,
		isResizing,
		resizeDirection,
	} = useWindowResize({
		width: props.width,
		height: props.height,
		x: props.x,
		y: props.y,
		setWidth: props.setWidth,
		setHeight: props.setHeight,
		setX: props.setX,
		setY: props.setY,
	});

	const getCursorForDirection = useCallback(
		(direction: string | null): string => {
			if (!direction) return "default";
			const cursorMap: Record<string, string> = {
				nw: "nw-resize",
				n: "n-resize",
				ne: "ne-resize",
				e: "e-resize",
				se: "se-resize",
				s: "s-resize",
				sw: "sw-resize",
				w: "w-resize",
			};
			return cursorMap[direction] || "default";
		},
		[],
	);

	useEffect(() => {
		if (isResizing && resizeDirection) {
			const cursor = getCursorForDirection(resizeDirection);
			document.body.style.cursor = cursor;
			document.body.style.userSelect = "none";
			window.addEventListener("mousemove", onResizeMouseMove);
			window.addEventListener("mouseup", onResizeMouseUp);
		} else {
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			window.removeEventListener("mousemove", onResizeMouseMove);
			window.removeEventListener("mouseup", onResizeMouseUp);
		}
		return () => {
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			window.removeEventListener("mousemove", onResizeMouseMove);
			window.removeEventListener("mouseup", onResizeMouseUp);
		};
	}, [
		isResizing,
		resizeDirection,
		onResizeMouseMove,
		onResizeMouseUp,
		getCursorForDirection,
	]);

	return (
		<div className="flex flex-col h-full relative">
			<WindowHeader
				height={props.height}
				isFocused={props.isFocused}
				isMobile={props.isMobile}
				onClose={props.onClose}
				onMinimize={props.onMinimize}
				setHeight={props.setHeight}
				setWidth={props.setWidth}
				setX={props.setX}
				setY={props.setY}
				title={props.title}
				width={props.width}
				x={props.x}
				y={props.y}
			/>
			<div className="flex-1 overflow-auto bg-white m-1 border border-gray-400">
				{props.children}
			</div>
			{!props.isMobile && (
				<ResizeHandles onResizeMouseDown={onResizeMouseDown} />
			)}
		</div>
	);
}

function ResizeHandles(props: {
	onResizeMouseDown: (e: React.MouseEvent, direction: string) => void;
}) {
	const handleSize = 8;
	const handleHitArea = 12;

	const getCursor = (direction: string): string => {
		const cursorMap: Record<string, string> = {
			nw: "nw-resize",
			n: "n-resize",
			ne: "ne-resize",
			e: "e-resize",
			se: "se-resize",
			s: "s-resize",
			sw: "sw-resize",
			w: "w-resize",
		};
		return cursorMap[direction] || "default";
	};

	return (
		<>
			{/* Corners */}
			<div
				className="absolute z-50 bg-transparent"
				onMouseDown={(e) => props.onResizeMouseDown(e, "nw")}
				style={{
					top: -handleSize / 2,
					left: -handleSize / 2,
					width: handleHitArea,
					height: handleHitArea,
					cursor: getCursor("nw"),
				}}
			/>
			<div
				className="absolute z-50 bg-transparent"
				onMouseDown={(e) => props.onResizeMouseDown(e, "ne")}
				style={{
					top: -handleSize / 2,
					right: -handleSize / 2,
					width: handleHitArea,
					height: handleHitArea,
					cursor: getCursor("ne"),
				}}
			/>
			<div
				className="absolute z-50 bg-transparent"
				onMouseDown={(e) => props.onResizeMouseDown(e, "sw")}
				style={{
					bottom: -handleSize / 2,
					left: -handleSize / 2,
					width: handleHitArea,
					height: handleHitArea,
					cursor: getCursor("sw"),
				}}
			/>
			<div
				className="absolute z-50 bg-transparent"
				onMouseDown={(e) => props.onResizeMouseDown(e, "se")}
				style={{
					bottom: -handleSize / 2,
					right: -handleSize / 2,
					width: handleHitArea,
					height: handleHitArea,
					cursor: getCursor("se"),
				}}
			/>
			{/* Edges */}
			<div
				className="absolute z-50 bg-transparent"
				onMouseDown={(e) => props.onResizeMouseDown(e, "n")}
				style={{
					top: -handleSize / 2,
					left: handleHitArea / 2,
					right: handleHitArea / 2,
					height: handleHitArea,
					cursor: getCursor("n"),
				}}
			/>
			<div
				className="absolute z-50 bg-transparent"
				onMouseDown={(e) => props.onResizeMouseDown(e, "s")}
				style={{
					bottom: -handleSize / 2,
					left: handleHitArea / 2,
					right: handleHitArea / 2,
					height: handleHitArea,
					cursor: getCursor("s"),
				}}
			/>
			<div
				className="absolute z-50 bg-transparent"
				onMouseDown={(e) => props.onResizeMouseDown(e, "w")}
				style={{
					left: -handleSize / 2,
					top: handleHitArea / 2,
					bottom: handleHitArea / 2,
					width: handleHitArea,
					cursor: getCursor("w"),
				}}
			/>
			<div
				className="absolute z-50 bg-transparent"
				onMouseDown={(e) => props.onResizeMouseDown(e, "e")}
				style={{
					right: -handleSize / 2,
					top: handleHitArea / 2,
					bottom: handleHitArea / 2,
					width: handleHitArea,
					cursor: getCursor("e"),
				}}
			/>
		</>
	);
}

function WindowHeader(props: {
	title?: string;
	onClose?: () => void;
	x: number;
	y: number;
	setX: (x: number) => void;
	setY: (y: number) => void;
	width: number;
	height: number;
	setWidth: (width: number) => void;
	setHeight: (height: number) => void;
	onMinimize?: () => void;
	isFocused: boolean;
	isMobile: boolean;
}) {
	const { setIsSnappingWindow, setSnappingSide } = useWindowContext();
	const { onMouseDown, isDragging } = useWindowDrag({
		x: props.x,
		y: props.y,
		width: props.width,
		height: props.height,
		setX: props.setX,
		setY: props.setY,
		setWidth: props.setWidth,
		setHeight: props.setHeight,
		setIsSnappingWindow,
		setSnappingSide,
	});

	const onMaximize = React.useEffectEvent(() => {
		const viewportWidth = window.innerWidth;
		const maxHeight = window.innerHeight - TASKBAR_HEIGHT;
		props.setWidth(viewportWidth);
		props.setHeight(maxHeight);
		props.setX(0);
		props.setY(0);
	});

	return (
		<div
			className={`
        flex items-center justify-between px-2 py-1 select-none
        ${
					props.isFocused
						? "bg-linear-to-b from-[#0058e6] via-[#2576ff] to-[#0058e6]"
						: "bg-linear-to-b from-[#7a96df] via-[#9db9eb] to-[#7a96df]"
				}
        ${isDragging ? "cursor-grabbing" : "cursor-grab"}
        ${props.isMobile ? "cursor-default" : ""}
      `}
			onMouseDown={props.isMobile ? undefined : onMouseDown}
		>
			<div className="flex items-center gap-2 overflow-hidden pointer-events-none">
				<span
					className={`
          font-bold text-sm truncate shadow-sm
          ${props.isFocused ? "text-white" : "text-[#dbe1f1]"}
        `}
				>
					{props.title ?? "Window"}
				</span>
			</div>
			<div className="flex items-center gap-1 relative z-10">
				<MinimizeButton
					isFocused={props.isFocused}
					onClick={props.onMinimize}
				/>
				{!props.isMobile && (
					<MaximizeButton isFocused={props.isFocused} onClick={onMaximize} />
				)}
				<CloseButton isFocused={props.isFocused} onClick={props.onClose} />
			</div>
		</div>
	);
}

function WindowControlButton(props: {
	isFocused: boolean;
	onClick?: () => void;
	icons: {
		active: React.ReactNode;
		inactive: React.ReactNode;
		hover: React.ReactNode;
		clicked: React.ReactNode;
	};
}) {
	const [isHovered, setIsHovered] = useState(false);
	const [isPressed, setIsPressed] = useState(false);

	const renderIcon = () => {
		if (!props.isFocused) {
			return props.icons.inactive;
		}

		if (isPressed) {
			return props.icons.clicked;
		}

		if (isHovered) {
			return props.icons.hover;
		}

		return props.icons.active;
	};

	return (
		<button
			className="w-[21px] h-[21px] flex items-center justify-center cursor-pointer outline-none border-none bg-transparent"
			onMouseDown={(e) => {
				setIsPressed(true);
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => {
				setIsHovered(false);
				setIsPressed(false);
			}}
			onMouseUp={() => {
				setIsPressed(false);
				props.onClick?.();
			}}
			type="button"
		>
			{renderIcon()}
		</button>
	);
}

const MINIMIZE_ICONS = {
	active: <MinimizeActiveIcon />,
	inactive: <MinimizeInactiveIcon />,
	hover: <MinimizeHoverIcon />,
	clicked: <MinimizeClickedIcon />,
};

const MAXIMIZE_ICONS = {
	active: <MaximizeActiveIcon />,
	inactive: <MaximizeInactiveIcon />,
	hover: <MaximizeHoverIcon />,
	clicked: <MaximizeClickedIcon />,
};

const CLOSE_ICONS = {
	active: <CloseActiveIcon />,
	inactive: <CloseInactiveIcon />,
	hover: <CloseHoverIcon />,
	clicked: <CloseClickedIcon />,
};

const MinimizeButton = memo(function MinimizeButton(props: {
	isFocused: boolean;
	onClick?: () => void;
}) {
	return (
		<WindowControlButton
			icons={MINIMIZE_ICONS}
			isFocused={props.isFocused}
			onClick={props.onClick}
		/>
	);
});

const MaximizeButton = memo(function MaximizeButton(props: {
	isFocused: boolean;
	onClick?: () => void;
}) {
	return (
		<WindowControlButton
			icons={MAXIMIZE_ICONS}
			isFocused={props.isFocused}
			onClick={props.onClick}
		/>
	);
});

const CloseButton = memo(function CloseButton(props: {
	isFocused: boolean;
	onClick?: () => void;
}) {
	console.log("render CloseButton");
	return (
		<WindowControlButton
			icons={CLOSE_ICONS}
			isFocused={props.isFocused}
			onClick={props.onClick}
		/>
	);
});
