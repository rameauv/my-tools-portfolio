import * as React from "react";
import { ArrowLeft, ArrowRight, X, RotateCw, Home, Search, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { MenuBar } from "../shared/MenuBar";

interface InternetExplorerProps {
  children: React.ReactNode;
  url?: string;
}

export function InternetExplorer({ children, url = "http://cyworld.com/valentin" }: InternetExplorerProps) {
  return (
    <div className="@container w-full h-full flex flex-col bg-[#ece9d8] font-sans select-none overflow-hidden">
      {/* Menu Bar */}
      <MenuBar />

      {/* Toolbar */}
      <div className="bg-[#ece9d8] border-b border-gray-400 px-1 py-1 flex items-center gap-0.5 @sm:gap-1 overflow-x-auto">
        <ToolbarButton icon={<ArrowLeft size={14} className="@sm:w-4 @sm:h-4" />} label="Back" hideLabelOnMobile />
        <ToolbarButton icon={<ArrowRight size={14} className="@sm:w-4 @sm:h-4" />} label="Forward" disabled hideLabelOnMobile />
        <div className="w-px h-5 @sm:h-6 bg-gray-400 mx-0.5 @sm:mx-1" />
        <ToolbarButton icon={<X size={14} className="@sm:w-4 @sm:h-4" />} label="Stop" disabled hideLabelOnMobile />
        <ToolbarButton icon={<RotateCw size={14} className="@sm:w-4 @sm:h-4" />} label="Refresh" hideLabelOnMobile />
        <ToolbarButton icon={<Home size={14} className="@sm:w-4 @sm:h-4" />} label="Home" hideLabelOnMobile />
        <div className="w-px h-5 @sm:h-6 bg-gray-400 mx-0.5 @sm:mx-1" />
        <ToolbarButton icon={<Search size={14} className="@sm:w-4 @sm:h-4" />} label="Search" hideLabelOnMobile />
        <ToolbarButton icon={<ChevronDown size={14} className="@sm:w-4 @sm:h-4" />} hideLabelOnMobile />
        <div className="w-px h-5 @sm:h-6 bg-gray-400 mx-0.5 @sm:mx-1" />
        <ToolbarButton icon={<ChevronDown size={14} className="@sm:w-4 @sm:h-4" />} hideLabelOnMobile />
      </div>

      {/* Address Bar */}
      <div className="bg-[#ece9d8] border-b border-gray-400 px-1 @sm:px-2 py-1 flex flex-col @sm:flex-row items-stretch @sm:items-center gap-1 @sm:gap-2">
        <span className="hidden @sm:inline text-xs text-black font-semibold whitespace-nowrap">Address</span>
        <div className="flex-1 flex items-center bg-white border border-gray-400 shadow-inner min-w-0">
          {/* IE Logo Spinner Area */}
          <div className="w-5 h-5 @sm:w-6 @sm:h-6 flex items-center justify-center border-r border-gray-300 bg-[#ece9d8] shrink-0">
            <div className="w-3 h-3 @sm:w-4 @sm:h-4 bg-blue-600 rounded-sm flex items-center justify-center">
              <span className="text-white text-[7px] @sm:text-[8px] font-bold">e</span>
            </div>
          </div>
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 px-1 @sm:px-2 py-0.5 text-[10px] @sm:text-xs text-black bg-transparent outline-none truncate"
          />
        </div>
        <div className="flex gap-1 shrink-0">
          <button className="px-2 @sm:px-3 py-0.5 bg-[#ece9d8] border border-gray-400 text-[10px] @sm:text-xs font-semibold hover:bg-white active:bg-gray-200 whitespace-nowrap">
            Go
          </button>
          <button className="px-1.5 @sm:px-2 py-0.5 bg-[#ece9d8] border border-gray-400 text-[10px] @sm:text-xs hover:bg-white active:bg-gray-200 whitespace-nowrap">
            Links
          </button>
        </div>
      </div>

      {/* Links Bar (Optional - can be collapsed) */}
      <div className="hidden @sm:flex bg-[#ece9d8] border-b border-gray-400 px-2 py-0.5 items-center gap-2 text-xs overflow-x-auto">
        <span className="text-black font-semibold whitespace-nowrap">Links</span>
        <span className="text-blue-600 hover:underline cursor-pointer whitespace-nowrap">Customize Links</span>
        <span className="text-blue-600 hover:underline cursor-pointer whitespace-nowrap">Free Hotmail</span>
        <span className="text-blue-600 hover:underline cursor-pointer whitespace-nowrap">Windows</span>
      </div>

      {/* Content Area (where Cyworld will render) */}
      <div className="flex-1 overflow-hidden bg-white relative">
        {children}
      </div>

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-gray-400 px-1 @sm:px-2 py-0.5 flex items-center justify-between text-[10px] @sm:text-xs text-black">
        <div className="flex items-center gap-1 @sm:gap-2">
          <span className="truncate">Done</span>
        </div>
        <div className="flex items-center gap-0.5 @sm:gap-1 shrink-0">
          <div className="w-3 h-3 @sm:w-4 @sm:h-4 border border-gray-400 bg-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 @sm:w-2 @sm:h-2 bg-green-500"></div>
          </div>
          <span className="hidden @sm:inline">Internet</span>
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  icon,
  label,
  disabled = false,
  onClick,
  hideLabelOnMobile = false,
}: {
  icon: React.ReactNode;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
  hideLabelOnMobile?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "px-1 @sm:px-2 py-0.5 @sm:py-1 flex items-center gap-0.5 @sm:gap-1 text-[10px] @sm:text-xs border border-transparent rounded-sm shrink-0",
        "hover:border-gray-400 hover:bg-white",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "active:bg-gray-200 active:border-gray-500"
      )}
      style={{
        boxShadow: !disabled ? "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)" : undefined,
      }}
    >
      <span className={disabled ? "text-gray-400" : "text-black"}>{icon}</span>
      {label && !hideLabelOnMobile && (
        <span className={clsx("hidden @sm:inline", disabled ? "text-gray-400" : "text-black")}>{label}</span>
      )}
    </button>
  );
}
