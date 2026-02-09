import { ArrowLeft, ArrowRight, Home, RotateCw, X } from "lucide-react";
import { cn } from "~/utils/cn";
import { MenuBar } from "../../shared/ds/MenuBar";

interface InternetExplorerProps {
	children: React.ReactNode;
	url?: string;
}

const DEFAULT_URL = "https://www.linkedin.com/in/valentin-rameau-3a1404112";

export function InternetExplorerShell(props: InternetExplorerProps) {
	const url = props.url ?? DEFAULT_URL;
	return (
		<div className="@container flex h-full w-full select-none flex-col overflow-hidden bg-[#ece9d8] font-sans">
			<MenuBar />

			<Toolbar>
				<ToolbarButton hideLabelOnMobile icon={<ArrowLeft className="@sm:h-4 @sm:w-4" size={14} />} label="Back" />
				<ToolbarButton
					disabled
					hideLabelOnMobile
					icon={<ArrowRight className="@sm:h-4 @sm:w-4" size={14} />}
					label="Forward"
				/>
				<ToolbarDivider />
				<ToolbarButton disabled hideLabelOnMobile icon={<X className="@sm:h-4 @sm:w-4" size={14} />} label="Stop" />
				<ToolbarButton hideLabelOnMobile icon={<RotateCw className="@sm:h-4 @sm:w-4" size={14} />} label="Refresh" />
				<ToolbarButton hideLabelOnMobile icon={<Home className="@sm:h-4 @sm:w-4" size={14} />} label="Home" />
			</Toolbar>

			<AddressBar url={url} />

			<LinksBar />

			<div className="relative flex-1 overflow-hidden bg-white">{props.children}</div>

			<StatusBar />
		</div>
	);
}

function Toolbar(props: { children: React.ReactNode }) {
	return (
		<div className="flex items-center @sm:gap-1 gap-0.5 overflow-x-auto border-gray-400 border-b bg-[#ece9d8] px-1 py-1">
			{props.children}
		</div>
	);
}

function ToolbarDivider() {
	return <div className="@sm:mx-1 mx-0.5 @sm:h-6 h-5 w-px bg-gray-400" />;
}

function AddressBar(props: { url: string }) {
	return (
		<div className="flex @sm:items-center items-stretch @sm:gap-2 gap-1 border-gray-400 border-b bg-[#ece9d8] @sm:px-2 px-1 py-1">
			<span className="@sm:inline hidden whitespace-nowrap font-semibold text-black text-xs">Address</span>
			<div className="flex min-w-0 flex-1 items-center border border-gray-400 bg-white shadow-inner">
				{/* IE Logo Spinner Area */}
				<div className="flex @sm:h-6 h-5 @sm:w-6 w-5 shrink-0 items-center justify-center border-gray-300 border-r bg-[#ece9d8]">
					<div className="flex @sm:h-4 h-3 @sm:w-4 w-3 items-center justify-center rounded-sm bg-blue-600">
						<span className="font-bold @sm:text-[8px] text-[7px] text-white">e</span>
					</div>
				</div>
				<input
					className="flex-1 truncate bg-transparent @sm:px-2 px-1 py-0.5 @sm:text-xs text-[10px] text-black outline-none"
					readOnly
					type="text"
					value={props.url}
				/>
			</div>
			<div className="flex shrink-0 gap-1">
				<button
					className="whitespace-nowrap border border-gray-400 bg-[#ece9d8] @sm:px-3 px-2 py-0.5 font-semibold @sm:text-xs text-[10px] hover:bg-white active:bg-gray-200"
					type="button"
				>
					Go
				</button>
			</div>
		</div>
	);
}

function LinksBar() {
	return (
		<div className="@sm:flex hidden items-center gap-2 overflow-x-auto border-gray-400 border-b bg-[#ece9d8] px-2 py-0.5 text-xs">
			<span className="whitespace-nowrap font-semibold text-black">Links</span>
			<span className="cursor-pointer whitespace-nowrap text-blue-600 hover:underline">Customize Links</span>
			<span className="cursor-pointer whitespace-nowrap text-blue-600 hover:underline">Free Hotmail</span>
			<span className="cursor-pointer whitespace-nowrap text-blue-600 hover:underline">Windows</span>
		</div>
	);
}

function StatusBar() {
	return (
		<div className="flex items-center justify-between border-gray-400 border-t bg-[#ece9d8] @sm:px-2 px-1 py-0.5 @sm:text-xs text-[10px] text-black">
			<div className="flex items-center @sm:gap-2 gap-1">
				<span className="truncate">Done</span>
			</div>
			<div className="flex shrink-0 items-center @sm:gap-1 gap-0.5">
				<div className="flex @sm:h-4 h-3 @sm:w-4 w-3 items-center justify-center border border-gray-400 bg-white">
					<div className="@sm:h-2 h-1.5 @sm:w-2 w-1.5 bg-green-500"></div>
				</div>
				<span className="@sm:inline hidden">Internet</span>
			</div>
		</div>
	);
}

function ToolbarButton(props: {
	icon: React.ReactNode;
	label?: string;
	disabled?: boolean;
	onClick?: () => void;
	hideLabelOnMobile?: boolean;
}) {
	const disabled = props.disabled ?? false;
	const hideLabelOnMobile = props.hideLabelOnMobile ?? false;

	return (
		<button
			className={cn(
				"flex shrink-0 items-center @sm:gap-1 gap-0.5 rounded-sm border border-transparent @sm:px-2 px-1 @sm:py-1 py-0.5 @sm:text-xs text-[10px]",
				"hover:border-gray-400 hover:bg-white",
				disabled && "cursor-not-allowed opacity-50",
				!disabled && "active:border-gray-500 active:bg-gray-200",
			)}
			disabled={disabled}
			onClick={props.onClick}
			style={{
				boxShadow: !disabled ? "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)" : undefined,
			}}
			type="button"
		>
			<span className={disabled ? "text-gray-400" : "text-black"}>{props.icon}</span>
			{props.label && !hideLabelOnMobile && (
				<span className={cn("@sm:inline hidden", disabled ? "text-gray-400" : "text-black")}>{props.label}</span>
			)}
		</button>
	);
}
