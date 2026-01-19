import type * as React from "react";
import AllProgramsButton from "./AllProgramsButton";

let id = 0;

const MainLeftSectionShortcutsItems = [
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/icons/windows-xp-icons/19.ico" />,
		title: "Internet Explorer",
		subtitle: "Internet Explorer",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/icons/windows-xp-icons/19.ico" />,
		title: "Outlook Express",
		subtitle: "Outlook Express",
	},
] as const;

const MainLeftSectionItems = [
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/calculator.png" />,
		title: "Calculator",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/calculator.png" />,
		title: "Notepad",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/icons/windows-xp-icons/19.ico" />,
		title: "Windows Media Player",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/icons/windows-xp-icons/19.ico" />,
		title: "Windows Movie Maker",
	},
] as const;

const MainRightSectionTopItems = [
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/my-documents.png" />,
		title: "My Documents",
		bold: true,
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/icons/windows-xp-icons/19.ico" />,
		title: "My Recent Documents",
		bold: true,
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/my-documents.png" />,
		title: "My Pictures",
		bold: true,
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/my-documents.png" />,
		title: "My Music",
		bold: true,
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/my-documents.png" />,
		title: "My Computer",
		bold: true,
	},
] as const;

const MainRightSectionMiddleItems = [
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/icons/windows-xp-icons/19.ico" />,
		title: "Control Panel",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/icons/windows-xp-icons/19.ico" />,
		title: "Set Program Access and Defaults",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/icons/windows-xp-icons/19.ico" />,
		title: "Connect To",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/icons/windows-xp-icons/19.ico" />,
		title: "Printers and Faxes",
	},
] as const;

const MainRightSectionBottomItems = [
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/icons/windows-xp-icons/19.ico" />,
		title: "Help and Support",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/icons/windows-xp-icons/19.ico" />,
		title: "Search",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/icons/windows-xp-icons/19.ico" />,
		title: "Run...",
	},
] as const;

export function StartMenu() {
	return (
		<div
			className="flex flex-col w-[380px] overflow-hidden rounded-t-[8px] shadow-[2px_2px_20px_rgba(0,0,0,0.4)] border-[#003399] border-t border-x"
			style={{ fontFamily: "Tahoma, sans-serif" }}
		>
			<StartMenuHeader />
			<StartMenuMain />
			<StartMenuFooter />
		</div>
	);
}

function StartMenuHeader() {
	return (
		<div className="flex items-center gap-3 bg-linear-to-b from-[#1c5ab5] via-[#2c72da] to-[#1c5ab5] py-2 px-3 border-b border-[#003399] relative">
			{/* Glossy top highlight */}
			<div className="absolute top-0 left-0 right-0 h-px bg-white/30" />
			<StartMenuAccountAvatar />
			<p className="flex-1 text-white font-bold text-[14px] drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
				John Doe
			</p>
		</div>
	);
}

function StartMenuMain() {
	return (
		<div className="flex bg-white border-x-[3px] border-[#428eff] relative">
			<div className="w-[190px] flex flex-col">
				<MainLeftSection />
			</div>
			{/* Vertical orange line that XP has between columns */}
			<div className="w-px bg-[#91b5df] self-stretch" />
			<div className="w-[183px] flex flex-col">
				<MainRightSection />
			</div>
		</div>
	);
}

function MainLeftSectionSeparator() {
	return (
		<div className="px-2 py-1">
			<div className="h-px bg-linear-to-r from-transparent via-gray-200 to-transparent w-full" />
		</div>
	);
}

function MainRightSectionSeparator() {
	return (
		<div className="mx-2 my-1">
			<div className="h-px bg-[#91b5df] shadow-[0_1px_0_rgba(255,255,255,0.4)]" />
		</div>
	);
}

function MainLeftSectionItem(props: {
	icon: React.ReactNode;
	title: string;
	subtitle?: string;
}) {
	return (
		<div className="group flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-[#2f71cd] hover:text-white transition-colors">
			<div className="w-8 h-8 shrink-0 group-hover:brightness-110">
				{props.icon}
			</div>
			<div className="flex flex-col min-w-0">
				<span className="text-[11px] font-bold truncate group-hover:text-white text-[#333]">
					{props.title}
				</span>
				{props.subtitle && (
					<span className="text-[10px] truncate group-hover:text-white/80 text-gray-500">
						{props.subtitle}
					</span>
				)}
			</div>
		</div>
	);
}

function MainRightSectionItem(props: {
	icon: React.ReactNode;
	title: string;
	bold?: boolean;
}) {
	return (
		<div className="group flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-[#2f71cd] hover:text-white transition-colors">
			<div className="w-6 h-6 shrink-0 group-hover:brightness-110">
				{props.icon}
			</div>
			<span
				className={`text-[11px] truncate group-hover:text-white text-[#00136b] ${props.bold ? "font-bold" : ""}`}
			>
				{props.title}
			</span>
		</div>
	);
}

function MainSectionItemImgIcon(props: { src: string }) {
	return (
		<img alt="Icon" className="w-full h-full object-contain" src={props.src} />
	);
}

function MainLeftSection() {
	return (
		<div className="flex flex-col bg-white h-full">
			<div className="py-1">
				{MainLeftSectionShortcutsItems.map((item) => (
					<MainLeftSectionItem key={item.id} {...item} />
				))}
			</div>
			<MainLeftSectionSeparator />
			<div className="py-1 flex-1">
				{MainLeftSectionItems.map((item) => (
					<MainLeftSectionItem key={item.id} {...item} />
				))}
			</div>
			<div className="mt-auto pt-1 border-t border-gray-100 bg-white">
				<AllProgramsButton />
			</div>
		</div>
	);
}

function MainRightSection() {
	return (
		<div className="flex flex-col bg-[#d3e5fa] h-full py-1">
			{MainRightSectionTopItems.map((item) => (
				<MainRightSectionItem key={item.id} {...item} />
			))}
			<MainRightSectionSeparator />
			{MainRightSectionMiddleItems.map((item) => (
				<MainRightSectionItem key={item.id} {...item} />
			))}
			<MainRightSectionSeparator />
			{MainRightSectionBottomItems.map((item) => (
				<MainRightSectionItem key={item.id} {...item} />
			))}
		</div>
	);
}

function StartMenuFooter() {
	return (
		<div className="flex items-center justify-end gap-6 bg-linear-to-b from-[#1c5ab5] via-[#2c72da] to-[#1c5ab5] py-2 px-4 border-t border-[#003399] relative">
			{/* Glossy top highlight for footer */}
			<div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
			<StartMenuFooterButton icon="/logoff.png" label="Log Off" />
			<StartMenuFooterButton icon="/shutdown.png" label="Turn Off Computer" />
		</div>
	);
}

function StartMenuFooterButton(props: { icon: string; label: string }) {
	return (
		<button
			className="group flex items-center gap-2 cursor-pointer border-none bg-transparent hover:brightness-110 active:brightness-90 transition-all outline-none"
			type="button"
		>
			<div className="w-7 h-7 rounded-md overflow-hidden border border-white/30 shadow-sm flex items-center justify-center bg-white/10">
				<img
					alt={props.label}
					className="w-5 h-5 object-contain"
					src={props.icon}
				/>
			</div>
			<span className="text-white text-[12px] font-medium group-hover:underline drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">
				{props.label}
			</span>
		</button>
	);
}

function StartMenuAccountAvatar() {
	return (
		<div className="w-12 h-12 rounded-[4px] border-2 border-white/90 shadow-[2px_2px_4px_rgba(0,0,0,0.6)] overflow-hidden relative">
			<img
				alt="Account Avatar"
				className="w-full h-full object-cover"
				src="https://github.com/shadcn.png"
			/>
			{/* Subtle inner shadow for depth */}
			<div className="absolute inset-0 shadow-[inset_0_0_4px_rgba(0,0,0,0.2)] pointer-events-none" />
		</div>
	);
}
