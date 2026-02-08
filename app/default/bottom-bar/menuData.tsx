import type { MenuItem } from "./types";

let id = 0;

export const menuItems: MenuItem[] = [
	{
		id: id++,
		label: "Accessories",
		icon: <img alt="Accessories" className="h-4 w-4" src="/assets/icons/shell32/160-all-programs-folder-48.ico" />,
		children: [
			{
				id: id++,
				label: "Calculator",
				icon: <img alt="Calculator" className="h-4 w-4" src="/assets/icons/other/calculator.webp" />,
			},
			{
				id: id++,
				label: "Notepad",
				icon: <img alt="Notepad" className="h-4 w-4" src="/assets/icons/other/notepad.webp" />,
			},
			{
				id: id++,
				label: "Paint",
				icon: <img alt="Paint" className="h-4 w-4" src="/assets/icons/other/paint.webp" />,
				children: [],
			},
		],
	},
	{
		id: id++,
		label: "Games",
		icon: <img alt="Games" className="h-4 w-4" src="/assets/icons/shell32/160-all-programs-folder-48.ico" />,
		children: [
			{
				id: id++,
				label: "Minesweeper",
				icon: <img alt="Minesweeper" className="h-4 w-4" src="/assets/icons/other/minesweeper.webp" />,
			},
		],
	},
	{
		id: id++,
		label: "Startup",
		icon: <img alt="Startup" className="h-4 w-4" src="/assets/icons/shell32/160-all-programs-folder-48.ico" />,
		children: [],
	},
	{
		id: id++,
		label: "System Tools",
		icon: <img alt="System Tools" className="h-4 w-4" src="/assets/icons/shell32/160-all-programs-folder-48.ico" />,
		children: [
			{
				id: id++,
				label: "Disk Cleanup",
				icon: <img alt="Disk Cleanup" className="h-4 w-4" src="/assets/icons/windows-xp-icons/241.ico" />,
			},
			{
				id: id++,
				label: "Defragmenter",
				icon: <img alt="Defragmenter" className="h-4 w-4" src="/assets/icons/shell32/578-defragmenter-48.ico" />,
			},
			{
				id: id++,
				label: "System Information",
				icon: <img alt="System Information" className="h-4 w-4" src="/assets/icons/other/system-information.webp" />,
			},
		],
	},
	{
		id: id++,
		label: "Internet Explorer",
		icon: <img alt="Internet Explorer" className="h-4 w-4" src="/assets/icons/shell32/1484-internet-explorer-48.ico" />,
	},
	{
		id: id++,
		label: "Outlook Express",
		icon: <img alt="Outlook Express" className="h-4 w-4" src="/assets/icons/other/outlook-express-xp-icon.webp" />,
	},
	{
		id: id++,
		label: "Windows Media Player",
		icon: <img alt="Windows Media Player" className="h-4 w-4" src="/assets/icons/other/windows-media-player.webp" />,
	},
	{
		id: id++,
		label: "Windows Movie Maker",
		icon: <img alt="Windows Movie Maker" className="h-4 w-4" src="/assets/icons/other/windows-movie-maker.webp" />,
	},
];
