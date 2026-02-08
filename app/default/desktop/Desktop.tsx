import * as React from "react";
import { useState } from "react";
import { DESKTOP_ITEMS } from "./DESKTOP_ITEMS";
import type { DesktopItem } from "./DesktopItem";
import { DesktopItemComponent } from "./DesktopItemComponent";
import type { DesktopItemData } from "./DesktopItemData";
import { getWallpaperSrcSet, wallpapers } from "./wallpapers";

export const Desktop = React.memo(function Desktop(props: { onOpenItem: (item: DesktopItemData) => void }) {
	const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(DESKTOP_ITEMS);

	const updateItemPosition = React.useEffectEvent((id: number, x: number, y: number) => {
		setDesktopItems((items) => items.map((item) => (item.data.id === id ? { ...item, x, y } : item)));
	});

	return (
		<ul className="relative flex h-full w-full flex-col items-start gap-4">
			<img
				alt="Desktop wallpaper"
				className="fixed inset-0 -z-10 h-full w-full object-cover"
				sizes="100vw"
				src={wallpapers.bliss.fallback}
				srcSet={getWallpaperSrcSet(wallpapers.bliss)}
			/>
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
