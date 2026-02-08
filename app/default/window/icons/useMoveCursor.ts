import { useEffect } from "react";

export function useMoveCursor(params: { isDragging: boolean }) {
	useEffect(() => {
		if (params.isDragging) {
			document.body.style.cursor = "move";
			document.body.style.userSelect = "none";
		} else {
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		}
		return () => {
			document.body.style.cursor = "";
			document.body.style.userSelect = "";
		};
	}, [params.isDragging]);
}
