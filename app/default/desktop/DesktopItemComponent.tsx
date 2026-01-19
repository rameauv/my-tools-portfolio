import type { DesktopItem } from "./DesktopItem";
import { DesktopItemContent } from "./DesktopItemContent";
import type { DesktopItemData } from "./DesktopItemData";
import { useDesktopItemDrag } from "./useDesktopItemDrag";

export function DesktopItemComponent(props: {
	item: DesktopItem;
	onOpenItem: (item: DesktopItemData) => void;
	onUpdatePosition: (x: number, y: number) => void;
}) {
	const { onMouseDown, isDragging } = useDesktopItemDrag({
		x: props.item.x,
		y: props.item.y,
		onUpdatePosition: props.onUpdatePosition,
	});

	return (
		<li
			className="absolute left-0 top-0 select-none"
			onMouseDown={onMouseDown}
			onDoubleClick={() => props.onOpenItem(props.item.data)}
			style={{
				transform: `translate3d(${props.item.x}px, ${props.item.y}px, 0)`,
			}}
		>
			<DesktopItemContent isDragging={isDragging} item={props.item.data} />
		</li>
	);
}
