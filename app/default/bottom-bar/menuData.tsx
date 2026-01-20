import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
	{
		label: "Accessories",
		icon: (
			<img
				alt="Accessories"
				className="w-4 h-4"
				src="/assets/icons/shell32/160-all-programs-folder-48.ico"
			/>
		),
		children: [
			{
				label: "Calculator",
				icon: (
					<img
						alt="Calculator"
						className="w-4 h-4"
						src="/assets/icons/other/calculator.webp"
					/>
				),
			},
			{
				label: "Notepad",
				icon: (
					<img
						alt="Notepad"
						className="w-4 h-4"
						src="/assets/icons/other/notepad.webp"
					/>
				),
			},
			{
				label: "Paint",
				icon: (
					<img alt="Paint" className="w-4 h-4" src="/assets/icons/other/paint.webp" />
				),
				children: [],
			},
		],
	},
	{
		label: "Games",
		icon: (
			<img
				alt="Games"
				className="w-4 h-4"
				src="/assets/icons/shell32/160-all-programs-folder-48.ico"
			/>
		),
		children: [
			{
				label: "Minesweeper",
				icon: (
					<img
						alt="Minesweeper"
						className="w-4 h-4"
						src="/assets/icons/other/minesweeper.webp"
					/>
				),
			},
		],
	},
	{
		label: "Startup",
		icon: (
			<img
				alt="Startup"
				className="w-4 h-4"
				src="/assets/icons/shell32/160-all-programs-folder-48.ico"
			/>
		),
		children: [],
	},
	{
		label: "System Tools",
		icon: (
			<img
				alt="System Tools"
				className="w-4 h-4"
				src="/assets/icons/shell32/160-all-programs-folder-48.ico"
			/>
		),
		children: [
			{
				label: "Disk Cleanup",
				icon: (
					<img
						alt="Disk Cleanup"
						className="w-4 h-4"
						src="/assets/icons/windows-xp-icons/241.ico"
					/>
				),
			},
			{
				label: "Defragmenter",
				icon: (
					<img
						alt="Defragmenter"
						className="w-4 h-4"
						src="/assets/icons/shell32/578-defragmenter-48.ico"
					/>
				),
			},
			{
				label: "System Information",
				icon: (
					<img
						alt="System Information"
						className="w-4 h-4"
						src="/assets/icons/other/system-information.webp"
					/>
				),
			},
		],
	},
	{
		label: "Internet Explorer",
		icon: (
			<img
				alt="Internet Explorer"
				className="w-4 h-4"
				src="/assets/icons/shell32/1484-internet-explorer-48.ico"
			/>
		),
	},
	{
		label: "Outlook Express",
		icon: (
			<img
				alt="Outlook Express"
				className="w-4 h-4"
				src="/assets/icons/other/outlook-express-xp-icon.webp"
			/>
		),
	},
	{
		label: "Windows Media Player",
		icon: (
			<img
				alt="Windows Media Player"
				className="w-4 h-4"
				src="/assets/icons/other/windows-media-player.webp"
			/>
		),
	},
	{
		label: "Windows Movie Maker",
		icon: (
			<img
				alt="Windows Movie Maker"
				className="w-4 h-4"
				src="/assets/icons/other/windows-movie-maker.webp"
			/>
		),
	},
];
