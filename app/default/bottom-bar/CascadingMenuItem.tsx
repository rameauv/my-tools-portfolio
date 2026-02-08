import { Menu } from "@base-ui/react/menu";
import { Popover } from "@base-ui/react/popover";
import * as React from "react";
import type { MenuItem } from "./types";

interface CascadingMenuItemProps {
	item: MenuItem;
}

export function CascadingMenuItem(props: CascadingMenuItemProps) {
	const [open, setOpen] = React.useState(false);
	const hasChildren = props.item.children && props.item.children.length > 0;

	if (hasChildren) {
		return (
			<Popover.Root onOpenChange={setOpen} open={open}>
				<Popover.Trigger
					className="group flex w-full cursor-default items-center justify-between px-4 py-1.5 text-gray-700 text-sm hover:bg-[#2f71cd] hover:text-white"
					onMouseEnter={() => setOpen(true)}
					onMouseLeave={() => setOpen(false)}
				>
					<div className="flex items-center gap-2">
						{props.item.icon && <span className="h-4 w-4">{props.item.icon}</span>}
						<span>{props.item.label}</span>
					</div>
					<span className="ml-4 text-[10px] group-hover:text-white">▶</span>
				</Popover.Trigger>
				<Popover.Portal>
					<Popover.Positioner align="start" side="right" sideOffset={2} style={{ zIndex: 100 }}>
						<Popover.Popup
							className="fade-in zoom-in-95 min-w-[160px] animate-in border border-gray-300 bg-white py-1 shadow-md duration-100"
							onMouseEnter={() => setOpen(true)}
							onMouseLeave={() => setOpen(false)}
						>
							<Menu.Root>
								{props.item.children?.map((child) => (
									<CascadingMenuItem item={child} key={child.id} />
								))}
							</Menu.Root>
						</Popover.Popup>
					</Popover.Positioner>
				</Popover.Portal>
			</Popover.Root>
		);
	}

	return (
		<Menu.Item
			className="flex w-full cursor-default items-center gap-2 px-4 py-1.5 text-gray-700 text-sm outline-none hover:bg-[#2f71cd] hover:text-white"
			onClick={props.item.onClick}
		>
			{props.item.icon && <span className="h-4 w-4">{props.item.icon}</span>}
			<span>{props.item.label}</span>
		</Menu.Item>
	);
}
