import { useEffect, useEffectEvent, useRef, useState } from "react";

interface UseDesktopItemDragParams {
	x: number;
	y: number;
	onUpdatePosition: (x: number, y: number) => void;
	onClick?: () => void;
}

const CLICK_THRESHOLD = 5;

export function useDesktopItemDrag(params: UseDesktopItemDragParams) {
	const [isPressed, setIsPressed] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const dragStartPos = useRef({ x: 0, y: 0 });
	const initialMousePos = useRef({ x: 0, y: 0 });
	const hasMoved = useRef(false);

	const onMouseMoveEvent = useEffectEvent((e: MouseEvent) => {
		if (!isPressed) return;

		const deltaX = e.clientX - initialMousePos.current.x;
		const deltaY = e.clientY - initialMousePos.current.y;

		if (Math.sqrt(deltaX ** 2 + deltaY ** 2) >= CLICK_THRESHOLD) {
			hasMoved.current = true;
			setIsDragging(true);
		}

		const newX = dragStartPos.current.x + deltaX;
		const newY = dragStartPos.current.y + deltaY;

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

	const onMouseDown = (e: React.MouseEvent) => {
		if (e.button !== 0) return;
		e.preventDefault();

		setIsPressed(true);
		hasMoved.current = false;
		initialMousePos.current = { x: e.clientX, y: e.clientY };
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
