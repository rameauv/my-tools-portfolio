import { useEffect } from "react";
import { getCursorForDirection } from "./getCursorForDirection";
import type { ResizeDirection } from "./ResizeDirection";

export function useResizeBodyCursor(params: {
	isResizing: boolean;
	resizeDirection: ResizeDirection | null;
	onResizeMouseMove: (e: MouseEvent) => void;
	onResizeMouseUp: () => void;
}) {
	const { isResizing, resizeDirection, onResizeMouseMove, onResizeMouseUp } =
		params;

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
	}, [isResizing, resizeDirection, onResizeMouseMove, onResizeMouseUp]);
}
