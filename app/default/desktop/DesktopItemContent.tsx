import * as React from "react";
import type { DesktopItemData } from "./DesktopItemData";
import { DesktopItemIcon } from "./DesktopItemIcon";

export const DesktopItemContent = React.memo(
	function DesktopItemContent(props: {
		item: DesktopItemData;
		isDragging: boolean;
	}) {
		console.log("render DesktopItemContent");
		// Click and drag are handled by the drag hook in DesktopItemComponent
		// This component is just for rendering the content
		return (
			<div className="flex flex-col items-center gap-2 w-20 hover:cursor-pointer">
				<DesktopItemIcon item={props.item} />
				<p className="line-clamp-2 text-sm min-w-0 w-full text-center leading-tight m-0 wrap-break-word">
					{props.item.title}
				</p>
			</div>
		);
	},
);
