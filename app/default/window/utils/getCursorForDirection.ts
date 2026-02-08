import type { ResizeDirection } from "../models/ResizeDirection";

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

export function getCursorForDirection(direction: ResizeDirection): string {
	return cursorMap[direction];
}
