import { useCallback, useEffect, useRef, useState } from "react";

const TASKBAR_HEIGHT = 30;
const SNAPPING_ZONE_RATIO = 0.1;

interface UseWindowDragParams {
	x: number;
	y: number;
	width: number;
	height: number;
	setX: (x: number) => void;
	setY: (y: number) => void;
	setWidth: (width: number) => void;
	setHeight: (height: number) => void;
	setIsSnappingWindow: (snapping: boolean) => void;
	setSnappingSide: (side: "left" | "right" | null) => void;
}

const MIN_X_POS = 0;
const MIN_Y_POS = 0;
const OVERSHOOT_THRESHOLD = 300;
const MIN_X_POS_OVERSHOOT_THRESHOLD = MIN_X_POS - OVERSHOOT_THRESHOLD;
const MIN_Y_POS_OVERSHOOT_THRESHOLD = MIN_Y_POS - OVERSHOOT_THRESHOLD;


export function useWindowDrag(params: UseWindowDragParams) {
	const [isDragging, setIsDragging] = useState(false);
	const lastMousePos = useRef({ x: 0, y: 0 });
	const windowPosSize = useRef({
		x: params.x,
		y: params.y,
		width: params.width,
		height: params.height,
	});

	useEffect(() => {
		windowPosSize.current = {
			x: params.x,
			y: params.y,
			width: params.width,
			height: params.height,
		};
	}, [params.x, params.y, params.width, params.height]);

	const onMouseDown = useCallback((e: React.MouseEvent) => {
		if (e.button !== 0) return;

		const target = e.target as HTMLElement;
		const currentTarget = e.currentTarget as HTMLElement;

		if (
			target.closest("button") ||
			currentTarget.querySelector("button")?.contains(target)
		) {
			return;
		}

		setIsDragging(true);
		const mouseX = e.clientX;
		const mouseY = e.clientY;
		lastMousePos.current = { x: mouseX, y: mouseY };
	}, []);

	const onMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!isDragging) return;

			const deltaX = e.clientX - lastMousePos.current.x;
			const deltaY = e.clientY - lastMousePos.current.y;
			const mouseX = e.clientX;
			lastMousePos.current = { x: e.clientX, y: e.clientY };

			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			const maxX = viewportWidth - windowPosSize.current.width;
			const maxY =
				viewportHeight - windowPosSize.current.height - TASKBAR_HEIGHT;

			const proposedX = windowPosSize.current.x + deltaX;
			const proposedY = windowPosSize.current.y + deltaY;

			const snappingZone = viewportWidth * SNAPPING_ZONE_RATIO;

			if (mouseX < snappingZone) {
				params.setIsSnappingWindow(true);
				params.setSnappingSide("left");
			} else if (mouseX > viewportWidth - snappingZone) {
				params.setIsSnappingWindow(true);
				params.setSnappingSide("right");
			} else {
				params.setIsSnappingWindow(false);
				params.setSnappingSide(null);
			}

			let dampingX = 1.0;
			if (proposedX < 0) {
				if (deltaX < 0) {
					const dist = proposedX - -OVERSHOOT_THRESHOLD;
					dampingX = Math.max(0, dist / OVERSHOOT_THRESHOLD);
				}
			} else if (proposedX > maxX) {
				if (deltaX > 0) {
					const dist = maxX + OVERSHOOT_THRESHOLD - proposedX;
					dampingX = Math.max(0, dist / OVERSHOOT_THRESHOLD);
				}
			}

			let dampingY = 1.0;
			if (proposedY < 0) {
				if (deltaY < 0) {
					const dist = proposedY - -OVERSHOOT_THRESHOLD;
					dampingY = Math.max(0, dist / OVERSHOOT_THRESHOLD);
				}
			} else if (proposedY > maxY) {
				if (deltaY > 0) {
					const dist = maxY + OVERSHOOT_THRESHOLD - proposedY;
					dampingY = Math.max(0, dist / OVERSHOOT_THRESHOLD);
				}
			}

			const dampedDeltaX = deltaX * dampingX;
			const dampedDeltaY = deltaY * dampingY;

			let newX = windowPosSize.current.x + dampedDeltaX;
			let newY = windowPosSize.current.y + dampedDeltaY;

			newX = Math.max(
				MIN_X_POS_OVERSHOOT_THRESHOLD,
				Math.min(newX, maxX + OVERSHOOT_THRESHOLD),
			);
			newY = Math.max(
				MIN_Y_POS_OVERSHOOT_THRESHOLD,
				Math.min(newY, maxY + OVERSHOOT_THRESHOLD),
			);

			params.setX(newX);
			params.setY(newY);
		},
		[
			isDragging,
			params.setX,
			params.setY,
			params.setIsSnappingWindow,
			params.setSnappingSide,
		],
	);

	const onMouseUp = useCallback(
		(e: MouseEvent) => {
			setIsDragging(false);
			params.setIsSnappingWindow(false);
			params.setSnappingSide(null);

			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			const snappingZone = viewportWidth * SNAPPING_ZONE_RATIO;
			const mouseX = e.clientX;

			if (mouseX < snappingZone) {
				params.setWidth(viewportWidth / 2);
				params.setHeight(viewportHeight - TASKBAR_HEIGHT);
				params.setX(0);
				params.setY(0);
				return;
			} else if (mouseX > viewportWidth - snappingZone) {
				params.setWidth(viewportWidth / 2);
				params.setHeight(viewportHeight - TASKBAR_HEIGHT);
				params.setX(viewportWidth / 2);
				params.setY(0);
				return;
			}

			const minX = 0;
			const minY = 0;
			const maxX = viewportWidth - windowPosSize.current.width;
			const maxY = viewportHeight - windowPosSize.current.height - TASKBAR_HEIGHT;

			let targetX = windowPosSize.current.x;
			let targetY = windowPosSize.current.y;

			let needsSnapBack = false;

			if (windowPosSize.current.x < minX) {
				targetX = minX;
				needsSnapBack = true;
			} else if (windowPosSize.current.x > maxX) {
				targetX = maxX;
				needsSnapBack = true;
			}

			if (windowPosSize.current.y < minY) {
				targetY = minY;
				needsSnapBack = true;
			} else if (windowPosSize.current.y > maxY) {
				targetY = maxY;
				needsSnapBack = true;
			}

			if (needsSnapBack) {
				params.setX(targetX);
				params.setY(targetY);
			}
		},
		[
			params.setX,
			params.setY,
			params.setWidth,
			params.setHeight,
			params.setIsSnappingWindow,
			params.setSnappingSide,
		],
	);

	useEffect(() => {
		if (isDragging) {
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		} else {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		}
		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, [isDragging, onMouseMove, onMouseUp]);

	return {
		onMouseDown,
		isDragging,
	};
}
