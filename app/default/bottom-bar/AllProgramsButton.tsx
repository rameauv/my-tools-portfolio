import { Menu } from "@base-ui/react/menu";
import { Popover } from "@base-ui/react/popover";
import React from "react";
import { CascadingMenuItem } from "./CascadingMenuItem";
import { menuItems } from "./menuData";

export const AllProgramsButton = React.memo(() => {
	return (
		<Popover.Root>
			<Popover.Trigger className="group mt-1 flex w-full cursor-pointer items-center justify-center gap-2 border-none px-2 py-2 outline-none transition-colors duration-75 hover:bg-[#2f71cd]">
				<span
					className="font-bold text-[#00136b] text-[11px] group-hover:text-white"
					style={{ fontFamily: "Tahoma, sans-serif" }}
				>
					All Programs
				</span>
				<div className="flex h-[16px] w-[16px] items-center justify-center rounded-[2px] bg-[#3c9a38] shadow-[1px_1px_1px_rgba(0,0,0,0.3)]">
					<svg fill="none" height="8" viewBox="0 0 8 8" width="8" xmlns="http://www.w3.org/2000/svg">
						<title>All Programs</title>
						<path d="M2 1L6 4L2 7" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
					</svg>
				</div>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner align="end" side="right" style={{ zIndex: 201 }}>
					<Popover.Popup className="fade-in zoom-in-95 min-w-[200px] animate-in border border-gray-300 bg-white py-1 shadow-lg duration-100">
						<Menu.Root>
							{menuItems.map((item) => (
								<CascadingMenuItem item={item} key={item.id} />
							))}
						</Menu.Root>
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
});
