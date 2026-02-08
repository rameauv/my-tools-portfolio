import type * as React from "react";
import { AllProgramsButton } from "./AllProgramsButton";

let id = 0;

const MainLeftSectionShortcutsItems = [
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/shell32/1484-internet-explorer-48.ico" />,
		title: "Internet Explorer",
		subtitle: "Internet Explorer",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/other/outlook-express-xp-icon.webp" />,
		title: "Outlook Express",
		subtitle: "Outlook Express",
	},
] as const;

const MainLeftSectionItems = [
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/other/calculator.webp" />,
		title: "Calculator",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/other/notepad.webp" />,
		title: "Notepad",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/other/windows-media-player.webp" />,
		title: "Windows Media Player",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/other/windows-movie-maker.webp" />,
		title: "Windows Movie Maker",
	},
] as const;

const MainRightSectionTopItems = [
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/shell32/796-my-documents-48.ico" />,
		title: "My Documents",
		bold: true,
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/shell32/170-my-recent-document-48.ico" />,
		title: "My Recent Documents",
		bold: true,
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/shell32/808-my-pictures-48.ico" />,
		title: "My Pictures",
		bold: true,
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/shell32/820-my-musics-48.ico" />,
		title: "My Music",
		bold: true,
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/shell32/123-my-computer-48.ico" />,
		title: "My Computer",
		bold: true,
	},
] as const;

const MainRightSectionMiddleItems = [
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/shell32/1125-control-panel-48.ico" />,
		title: "Control Panel",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/other/set-program-access-and-defaults.webp" />,
		title: "Set Program Access and Defaults",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/shell32/142-connect-to-48.ico" />,
		title: "Connect To",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/shell32/432-printers-and-faxes-48.ico" />,
		title: "Printers and Faxes",
	},
] as const;

const MainRightSectionBottomItems = [
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/shell32/963-help-48.ico" />,
		title: "Help and Support",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/shell32/194-search-48.ico" />,
		title: "Search",
	},
	{
		id: id++,
		icon: <MainSectionItemImgIcon src="/assets/icons/shell32/217-run-48.ico" />,
		title: "Run...",
	},
] as const;

export function StartMenu() {
	return (
		<div
			className="flex w-[380px] flex-col overflow-hidden rounded-t-[8px] border-[#003399] border-x border-t shadow-[2px_2px_20px_rgba(0,0,0,0.4)]"
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
		<div className="relative flex items-center gap-3 border-[#003399] border-b bg-linear-to-b from-[#1c5ab5] via-[#2c72da] to-[#1c5ab5] px-3 py-2">
			{/* Glossy top highlight */}
			<div className="absolute top-0 right-0 left-0 h-px bg-white/30" />
			<StartMenuAccountAvatar />
			<p className="flex-1 font-bold text-[14px] text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.8)]">
				RAMEAU Valentin
			</p>
		</div>
	);
}

function StartMenuMain() {
	return (
		<div className="relative flex border-[#428eff] border-x-[3px] bg-white">
			<div className="flex w-[190px] flex-col">
				<MainLeftSection />
			</div>
			{/* Vertical orange line that XP has between columns */}
			<div className="w-px self-stretch bg-[#91b5df]" />
			<div className="flex w-[183px] flex-col">
				<MainRightSection />
			</div>
		</div>
	);
}

function MainLeftSectionSeparator() {
	return (
		<div className="px-2 py-1">
			<div className="h-px w-full bg-linear-to-r from-transparent via-gray-200 to-transparent" />
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

function MainLeftSectionItem(props: { icon: React.ReactNode; title: string; subtitle?: string }) {
	return (
		<div className="group flex cursor-pointer items-center gap-2 px-2 py-1.5 transition-colors hover:bg-[#2f71cd] hover:text-white">
			<div className="h-8 w-8 shrink-0 group-hover:brightness-110">{props.icon}</div>
			<div className="flex min-w-0 flex-col">
				<span className="truncate font-bold text-[#333] text-[11px] group-hover:text-white">{props.title}</span>
				{props.subtitle && (
					<span className="truncate text-[10px] text-gray-500 group-hover:text-white/80">{props.subtitle}</span>
				)}
			</div>
		</div>
	);
}

function MainRightSectionItem(props: { icon: React.ReactNode; title: string; bold?: boolean }) {
	return (
		<div className="group flex cursor-pointer items-center gap-2 px-2 py-1.5 transition-colors hover:bg-[#2f71cd] hover:text-white">
			<div className="h-6 w-6 shrink-0 group-hover:brightness-110">{props.icon}</div>
			<span className={`truncate text-[#00136b] text-[11px] group-hover:text-white ${props.bold ? "font-bold" : ""}`}>
				{props.title}
			</span>
		</div>
	);
}

function MainSectionItemImgIcon(props: { src: string }) {
	return <img alt="Icon" className="h-full w-full object-contain" src={props.src} />;
}

function MainLeftSection() {
	return (
		<div className="flex h-full flex-col bg-white">
			<div className="py-1">
				{MainLeftSectionShortcutsItems.map((item) => (
					<MainLeftSectionItem key={item.id} {...item} />
				))}
			</div>
			<MainLeftSectionSeparator />
			<div className="flex-1 py-1">
				{MainLeftSectionItems.map((item) => (
					<MainLeftSectionItem key={item.id} {...item} />
				))}
			</div>
			<div className="mt-auto border-gray-100 border-t bg-white pt-1">
				<AllProgramsButton />
			</div>
		</div>
	);
}

function MainRightSection() {
	return (
		<div className="flex h-full flex-col bg-[#d3e5fa] py-1">
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
		<div className="relative flex items-center justify-end gap-6 border-[#003399] border-t bg-linear-to-b from-[#1c5ab5] via-[#2c72da] to-[#1c5ab5] px-4 py-2">
			{/* Glossy top highlight for footer */}
			<div className="absolute top-0 right-0 left-0 h-px bg-white/20" />
			<StartMenuFooterButton icon="/assets/icons/shell32/338-logoff-48.ico" label="Log Off" />
			<StartMenuFooterButton icon="/assets/icons/shell32/241-poweroff-48.ico" label="Turn Off Computer" />
		</div>
	);
}

function StartMenuFooterButton(props: { icon: string; label: string }) {
	return (
		<button
			className="group flex cursor-pointer items-center gap-2 border-none bg-transparent outline-none transition-all hover:brightness-110 active:brightness-90"
			type="button"
		>
			<div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-md border border-white/30 bg-white/10 shadow-sm">
				<img alt={props.label} className="h-5 w-5 object-contain" src={props.icon} />
			</div>
			<span className="font-medium text-[12px] text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)] group-hover:underline">
				{props.label}
			</span>
		</button>
	);
}

function StartMenuAccountAvatar() {
	return (
		<div className="relative h-12 w-12 overflow-hidden rounded-[4px] border-2 border-white/90 shadow-[2px_2px_4px_rgba(0,0,0,0.6)]">
			<img
				alt="Account Avatar"
				className="h-full w-full object-cover"
				src="/assets/icons/profile-pictures/profile-picture.webp"
			/>
			{/* Subtle inner shadow for depth */}
			<div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_4px_rgba(0,0,0,0.2)]" />
		</div>
	);
}
