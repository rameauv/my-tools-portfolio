import type { MutableRefObject } from "react";
import { useEffect, useRef } from "react";

const TASKBAR_HEIGHT = 30;
const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

export type WindowBoundsRef = MutableRefObject<{
	x: number;
	y: number;
	width: number;
	height: number;
}>;

export function useViewportResize(
	windowBoundsRef: WindowBoundsRef,
	setters: {
		setX: (x: number) => void;
		setY: (y: number) => void;
		setWidth: (w: number) => void;
		setHeight: (h: number) => void;
	},
	isMobile: boolean,
) {
	const settersRef = useRef(setters);
	settersRef.current = setters;

	// biome-ignore lint/correctness/useExhaustiveDependencies: windowBoundsRef is stable; we read .current inside the handler on each resize
	useEffect(() => {
		const handleWindowResize = () => {
			const set = settersRef.current;
			if (isMobile) {
				set.setX(0);
				set.setY(0);
				set.setWidth(window.innerWidth);
				set.setHeight(window.innerHeight - TASKBAR_HEIGHT);
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
				set.setX(newX);
				set.setY(newY);
				set.setWidth(newWidth);
				set.setHeight(newHeight);
			}
		};

		window.addEventListener("resize", handleWindowResize);
		return () => {
			window.removeEventListener("resize", handleWindowResize);
		};
	}, [isMobile]);
}
