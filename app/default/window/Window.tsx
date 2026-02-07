import { Dialog } from "@base-ui/react";
import * as React from "react";
import { memo, useEffect, useRef, useState } from "react";
import { cn } from "~/utils/cn";
import type { WindowContentProps } from "../apps/WindowContentProps";
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
import { ResizeHandles } from "./ResizeHandles";
import { useResizeBodyCursor } from "./useResizeBodyCursor";
import { useViewportResize } from "./useViewportResize";
import { useWindowDrag } from "./useWindowDrag";
import { useWindowResize } from "./useWindowResize";

const TASKBAR_HEIGHT = 30;

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
	component: React.ComponentType<WindowContentProps>;
	depth: number;
	groupingId: string;
	isMinimized: boolean;
	isFocused: boolean;
	componentData?: unknown;
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

	const windowBoundsRef = useRef({ x, y, width, height });
	useEffect(() => {
		windowBoundsRef.current = { x, y, width, height };
	}, [x, y, width, height]);

	useViewportResize(
		windowBoundsRef,
		{ setX, setY, setWidth, setHeight },
		isMobile,
	);

	return (
		<Dialog.Root modal={false} open={open}>
			<Dialog.Portal container={props.windowsContainerRef}>
				<Dialog.Popup
					className={cn(
						"fixed bg-[#ece9d8] border-2 shadow-xl z-50 overflow-hidden rounded-t-lg top-0 left-0",
						props.config.isFocused ? "border-[#0054e3]" : "border-[#7a96df]",
					)}
					onFocus={() => props.onFocus()}
					style={{
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
	const windowResize = useWindowResize({
		width: props.width,
		height: props.height,
		x: props.x,
		y: props.y,
		setWidth: props.setWidth,
		setHeight: props.setHeight,
		setX: props.setX,
		setY: props.setY,
	});

	useResizeBodyCursor({
		isResizing: windowResize.isResizing,
		resizeDirection: windowResize.resizeDirection,
		onResizeMouseMove: windowResize.onResizeMouseMove,
		onResizeMouseUp: windowResize.onResizeMouseUp,
	});

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
				<ResizeHandles onResizeMouseDown={windowResize.onResizeMouseDown} />
			)}
		</div>
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
			className={cn(
				"flex items-center justify-between px-2 py-1 select-none",
				props.isFocused
					? "bg-linear-to-b from-[#0058e6] via-[#2576ff] to-[#0058e6]"
					: "bg-linear-to-b from-[#7a96df] via-[#9db9eb] to-[#7a96df]",
				isDragging ? "cursor-grabbing" : "cursor-grab",
				props.isMobile && "cursor-default",
			)}
			onMouseDown={props.isMobile ? undefined : onMouseDown}
		>
			<div className="flex items-center gap-2 overflow-hidden pointer-events-none">
				<span
					className={cn(
						"font-bold text-sm truncate shadow-sm",
						props.isFocused ? "text-white" : "text-[#dbe1f1]",
					)}
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
