import { useEffect } from "react";
import type { ResizeDirection } from "../models/ResizeDirection";
import { getCursorForDirection } from "../utils/getCursorForDirection";

export function useResizeBodyCursor(params: {
	isResizing: boolean;
	resizeDirection: ResizeDirection | null;
	onResizeMouseMove: (e: MouseEvent) => void;
	onResizeMouseUp: () => void;
}) {
	useEffect(() => {
		if (params.isResizing && params.resizeDirection) {
			const cursor = getCursorForDirection(params.resizeDirection);
			document.body.style.cursor = cursor;
			document.body.style.userSelect = "none";
			window.addEventListener("mousemove", params.onResizeMouseMove);
			window.addEventListener("mouseup", params.onResizeMouseUp);
		} else {
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			window.removeEventListener("mousemove", params.onResizeMouseMove);
			window.removeEventListener("mouseup", params.onResizeMouseUp);
		}
		return () => {
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
			window.removeEventListener("mousemove", params.onResizeMouseMove);
			window.removeEventListener("mouseup", params.onResizeMouseUp);
		};
	}, [params.isResizing, params.resizeDirection, params.onResizeMouseMove, params.onResizeMouseUp]);
}
