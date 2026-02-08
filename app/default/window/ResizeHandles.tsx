import * as React from "react";
import type { ResizeDirection } from "./models/ResizeDirection";
import { getCursorForDirection } from "./utils/getCursorForDirection";

export const ResizeHandles = React.memo(
	(props: { onResizeMouseDown: (e: React.MouseEvent, direction: ResizeDirection) => void }) => {
		const handleSize = 8;
		const handleHitArea = 12;

		return (
			<>
				<div
					className="absolute z-50 bg-transparent"
					onMouseDown={(e) => props.onResizeMouseDown(e, "nw")}
					style={{
						top: -handleSize / 2,
						left: -handleSize / 2,
						width: handleHitArea,
						height: handleHitArea,
						cursor: getCursorForDirection("nw"),
					}}
				/>
				<div
					className="absolute z-50 bg-transparent"
					onMouseDown={(e) => props.onResizeMouseDown(e, "ne")}
					style={{
						top: -handleSize / 2,
						right: -handleSize / 2,
						width: handleHitArea,
						height: handleHitArea,
						cursor: getCursorForDirection("ne"),
					}}
				/>
				<div
					className="absolute z-50 bg-transparent"
					onMouseDown={(e) => props.onResizeMouseDown(e, "sw")}
					style={{
						bottom: -handleSize / 2,
						left: -handleSize / 2,
						width: handleHitArea,
						height: handleHitArea,
						cursor: getCursorForDirection("sw"),
					}}
				/>
				<div
					className="absolute z-50 bg-transparent"
					onMouseDown={(e) => props.onResizeMouseDown(e, "se")}
					style={{
						bottom: -handleSize / 2,
						right: -handleSize / 2,
						width: handleHitArea,
						height: handleHitArea,
						cursor: getCursorForDirection("se"),
					}}
				/>
				{/* Edges */}
				<div
					className="absolute z-50 bg-transparent"
					onMouseDown={(e) => props.onResizeMouseDown(e, "n")}
					style={{
						top: -handleSize / 2,
						left: handleHitArea / 2,
						right: handleHitArea / 2,
						height: handleHitArea,
						cursor: getCursorForDirection("n"),
					}}
				/>
				<div
					className="absolute z-50 bg-transparent"
					onMouseDown={(e) => props.onResizeMouseDown(e, "s")}
					style={{
						bottom: -handleSize / 2,
						left: handleHitArea / 2,
						right: handleHitArea / 2,
						height: handleHitArea,
						cursor: getCursorForDirection("s"),
					}}
				/>
				<div
					className="absolute z-50 bg-transparent"
					onMouseDown={(e) => props.onResizeMouseDown(e, "w")}
					style={{
						left: -handleSize / 2,
						top: handleHitArea / 2,
						bottom: handleHitArea / 2,
						width: handleHitArea,
						cursor: getCursorForDirection("w"),
					}}
				/>
				<div
					className="absolute z-50 bg-transparent"
					onMouseDown={(e) => props.onResizeMouseDown(e, "e")}
					style={{
						right: -handleSize / 2,
						top: handleHitArea / 2,
						bottom: handleHitArea / 2,
						width: handleHitArea,
						cursor: getCursorForDirection("e"),
					}}
				/>
			</>
		);
	},
);
