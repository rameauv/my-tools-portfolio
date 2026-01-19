import { Menu } from "@base-ui/react/menu";
import { Popover } from "@base-ui/react/popover";
import { CascadingMenuItem } from "./CascadingMenuItem";
import { menuItems } from "./menuData";

export default function AllProgramsButton() {
	return (
		<Popover.Root>
			<Popover.Trigger
				className="
          group
          flex items-center justify-center gap-2
          w-full py-2 px-2
          cursor-pointer
          transition-colors duration-75
          hover:bg-[#2f71cd]
          border-none outline-none
          mt-1
        "
			>
				<span
					className="
            text-[#00136b] font-bold text-[11px]
            group-hover:text-white
          "
					style={{ fontFamily: "Tahoma, sans-serif" }}
				>
					All Programs
				</span>
				<div
					className="
            flex items-center justify-center
            bg-[#3c9a38] rounded-[2px]
            w-[16px] h-[16px]
            shadow-[1px_1px_1px_rgba(0,0,0,0.3)]
          "
				>
					<svg
						fill="none"
						height="8"
						viewBox="0 0 8 8"
						width="8"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>All Programs</title>
						<path
							d="M2 1L6 4L2 7"
							stroke="white"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
						/>
					</svg>
				</div>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner align="end" side="right" style={{ zIndex: 100 }}>
					<Popover.Popup
						className="
              bg-white border border-gray-300 shadow-lg py-1 min-w-[200px]
              animate-in fade-in zoom-in-95 duration-100
            "
					>
						<Menu.Root>
							{menuItems.map((item, index) => (
								<CascadingMenuItem item={item} key={index} />
							))}
						</Menu.Root>
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	);
}
