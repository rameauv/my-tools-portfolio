import clsx from "clsx";
import {
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	ChevronDown,
	Folder,
	Grid,
	List as ListIcon,
	Monitor,
	MoreHorizontal,
	Search,
} from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { useWindowContext } from "../../../window-snapping/WindowContext";
import { appGithubProjects } from "../../app-github-project";
import { MenuBar } from "../../shared/MenuBar";
import { githubRepos } from "../../shared/projects/github-repos/githubRepos";
import { PROJECTS_CUSTOM_MARKDOWN } from "../../shared/projects/projects";
import type { GithubRepo } from "./GithubRepo";

export function Explorer() {
	const [viewMode, setViewMode] = useState<"icons" | "details">("icons");
	const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
	const { openWindow } = useWindowContext();

	const displayRepos = PROJECTS_CUSTOM_MARKDOWN.filter(
		(pm) => pm.isVisible,
	).map((pm) => {
		const baseRepo = githubRepos.find((r) => r.id === pm.id);
		return {
			...baseRepo,
			name: pm.title,
			id: pm.id,
		} as GithubRepo;
	});

	const selectedRepo = displayRepos.find((r) => r.id === selectedRepoId);

	function handleRepoOpen(repo: GithubRepo) {
		// Single click opens Word viewer
		const programDef = appGithubProjects.def({
			projectId: repo.id,
			title: `${repo.name} - Microsoft Word`,
			config: { repo },
		});
		openWindow({
			appId: programDef.appId,
			title: programDef.title,
			iconSrc: programDef.iconSrc,
			component: programDef.component,
			componentProps: programDef.componentProps,
			defaultWidth: 900,
			defaultHeight: 700,
			groupingId: programDef.groupingId,
		});
	}

	return (
		<div
			className="flex flex-col h-full bg-white select-none text-xs"
			style={{ fontFamily: "Tahoma, sans-serif" }}
		>
			{/* Top Menu Bar (Visual Only) */}
			<MenuBar
				className="bg-[#ece9d8] px-2 py-1 border-b border-[#d1d1d1] flex items-center gap-4 text-black"
				itemClassName="border border-[#ece9d8] hover:bg-white hover:border-gray-300 px-1 cursor-pointer whitespace-nowrap"
			/>

			{/* Toolbar */}
			<div className="bg-[#ece9d8] p-1 border-b border-[#d1d1d1] flex items-center gap-2">
				<div className="flex items-center gap-1">
					<ToolbarButton
						disabled={true}
						hasDropdown
						icon={<ArrowLeft size={16} />}
						label="Back"
					/>
					<ToolbarButton
						disabled={true}
						hasDropdown
						icon={<ArrowRight size={16} />}
					/>
				</div>

				<div className="w-px h-8 bg-[#d1d1d1] mx-1" />

				<div className="flex items-center gap-1">
					<ToolbarButton disabled icon={<Search size={16} />} label="Search" />
				</div>

				<div className="w-px h-8 bg-[#d1d1d1] mx-1" />

				<ToolbarButton
					hasDropdown
					icon={
						viewMode === "icons" ? <Grid size={16} /> : <ListIcon size={16} />
					}
					onClick={() =>
						setViewMode((v) => (v === "icons" ? "details" : "icons"))
					}
				/>
			</div>

			{/* Address Bar */}
			<div className="bg-[#ece9d8] px-2 py-1 border-b border-[#d1d1d1] flex items-center gap-2">
				<span className="text-gray-500">Address</span>
				<div className="flex-1 bg-white border border-[#7f9db9] px-1 py-0.5 flex items-center text-black">
					<img
						alt="folder"
						className="w-4 h-4 mr-2"
						src="/assets/icons/shell32/23-folder-48.ico"
					/>
					<span className="flex-1">C:\GitHub</span>
					<ChevronDown className="text-gray-500" size={14} />
				</div>
				<button
					className="flex items-center gap-1 px-2 py-0.5 bg-[#ece9d8] border border-gray-400 rounded-sm hover:border-black"
					type="button"
				>
					<span className="text-green-600 font-bold">Go</span>
				</button>
			</div>

			{/* Main Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<div className="hidden md:flex w-48 bg-linear-to-b from-[#748aff] to-[#4057d2] p-3 flex-col gap-3 overflow-y-auto">
					<SidebarSection isOpen title="File and Folder Tasks">
						<SidebarLink icon={<Folder size={14} />} text="Make a new folder" />
						<SidebarLink
							icon={<Monitor size={14} />}
							text="Publish this folder to the Web"
						/>
						<SidebarLink
							icon={<MoreHorizontal size={14} />}
							text="Share this folder"
						/>
					</SidebarSection>

					<SidebarSection isOpen title="Other Places">
						<SidebarLink icon={<Monitor size={14} />} text="My Computer" />
						<SidebarLink icon={<Folder size={14} />} text="My Documents" />
						<SidebarLink icon={<Folder size={14} />} text="Shared Documents" />
					</SidebarSection>

					<SidebarSection isOpen title="Details">
						<div className="px-3 py-2 text-[11px] text-black bg-white">
							{selectedRepo ? (
								<div className="flex flex-col gap-1">
									<p className="font-bold">{selectedRepo.name}</p>
									<p>{selectedRepo.language} File</p>
									<p>Modified: {selectedRepo.updatedAt}</p>
									<p className="mt-1 text-gray-500">
										{selectedRepo.description}
									</p>
								</div>
							) : (
								<div className="flex flex-col gap-1">
									<p className="font-bold">GitHub</p>
									<p>System Folder</p>
								</div>
							)}
						</div>
					</SidebarSection>
				</div>

				{/* File View */}
				<div className="flex-1 bg-white overflow-auto p-4 text-black">
					<div
						className={clsx(
							viewMode === "icons"
								? "w-full flex flex-wrap gap-6 content-start"
								: "min-w-[600px] flex flex-col",
						)}
					>
						{viewMode === "details" && (
							<div className="flex border-b border-gray-300 pb-1 mb-2 text-gray-500 px-2 font-normal">
								<div className="flex-1">Name</div>
								<div className="w-24 px-1">Size</div>
								<div className="w-32 px-1">Type</div>
								<div className="w-40 px-1">Date Modified</div>
							</div>
						)}

						{displayRepos.map((repo) =>
							viewMode === "icons" ? (
								<RepoIconItem
									key={repo.id}
									onClick={() => handleRepoOpen(repo)}
									repo={repo}
									selected={selectedRepoId === repo.id}
								/>
							) : (
								<RepoListItem
									key={repo.id}
									onClick={() => handleRepoOpen(repo)}
									repo={repo}
									selected={selectedRepoId === repo.id}
								/>
							),
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

// Sub-components

function ToolbarButton({
	icon,
	label,
	hasDropdown,
	disabled,
	onClick,
}: {
	icon: React.ReactNode;
	label?: string;
	hasDropdown?: boolean;
	disabled?: boolean;
	onClick?: () => void;
}) {
	return (
		<button
			className={clsx(
				"flex items-center gap-1 px-1 py-1 rounded-xs border border-transparent",
				!disabled &&
					"hover:border-[#d1d1d1] hover:bg-white hover:shadow-xs active:border-gray-400 active:shadow-inner",
				disabled && "opacity-50 cursor-default",
			)}
			disabled={disabled}
			onClick={onClick}
			type="button"
		>
			<div className="flex items-center gap-1">
				<span className={disabled ? "text-gray-400" : "text-black"}>
					{icon}
				</span>
				{label && (
					<span className={disabled ? "text-gray-400" : "text-black"}>
						{label}
					</span>
				)}
			</div>
			{hasDropdown && (
				<ChevronDown
					className={disabled ? "text-gray-400" : "text-black"}
					size={10}
				/>
			)}
		</button>
	);
}

function SidebarSection({
	title,
	isOpen,
	children,
}: {
	title: string;
	isOpen?: boolean;
	children: React.ReactNode;
}) {
	// Using a simplified XP sidebar style
	return (
		<div className="rounded-t-md overflow-hidden bg-[#d6dff7] shadow-md mb-2">
			<div
				className={clsx(
					"px-3 py-1 font-bold flex justify-between items-center cursor-pointer",
					"bg-gradient-to-r from-white/30 to-transparent text-[#215dc6]",
				)}
			>
				{title}
				<ChevronDown
					className="text-white bg-[#215dc6] rounded-full p-0.5 border border-white"
					size={14}
				/>
			</div>
			<div className="bg-[#d6dff7] p-3 flex flex-col gap-1">{children}</div>
		</div>
	);
}

function SidebarLink({
	icon,
	text,
	onClick,
}: {
	icon: React.ReactNode;
	text: string;
	onClick?: () => void;
}) {
	return (
		<div
			className="flex items-center gap-2 text-[#215dc6] cursor-pointer hover:underline hover:text-blue-800"
			onClick={onClick}
		>
			{icon}
			<span>{text}</span>
		</div>
	);
}

function RepoIconItem({
	repo,
	selected,
	onClick,
}: {
	repo: GithubRepo;
	selected: boolean;
	onClick: () => void;
}) {
	return (
		<div
			className={clsx(
				"flex flex-col items-center w-20 group cursor-pointer",
				selected && "opacity-100",
			)}
			onClick={onClick}
		>
			<div
				className={clsx(
					"w-12 h-12 flex items-center justify-center",
					selected && "opacity-80",
				)}
			>
				{/* Using a generic file/doc icon since we are treating repos as files */}
				<img
					alt="repo"
					className="w-full h-full object-contain"
					src="/assets/icons/shell32/23-folder-48.ico"
				/>
			</div>
			<span
				className={clsx(
					"text-center mt-1 px-1 py-0.5 rounded-sm line-clamp-2 leading-tight break-all",
					selected
						? "bg-[#316ac5] text-white"
						: "text-black group-hover:text-blue-700 group-hover:underline",
				)}
			>
				{repo.name}
			</span>
		</div>
	);
}

function RepoListItem({
	repo,
	selected,
	onClick,
}: {
	repo: GithubRepo;
	selected: boolean;
	onClick: () => void;
}) {
	return (
		<div
			className={clsx(
				"flex items-center px-2 py-0.5 cursor-pointer",
				selected
					? "bg-[#316ac5] text-white"
					: "text-black hover:underline hover:text-blue-700",
			)}
			onClick={onClick}
		>
			<div className="flex-1 flex items-center gap-2 min-w-0">
				<img
					alt="repo"
					className="w-4 h-4 shrink-0"
					src="/assets/icons/shell32/23-folder-48.ico"
				/>
				<span className="truncate">{repo.name}</span>
			</div>
			<div className={clsx("w-24 px-1 shrink-0", !selected && "text-gray-500")}>
				1 KB
			</div>
			<div className={clsx("w-32 px-1 shrink-0", !selected && "text-gray-500")}>
				{repo.language} File
			</div>
			<div className={clsx("w-40 px-1 shrink-0", !selected && "text-gray-500")}>
				{repo.updatedAt}
			</div>
		</div>
	);
}
