import { useDebouncedCallback } from "@tanstack/react-pacer";
import { useCallback, useEffect, useState } from "react";
import type { DesktopItem } from "./DesktopItem";
import { DesktopItemContent } from "./DesktopItemContent";
import type { DesktopItemData } from "./DesktopItemData";
import { useDesktopItemDrag } from "./useDesktopItemDrag";

const UPDATE_POSITION_DEBOUNCE_CONFIG = {
	wait: 100,
	trailing: true,
};

export function DesktopItemComponent(props: {
	item: DesktopItem;
	onOpenItem: (item: DesktopItemData) => void;
	onUpdatePosition: (x: number, y: number) => void;
}) {
	const [position, setPosition] = useState({ x: props.item.x, y: props.item.y });

	const debouncedUpdatePosition = useDebouncedCallback((x: number, y: number) => {
		props.onUpdatePosition(x, y);
	}, UPDATE_POSITION_DEBOUNCE_CONFIG);

	const onUpdatePosition = useCallback(
		(x: number, y: number) => {
			setPosition({ x, y });
			debouncedUpdatePosition(x, y);
		},
		[debouncedUpdatePosition],
	);

	const desktopItemDrag = useDesktopItemDrag({
		x: position.x,
		y: position.y,
		onUpdatePosition: onUpdatePosition,
		onClick: () => props.onOpenItem(props.item.data),
	});

	useEffect(() => {
		setPosition({ x: props.item.x, y: props.item.y });
	}, [props.item.x, props.item.y]);

	return (
		<li
			className="relative select-none"
			onMouseDown={desktopItemDrag.onMouseDown}
			style={{
				transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
			}}
		>
			<DesktopItemContent isDragging={desktopItemDrag.isDragging} item={props.item.data} />
		</li>
	);
}
