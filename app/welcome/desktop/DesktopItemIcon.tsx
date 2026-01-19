import * as React from "react";
import type { DesktopItemData } from "./DesktopItemData";


export const DesktopItemIcon = React.memo(function DesktopItemIcon(props: {
	item: DesktopItemData;
}) {
	console.log("render DesktopItemIcon");
	return (
		<img
			alt={props.item.title}
			className="w-8 h-8"
			draggable="false"
			src={props.item.icon}
		/>
	);
});
