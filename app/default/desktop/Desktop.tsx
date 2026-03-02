import { useDebouncedCallback } from "@tanstack/react-pacer";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { DESKTOP_ITEMS } from "./DESKTOP_ITEMS";
import type { DesktopItem } from "./DesktopItem";
import { DesktopItemComponent } from "./DesktopItemComponent";
import type { DesktopItemData } from "./DesktopItemData";
import { getWallpaperSrcSet, wallpapers } from "./wallpapers";

const WINDOWS_RESIZE_DEBOUNCE_CONFIG = {
	wait: 500,
	trailing: true,
};

export const Desktop = React.memo(function Desktop(props: { onOpenItem: (item: DesktopItemData) => void }) {
	const [desktopItems, setDesktopItems] = useState<DesktopItem[]>(DESKTOP_ITEMS);
	const desktopRef = useRef<HTMLUListElement | null>(null);
	const previousSizeRef = useRef<{ width: number; height: number } | null>(null);

	function updateItemPosition(id: number, x: number, y: number) {
		setDesktopItems((items) => items.map((item) => (item.data.id === id ? { ...item, x, y } : item)));
	}

	const debouncedWindowsResizeHandler = useDebouncedCallback((entries: ResizeObserverEntry[]) => {
		const entry = entries[0];
		if (!entry) return;

		const width = entry.contentRect.width;
		const height = entry.contentRect.height;
		const previousSize = previousSizeRef.current;

		if (!previousSize || previousSize.width <= 0 || previousSize.height <= 0) {
			previousSizeRef.current = { width, height };
			return;
		}

		if (width === previousSize.width && height === previousSize.height) {
			return;
		}

		const ratioX = width / previousSize.width;
		const ratioY = height / previousSize.height;
		previousSizeRef.current = { width, height };

		setDesktopItems((items) =>
			items.map((item) => ({
				...item,
				x: item.x * ratioX,
				y: item.y * ratioY,
			})),
		);
	}, WINDOWS_RESIZE_DEBOUNCE_CONFIG);

	useEffect(() => {
		const desktopElement = desktopRef.current;
		if (!desktopElement) return;

		const resizeObserver = new ResizeObserver((entries) => {
			debouncedWindowsResizeHandler(entries);
		});

		resizeObserver.observe(desktopElement);
		return () => {
			resizeObserver.disconnect();
		};
	}, [debouncedWindowsResizeHandler]);

	return (
		<ul
			className="relative grid h-full w-full auto-cols-[80px] grid-flow-col grid-rows-[repeat(auto-fill,minmax(100px,100px))] content-start items-start justify-start gap-4 p-2"
			ref={desktopRef}
		>
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
