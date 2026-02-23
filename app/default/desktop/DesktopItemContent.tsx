import * as React from "react";
import type { DesktopItemData } from "./DesktopItemData";
import { DesktopItemIcon } from "./DesktopItemIcon";

export const DesktopItemContent = React.memo(function DesktopItemContent(props: {
	item: DesktopItemData;
	isDragging: boolean;
}) {
	return (
		<div className="flex w-20 flex-col items-center gap-2 hover:cursor-pointer">
			<DesktopItemIcon item={props.item} />
			<p className="wrap-break-word m-0 line-clamp-2 w-full min-w-0 text-center text-sm text-white leading-tight [text-shadow:1px_1px_3px_rgba(0,0,0,0.9)]">
				{props.item.title}
			</p>
		</div>
	);
});
