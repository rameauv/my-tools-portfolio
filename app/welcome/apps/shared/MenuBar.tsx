import * as React from "react";

interface MenuBarItem {
  label: string;
  hideOnMobile?: boolean;
}

interface MenuBarProps {
  items?: MenuBarItem[];
  className?: string;
  itemClassName?: string;
}

const DEFAULT_MENU_ITEMS: MenuBarItem[] = [
  { label: "File" },
  { label: "Edit" },
  { label: "View" },
  { label: "Favorites", hideOnMobile: true },
  { label: "Tools" },
  { label: "Help", hideOnMobile: true },
];

export function MenuBar({ 
  items = DEFAULT_MENU_ITEMS, 
  className = "bg-[#ece9d8] border-b border-gray-400 px-2 py-0.5 flex items-center gap-2 sm:gap-4 text-xs text-black overflow-x-auto",
  itemClassName = "border border-[#ece9d8] hover:bg-white hover:border-gray-300 px-1 cursor-pointer whitespace-nowrap"
}: MenuBarProps) {
  return (
    <div className={className}>
      {items.map((item) => (
        <span
          key={item.label}
          className={item.hideOnMobile ? `hidden sm:inline ${itemClassName}` : itemClassName}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}
