import { useEffect, useEffectEvent, useRef, useState } from "react";

interface UseDesktopItemDragParams {
	x: number;
	y: number;
	onUpdatePosition: (x: number, y: number) => void;
	onClick?: () => void;
}

const CLICK_THRESHOLD = 5; // pixels - if mouse moves less than this, treat as click

export function useDesktopItemDrag(params: UseDesktopItemDragParams) {
	const [isPressed, setIsPressed] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	// Refs for values that don't need to trigger re-renders
	const dragStartPos = useRef({ x: 0, y: 0 });
	const initialMousePos = useRef({ x: 0, y: 0 });
	const hasMoved = useRef(false);

	// Effect Events: Always see latest props/state, never trigger re-runs
	const onMouseMoveEvent = useEffectEvent((e: MouseEvent) => {
		// No need for getIsPressed(); just use isPressed directly
		if (!isPressed) return;

		const deltaX = e.clientX - initialMousePos.current.x;
		const deltaY = e.clientY - initialMousePos.current.y;

		if (Math.sqrt(deltaX ** 2 + deltaY ** 2) >= CLICK_THRESHOLD) {
			hasMoved.current = true;
			setIsDragging(true);
		}

		const newX = dragStartPos.current.x + deltaX;
		const newY = dragStartPos.current.y + deltaY;

		// Accesses latest params.onUpdatePosition without being a dependency
		params.onUpdatePosition(
			Math.max(0, Math.min(newX, window.innerWidth - 100)),
			Math.max(0, Math.min(newY, window.innerHeight - 100)),
		);
	});

	const onMouseUpEvent = useEffectEvent(() => {
		setIsPressed(false);
		setIsDragging(false);
		if (!hasMoved.current && params.onClick) params.onClick();
	});

	// Standard Handler for the element
	const onMouseDown = (e: React.MouseEvent) => {
		if (e.button !== 0) return;
		e.preventDefault();

		setIsPressed(true);
		hasMoved.current = false;
		initialMousePos.current = { x: e.clientX, y: e.clientY };
		// Reading latest params.x/y directly here is safe
		dragStartPos.current = { x: params.x, y: params.y };
	};

	useEffect(() => {
		if (isPressed) {
			window.addEventListener("mousemove", onMouseMoveEvent);
			window.addEventListener("mouseup", onMouseUpEvent);
		}
		return () => {
			window.removeEventListener("mousemove", onMouseMoveEvent);
			window.removeEventListener("mouseup", onMouseUpEvent);
		};
	}, [isPressed]);

	return { onMouseDown, isPressed, isDragging };
}
