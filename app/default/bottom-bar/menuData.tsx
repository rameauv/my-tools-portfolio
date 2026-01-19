import type { MenuItem } from "./types";

export const menuItems: MenuItem[] = [
	{
		label: "Accessories",
		icon: (
			<img
				alt="Accessories"
				className="w-4 h-4"
				src="/icons/windows-xp-icons/19.ico"
			/>
		),
		children: [
			{
				label: "Calculator",
				icon: (
					<img alt="Calculator" className="w-4 h-4" src="/calculator.png" />
				),
			},
			{
				label: "Notepad",
				icon: <img alt="Notepad" className="w-4 h-4" src="/my-documents.png" />,
			},
			{
				label: "Paint",
				icon: (
					<img
						alt="Paint"
						className="w-4 h-4"
						src="/icons/windows-xp-icons/19.ico"
					/>
				),
				children: [
					{
						label: "New",
						icon: <img alt="New" className="w-4 h-4" src="/my-documents.png" />,
					},
					{
						label: "Open",
						icon: (
							<img
								alt="Open"
								className="w-4 h-4"
								src="/icons/windows-xp-icons/19.ico"
							/>
						),
					},
					{
						label: "Recent Files",
						icon: (
							<img
								alt="Recent Files"
								className="w-4 h-4"
								src="/icons/windows-xp-icons/19.ico"
							/>
						),
						children: [
							{
								label: "File1.png",
								icon: (
									<img
										alt="File1.png"
										className="w-4 h-4"
										src="/my-documents.png"
									/>
								),
							},
							{
								label: "File2.png",
								icon: (
									<img
										alt="File2.png"
										className="w-4 h-4"
										src="/my-documents.png"
									/>
								),
							},
						],
					},
				],
			},
		],
	},
	{
		label: "Games",
		icon: (
			<img
				alt="Games"
				className="w-4 h-4"
				src="/icons/windows-xp-icons/19.ico"
			/>
		),
		children: [
			{
				label: "Solitaire",
				icon: (
					<img
						alt="Solitaire"
						className="w-4 h-4"
						src="/icons/windows-xp-icons/19.ico"
					/>
				),
			},
			{
				label: "Minesweeper",
				icon: (
					<img
						alt="Minesweeper"
						className="w-4 h-4"
						src="/icons/windows-xp-icons/19.ico"
					/>
				),
			},
			{
				label: "Spider Solitaire",
				icon: (
					<img
						alt="Spider Solitaire"
						className="w-4 h-4"
						src="/icons/windows-xp-icons/19.ico"
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
				src="/icons/windows-xp-icons/19.ico"
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
				src="/icons/windows-xp-icons/19.ico"
			/>
		),
		children: [
			{
				label: "Disk Cleanup",
				icon: (
					<img
						alt="Disk Cleanup"
						className="w-4 h-4"
						src="/icons/windows-xp-icons/19.ico"
					/>
				),
			},
			{
				label: "Defragmenter",
				icon: (
					<img
						alt="Defragmenter"
						className="w-4 h-4"
						src="/icons/windows-xp-icons/19.ico"
					/>
				),
			},
			{
				label: "System Information",
				icon: (
					<img
						alt="System Information"
						className="w-4 h-4"
						src="/icons/windows-xp-icons/19.ico"
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
				src="/icons/windows-xp-icons/19.ico"
			/>
		),
	},
	{
		label: "Outlook Express",
		icon: (
			<img
				alt="Outlook Express"
				className="w-4 h-4"
				src="/icons/windows-xp-icons/19.ico"
			/>
		),
	},
	{
		label: "Remote Desktop Connection",
		icon: (
			<img
				alt="Remote Desktop Connection"
				className="w-4 h-4"
				src="/icons/windows-xp-icons/19.ico"
			/>
		),
	},
	{
		label: "Windows Media Player",
		icon: (
			<img
				alt="Windows Media Player"
				className="w-4 h-4"
				src="/icons/windows-xp-icons/19.ico"
			/>
		),
	},
	{
		label: "Windows Movie Maker",
		icon: (
			<img
				alt="Windows Movie Maker"
				className="w-4 h-4"
				src="/icons/windows-xp-icons/19.ico"
			/>
		),
	},
];
