import type { ResizeDirection } from "./ResizeDirection";

const cursorMap: Record<ResizeDirection, string> = {
	nw: "nw-resize",
	n: "n-resize",
	ne: "ne-resize",
	e: "e-resize",
	se: "se-resize",
	s: "s-resize",
	sw: "sw-resize",
	w: "w-resize",
};

export function getCursorForDirection(
	direction: ResizeDirection | null,
): string {
	if (!direction) return "default";
	return cursorMap[direction] ?? "default";
}
