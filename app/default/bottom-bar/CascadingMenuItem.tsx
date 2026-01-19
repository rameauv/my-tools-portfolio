import { Menu } from "@base-ui/react/menu";
import { Popover } from "@base-ui/react/popover";
import * as React from "react";
import type { MenuItem } from "./types";

interface CascadingMenuItemProps {
	item: MenuItem;
}

export function CascadingMenuItem({ item }: CascadingMenuItemProps) {
	const [open, setOpen] = React.useState(false);
	const hasChildren = item.children && item.children.length > 0;

	if (hasChildren) {
		return (
			<Popover.Root onOpenChange={setOpen} open={open}>
				<Popover.Trigger
					className="
            flex items-center justify-between w-full px-4 py-1.5
            text-sm text-gray-700 cursor-default
            hover:bg-[#2f71cd] hover:text-white
            group
          "
					onMouseEnter={() => setOpen(true)}
					onMouseLeave={() => setOpen(false)}
				>
					<div className="flex items-center gap-2">
						{item.icon && <span className="w-4 h-4">{item.icon}</span>}
						<span>{item.label}</span>
					</div>
					<span className="text-[10px] ml-4 group-hover:text-white">▶</span>
				</Popover.Trigger>
				<Popover.Portal>
					<Popover.Positioner
						align="start"
						side="right"
						sideOffset={2}
						style={{ zIndex: 100 }}
					>
						<Popover.Popup
							className="
                bg-white border border-gray-300 shadow-md py-1 min-w-[160px]
                animate-in fade-in zoom-in-95 duration-100
              "
							onMouseEnter={() => setOpen(true)}
							onMouseLeave={() => setOpen(false)}
						>
							<Menu.Root>
								{item.children?.map((child, index) => (
									<CascadingMenuItem item={child} key={index} />
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
			className="
        flex items-center gap-2 w-full px-4 py-1.5
        text-sm text-gray-700 cursor-default
        hover:bg-[#2f71cd] hover:text-white
        outline-none
      "
			onClick={item.onClick}
		>
			{item.icon && <span className="w-4 h-4">{item.icon}</span>}
			<span>{item.label}</span>
		</Menu.Item>
	);
}
