import { Dialog } from "@base-ui/react";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/utils/cn";
import { useWindowContext } from "../window-snapping/WindowContext";
import { useIsMobile } from "./icons/useIsMobile";
import { useMoveCursor } from "./icons/useMoveCursor";
import { useResizeBodyCursor } from "./icons/useResizeBodyCursor";
import { useViewportResize } from "./icons/useViewportResize";
import { useWindowDrag } from "./icons/useWindowDrag";
import { useWindowResize } from "./icons/useWindowResize";
import type { ResizeDirection } from "./models/ResizeDirection";
import type { WindowConfig } from "./models/WindowConfig";
import { ResizeHandles } from "./ResizeHandles";
import { WindowHeader } from "./WindowHeader";

export const TASKBAR_HEIGHT = 30;

function mapWindowDepthToZIndex(depth: number): number {
	return 50 + depth;
}

export function Window(props: {
	children: React.ReactNode;
	windowsContainerRef: React.RefObject<HTMLDivElement | null>;
	onClose: () => void;
	config: WindowConfig;
	onMinimize: () => void;
	onFocus: () => void;
}) {
	const open = true;
	return (
		<Dialog.Root modal={false} open={open}>
			<Dialog.Portal container={props.windowsContainerRef}>
				<DialogPopup
					config={props.config}
					onClose={props.onClose}
					onFocus={props.onFocus}
					onMinimize={props.onMinimize}
				>
					{props.children}
				</DialogPopup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

const DialogPopup = React.memo(
	(props: {
		children: React.ReactNode;
		config: WindowConfig;
		onFocus: () => void;
		onClose: () => void;
		onMinimize: () => void;
	}) => {
		const [x, setX] = useState(100);
		const [y, setY] = useState(100);
		const [width, setWidth] = useState(props.config.defaultWidth ?? 200);
		const [height, setHeight] = useState(props.config.defaultHeight ?? 200);

		const isMobile = useIsMobile();

		const windowResize = useWindowResize({
			width: width,
			height: height,
			x: x,
			y: y,
			setWidth: setWidth,
			setHeight: setHeight,
			setX: setX,
			setY: setY,
		});

		const windowContext = useWindowContext();
		const windowDrag = useWindowDrag({
			x: x,
			y: y,
			width: width,
			height: height,
			setX: setX,
			setY: setY,
			setWidth: setWidth,
			setHeight: setHeight,
			setIsSnappingWindow: windowContext.setIsSnappingWindow,
			setSnappingSide: windowContext.setSnappingSide,
		});

		const onMaximize = React.useCallback(() => {
			const viewportWidth = window.innerWidth;
			const maxHeight = window.innerHeight - TASKBAR_HEIGHT;
			setWidth(viewportWidth);
			setHeight(maxHeight);
			setX(0);
			setY(0);
		}, []);

		useResizeBodyCursor({
			isResizing: windowResize.isResizing,
			resizeDirection: windowResize.resizeDirection,
			onResizeMouseMove: windowResize.onResizeMouseMove,
			onResizeMouseUp: windowResize.onResizeMouseUp,
		});

		useMoveCursor({
			isDragging: windowDrag.isDragging,
		});

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

		useViewportResize(windowBoundsRef, { setX, setY, setWidth, setHeight }, isMobile);

		return (
			<Dialog.Popup
				className={cn(
					"fixed top-0 left-0 z-50 overflow-hidden rounded-t-lg border-2 bg-[#ece9d8] shadow-xl",
					props.config.isFocused ? "border-[#0054e3]" : "border-[#7a96df]",
					isMobile ? "rounded-none" : "",
					props.config.isMinimized ? "pointer-events-none" : "pointer-events-auto",
					props.config.isMinimized ? "opacity-0" : "opacity-100",
				)}
				onFocus={() => props.onFocus()}
				style={{
					transform: `translate3d(${x}px, ${y}px, 0)`,
					width: width,
					height: height,
					zIndex: mapWindowDepthToZIndex(props.config.depth),
				}}
			>
				<WindowContent
					isFocused={props.config.isFocused}
					isMobile={isMobile}
					onClose={props.onClose}
					onMaximize={onMaximize}
					onMinimize={props.onMinimize}
					onMouseDown={windowDrag.onMouseDown}
					onResizeMouseDown={windowResize.onResizeMouseDown}
					title={props.config.title}
				>
					{props.children}
				</WindowContent>
			</Dialog.Popup>
		);
	},
);

const WindowContent = React.memo(
	(props: {
		children: React.ReactNode;
		title?: string;
		onClose?: () => void;
		onMinimize?: () => void;
		isFocused: boolean;
		isMobile: boolean;
		onMouseDown: (e: React.MouseEvent) => void;
		onMaximize: () => void;
		onResizeMouseDown: (e: React.MouseEvent, direction: ResizeDirection) => void;
	}) => {
		return (
			<div className="relative flex h-full flex-col">
				<WindowHeader
					isFocused={props.isFocused}
					isMobile={props.isMobile}
					onClose={props.onClose}
					onMaximize={props.onMaximize}
					onMinimize={props.onMinimize}
					onMouseDown={props.onMouseDown}
					title={props.title}
				/>
				<div className="m-1 flex-1 overflow-auto border border-gray-400 bg-white">{props.children}</div>
				{!props.isMobile && <ResizeHandles onResizeMouseDown={props.onResizeMouseDown} />}
			</div>
		);
	},
);
