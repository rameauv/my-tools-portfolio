import { ArrowLeft, ArrowRight, Home, RotateCw, X } from "lucide-react";
import { cn } from "~/utils/cn";
import { MenuBar } from "../../shared/MenuBar";

interface InternetExplorerProps {
	children: React.ReactNode;
	url?: string;
}

export function InternetExplorer({
	children,
	url = "https://www.linkedin.com/in/valentin-rameau-3a1404112",
}: InternetExplorerProps) {
	return (
		<div className="@container w-full h-full flex flex-col bg-[#ece9d8] font-sans select-none overflow-hidden">
			{/* Menu Bar */}
			<MenuBar />

			{/* Toolbar */}
			<div className="bg-[#ece9d8] border-b border-gray-400 px-1 py-1 flex items-center gap-0.5 @sm:gap-1 overflow-x-auto">
				<ToolbarButton
					hideLabelOnMobile
					icon={<ArrowLeft className="@sm:w-4 @sm:h-4" size={14} />}
					label="Back"
				/>
				<ToolbarButton
					disabled
					hideLabelOnMobile
					icon={<ArrowRight className="@sm:w-4 @sm:h-4" size={14} />}
					label="Forward"
				/>
				<div className="w-px h-5 @sm:h-6 bg-gray-400 mx-0.5 @sm:mx-1" />
				<ToolbarButton
					disabled
					hideLabelOnMobile
					icon={<X className="@sm:w-4 @sm:h-4" size={14} />}
					label="Stop"
				/>
				<ToolbarButton
					hideLabelOnMobile
					icon={<RotateCw className="@sm:w-4 @sm:h-4" size={14} />}
					label="Refresh"
				/>
				<ToolbarButton
					hideLabelOnMobile
					icon={<Home className="@sm:w-4 @sm:h-4" size={14} />}
					label="Home"
				/>
				{/* <div className="w-px h-5 @sm:h-6 bg-gray-400 mx-0.5 @sm:mx-1" />
				<ToolbarButton
					hideLabelOnMobile
					icon={<Search className="@sm:w-4 @sm:h-4" size={14} />}
					label="Search"
				/> */}
				{/* <ToolbarButton
					hideLabelOnMobile
					icon={<ChevronDown className="@sm:w-4 @sm:h-4" size={14} />}
				/> */}
			</div>

			{/* Address Bar */}
			<div className="bg-[#ece9d8] border-b border-gray-400 px-1 @sm:px-2 py-1 flex items-stretch @sm:items-center gap-1 @sm:gap-2">
				<span className="hidden @sm:inline text-xs text-black font-semibold whitespace-nowrap">
					Address
				</span>
				<div className="flex-1 flex items-center bg-white border border-gray-400 shadow-inner min-w-0">
					{/* IE Logo Spinner Area */}
					<div className="w-5 h-5 @sm:w-6 @sm:h-6 flex items-center justify-center border-r border-gray-300 bg-[#ece9d8] shrink-0">
						<div className="w-3 h-3 @sm:w-4 @sm:h-4 bg-blue-600 rounded-sm flex items-center justify-center">
							<span className="text-white text-[7px] @sm:text-[8px] font-bold">
								e
							</span>
						</div>
					</div>
					<input
						className="flex-1 px-1 @sm:px-2 py-0.5 text-[10px] @sm:text-xs text-black bg-transparent outline-none truncate"
						readOnly
						type="text"
						value={url}
					/>
				</div>
				<div className="flex gap-1 shrink-0">
					<button
						className="px-2 @sm:px-3 py-0.5 bg-[#ece9d8] border border-gray-400 text-[10px] @sm:text-xs font-semibold hover:bg-white active:bg-gray-200 whitespace-nowrap"
						type="button"
					>
						Go
					</button>
					{/* <button
						className="px-1.5 @sm:px-2 py-0.5 bg-[#ece9d8] border border-gray-400 text-[10px] @sm:text-xs hover:bg-white active:bg-gray-200 whitespace-nowrap"
						type="button"
					>
						Links
					</button> */}
				</div>
			</div>

			{/* Links Bar (Optional - can be collapsed) */}
			<div className="hidden @sm:flex bg-[#ece9d8] border-b border-gray-400 px-2 py-0.5 items-center gap-2 text-xs overflow-x-auto">
				<span className="text-black font-semibold whitespace-nowrap">
					Links
				</span>
				<span className="text-blue-600 hover:underline cursor-pointer whitespace-nowrap">
					Customize Links
				</span>
				<span className="text-blue-600 hover:underline cursor-pointer whitespace-nowrap">
					Free Hotmail
				</span>
				<span className="text-blue-600 hover:underline cursor-pointer whitespace-nowrap">
					Windows
				</span>
			</div>

			{/* Content Area (where Cyworld will render) */}
			<div className="flex-1 overflow-hidden bg-white relative">{children}</div>

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
			className={cn(
				"px-1 @sm:px-2 py-0.5 @sm:py-1 flex items-center gap-0.5 @sm:gap-1 text-[10px] @sm:text-xs border border-transparent rounded-sm shrink-0",
				"hover:border-gray-400 hover:bg-white",
				disabled && "opacity-50 cursor-not-allowed",
				!disabled && "active:bg-gray-200 active:border-gray-500",
			)}
			disabled={disabled}
			onClick={onClick}
			style={{
				boxShadow: !disabled
					? "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)"
					: undefined,
			}}
			type="button"
		>
			<span className={disabled ? "text-gray-400" : "text-black"}>{icon}</span>
			{label && !hideLabelOnMobile && (
				<span
					className={cn(
						"hidden @sm:inline",
						disabled ? "text-gray-400" : "text-black",
					)}
				>
					{label}
				</span>
			)}
		</button>
	);
}
