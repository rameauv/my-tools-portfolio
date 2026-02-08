import * as React from "react";
import type { DesktopItemData } from "./DesktopItemData";

export const DesktopItemIcon = React.memo(function DesktopItemIcon(props: { item: DesktopItemData }) {
	return <img alt={props.item.title} className="h-8 w-8" draggable="false" src={props.item.icon} />;
});
