import * as React from "react";
import { Popover } from "@base-ui/react/popover";
import { Menu } from "@base-ui/react/menu";
import { CascadingMenuItem } from "./CascadingMenuItem";
import { menuItems } from "./menuData";

export default function AllProgramsButton() {
  return (
    <Popover.Root>
      <Popover.Trigger
        className="
          group
          flex items-center justify-center gap-2
          w-full py-1 px-4
          cursor-pointer
          transition-colors duration-75
          hover:bg-[#2f71cd]
          border-none outline-none
        "
      >
        <span
          className="
            text-[#00136b] font-bold text-[20px]
            group-hover:text-white
          "
          style={{ fontFamily: 'Tahoma, sans-serif' }}
        >
          All Programs
        </span>
        <div
          className="
            flex items-center justify-center
            bg-[#3c9a38] rounded-sm
            w-[20px] h-[20px]
            shadow-[1px_1px_1px_rgba(0,0,0,0.3)]
          "
        >
          <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 1L6 4L2 7"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round" />
          </svg>
        </div>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="right" align="end" style={{ zIndex: 100 }}>
          <Popover.Popup
            className="
              bg-white border border-gray-300 shadow-lg py-1 min-w-[200px]
              animate-in fade-in zoom-in-95 duration-100
            "
          >
            <Menu.Root>
              {menuItems.map((item, index) => (
                <CascadingMenuItem key={index} item={item} />
              ))}
            </Menu.Root>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
