import { useCallback, useEffect, useRef, useState } from "react";
import type { ResizeDirection } from "./ResizeDirection";

const MIN_X_POS = 0;
const MIN_Y_POS = 0;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;
const TASKBAR_HEIGHT = 30;

interface UseWindowResizeParams {
	width: number;
	height: number;
	x: number;
	y: number;
	setWidth: (width: number) => void;
	setHeight: (height: number) => void;
	setX: (x: number) => void;
	setY: (y: number) => void;
}

export function useWindowResize(params: UseWindowResizeParams) {
	const { setWidth, setHeight, setX, setY, width, height, x, y } = params;
	const [isResizing, setIsResizing] = useState(false);
	const [resizeDirection, setResizeDirection] = useState<ResizeDirection | null>(null);
	const resizeStart = useRef({
		x: 0,
		y: 0,
		winX: 0,
		winY: 0,
		winWidth: 0,
		winHeight: 0,
	});
	const currentDimensions = useRef({
		width: width,
		height: height,
		x: x,
		y: y,
	});
	const lastMousePos = useRef({ x: 0, y: 0 });

	useEffect(() => {
		currentDimensions.current = {
			width: width,
			height: height,
			x: x,
			y: y,
		};
	}, [width, height, x, y]);

	const onResizeMouseDown = useCallback(
		(e: React.MouseEvent, direction: ResizeDirection) => {
			if (e.button !== 0) return;
			e.stopPropagation(); // Prevent triggering drag

			setIsResizing(true);
			setResizeDirection(direction);
			const mouseX = e.clientX;
			const mouseY = e.clientY;
			resizeStart.current = {
				x: mouseX,
				y: mouseY,
				winX: currentDimensions.current.x,
				winY: currentDimensions.current.y,
				winWidth: currentDimensions.current.width,
				winHeight: currentDimensions.current.height,
			};
			lastMousePos.current = { x: mouseX, y: mouseY };
		},
		[],
	);

	const onResizeMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isResizing || !resizeDirection) return;

			const deltaX = e.clientX - lastMousePos.current.x;
			const deltaY = e.clientY - lastMousePos.current.y;
			lastMousePos.current = { x: e.clientX, y: e.clientY };

			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			let newWidth = currentDimensions.current.width;
			let newHeight = currentDimensions.current.height;
			let newX = currentDimensions.current.x;
			let newY = currentDimensions.current.y;

			if (resizeDirection.includes("e")) {
				const proposedWidth = newWidth + deltaX;
				const maxWidth = viewportWidth - newX;
				newWidth = Math.max(MIN_WIDTH, Math.min(proposedWidth, maxWidth));
			}
			if (resizeDirection.includes("w")) {
				const deltaWidth = -deltaX;
				const proposedWidth = newWidth + deltaWidth;
				const minX = 0;
				const maxWidth = newX + newWidth - minX;
				const constrainedWidth = Math.max(
					MIN_WIDTH,
					Math.min(proposedWidth, maxWidth),
				);
				const actualDeltaWidth = constrainedWidth - newWidth;
				newWidth = constrainedWidth;
				newX = newX - actualDeltaWidth;
			}
			if (resizeDirection.includes("s")) {
				const proposedHeight = newHeight + deltaY;
				const maxHeight = viewportHeight - newY - TASKBAR_HEIGHT;
				newHeight = Math.max(MIN_HEIGHT, Math.min(proposedHeight, maxHeight));
			}
			if (resizeDirection.includes("n")) {
				const deltaHeight = -deltaY;
				const proposedHeight = newHeight + deltaHeight;
				const minY = 0;
				const maxHeight = newY + newHeight - minY;
				const constrainedHeight = Math.max(
					MIN_HEIGHT,
					Math.min(proposedHeight, maxHeight),
				);
				const actualDeltaHeight = constrainedHeight - newHeight;
				newHeight = constrainedHeight;
				newY = newY - actualDeltaHeight;
			}

			const maxX = viewportWidth - newWidth;
			const maxY = viewportHeight - newHeight - TASKBAR_HEIGHT;

			if (resizeDirection.includes("w")) {
				newX = Math.max(MIN_X_POS, Math.min(newX, maxX));
			} else {
				newX = Math.max(MIN_X_POS, Math.min(currentDimensions.current.x, maxX));
			}

			if (resizeDirection.includes("n")) {
				newY = Math.max(MIN_Y_POS, Math.min(newY, maxY));
			} else {
				newY = Math.max(MIN_Y_POS, Math.min(currentDimensions.current.y, maxY));
			}

			newWidth = Math.max(MIN_WIDTH, newWidth);
			newHeight = Math.max(MIN_HEIGHT, newHeight);

			setWidth(newWidth);
			setHeight(newHeight);
			setX(newX);
			setY(newY);

			currentDimensions.current = {
				width: newWidth,
				height: newHeight,
				x: newX,
				y: newY,
			};
		},
		[isResizing, resizeDirection, setWidth, setHeight, setX, setY],
	);

	const onResizeMouseUp = useCallback(() => {
		setIsResizing(false);
		setResizeDirection(null);
	}, []);

	return {
		onResizeMouseDown,
		onResizeMouseMove,
		onResizeMouseUp,
		isResizing,
		resizeDirection,
	};
}
