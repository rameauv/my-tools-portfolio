import * as React from "react";
import { useState } from "react";
import { DESKTOP_ITEMS } from "./DESKTOP_ITEMS";
import type { DesktopItem } from "./DesktopItem";
import { DesktopItemComponent } from "./DesktopItemComponent";
import type { DesktopItemData } from "./DesktopItemData";

export const Desktop = React.memo(function Desktop(props: {
	onOpenItem: (item: DesktopItemData) => void;
}) {
	const [desktopItems, setDesktopItems] =
		useState<DesktopItem[]>(DESKTOP_ITEMS);

	const updateItemPosition = React.useEffectEvent(
		(id: number, x: number, y: number) => {
			setDesktopItems((items) =>
				items.map((item) => (item.data.id === id ? { ...item, x, y } : item)),
			);
		},
	);

	return (
		<ul
			className="w-full h-full flex flex-col items-start gap-4"
			style={{
				background: 'url("/wallpaper.jpg") center/cover no-repeat',
			}}
		>
			{desktopItems.map((item) => (
				<DesktopItemComponent
					item={item}
					key={`desktop-item-${item.data.id}`}
					onOpenItem={props.onOpenItem}
					onUpdatePosition={(x, y) => updateItemPosition(item.data.id, x, y)}
				/>
			))}
		</ul>
	);
});
