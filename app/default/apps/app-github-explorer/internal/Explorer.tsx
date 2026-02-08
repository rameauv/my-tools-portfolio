import {
	ArrowLeft,
	ArrowRight,
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
import { cn } from "~/utils/cn";
import { useWindowContext } from "../../../window-snapping/WindowContext";
import { appGithubProjects } from "../../app-github-project";
import { MenuBar } from "../../shared/ds/MenuBar";
import { githubRepos } from "../../shared/projects/github-repos/githubRepos";
import { PROJECTS_CUSTOM_MARKDOWN } from "../../shared/projects/projects";
import { AddressBar } from "./AddressBar";
import type { GithubRepo } from "./GithubRepo";

const DISPLAY_REPOS = PROJECTS_CUSTOM_MARKDOWN.filter((pm) => pm.isVisible).map((pm) => {
	const baseRepo = githubRepos.find((r) => r.id === pm.id);
	return {
		...baseRepo,
		name: pm.title,
		id: pm.id,
	} as GithubRepo;
});

export function Explorer() {
	const [viewMode, setViewMode] = useState<"icons" | "details">("icons");
	const windowContext = useWindowContext();

	function handleRepoOpen(repo: GithubRepo) {
		const programDef = appGithubProjects.def({
			projectId: repo.id,
			title: `${repo.name}`,
			config: { repo },
		});
		windowContext.openWindow({
			appId: programDef.appId,
			title: programDef.title,
			iconSrc: programDef.iconSrc,
			component: programDef.component,
			componentData: programDef.componentData,
			defaultWidth: programDef.defaultWidth,
			defaultHeight: programDef.defaultHeight,
			groupingId: programDef.groupingId,
		});
	}

	return (
		<div className="flex h-full select-none flex-col bg-white text-xs" style={{ fontFamily: "Tahoma, sans-serif" }}>
			<MenuBar />

			<div className="flex items-center gap-2 border-[#d1d1d1] border-b bg-[#ece9d8] p-1">
				<div className="flex items-center gap-1">
					<ToolbarButton disabled={true} hasDropdown icon={<ArrowLeft size={16} />} label="Back" />
					<ToolbarButton disabled={true} hasDropdown icon={<ArrowRight size={16} />} />
				</div>

				<div className="mx-1 h-8 w-px bg-[#d1d1d1]" />

				<div className="flex items-center gap-1">
					<ToolbarButton disabled icon={<Search size={16} />} label="Search" />
				</div>

				<div className="mx-1 h-8 w-px bg-[#d1d1d1]" />

				<ToolbarButton
					hasDropdown
					icon={viewMode === "icons" ? <Grid size={16} /> : <ListIcon size={16} />}
					onClick={() => setViewMode((v) => (v === "icons" ? "details" : "icons"))}
				/>
			</div>

			<AddressBar />

			<div className="flex flex-1 overflow-hidden">
				<div className="hidden w-48 flex-col gap-3 overflow-y-auto bg-linear-to-b from-[#748aff] to-[#4057d2] p-3 md:flex">
					<SidebarSection isOpen title="File and Folder Tasks">
						<SidebarLink icon={<Folder size={14} />} text="Make a new folder" />
						<SidebarLink icon={<Monitor size={14} />} text="Publish this folder to the Web" />
						<SidebarLink icon={<MoreHorizontal size={14} />} text="Share this folder" />
					</SidebarSection>

					<SidebarSection isOpen title="Other Places">
						<SidebarLink icon={<Monitor size={14} />} text="My Computer" />
						<SidebarLink icon={<Folder size={14} />} text="My Documents" />
						<SidebarLink icon={<Folder size={14} />} text="Shared Documents" />
					</SidebarSection>

					<SidebarSection isOpen title="Details">
						<div className="bg-white px-3 py-2 text-[11px] text-black">
							<div className="flex flex-col gap-1">
								<p className="font-bold">GitHub</p>
								<p>System Folder</p>
							</div>
						</div>
					</SidebarSection>
				</div>

				{/* File View */}
				<div className="flex-1 overflow-auto bg-white p-4 text-black">
					<div
						className={cn(
							viewMode === "icons" ? "flex w-full flex-wrap content-start gap-6" : "flex min-w-[600px] flex-col",
						)}
					>
						{viewMode === "details" && (
							<div className="mb-2 flex border-gray-300 border-b px-2 pb-1 font-normal text-gray-500">
								<div className="flex-1">Name</div>
								<div className="w-24 px-1">Size</div>
								<div className="w-32 px-1">Type</div>
								<div className="w-40 px-1">Date Modified</div>
							</div>
						)}

						{DISPLAY_REPOS.map((repo) =>
							viewMode === "icons" ? (
								<RepoIconItem key={repo.id} onClick={() => handleRepoOpen(repo)} repo={repo} selected={false} />
							) : (
								<RepoListItem key={repo.id} onClick={() => handleRepoOpen(repo)} repo={repo} selected={false} />
							),
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function ToolbarButton(props: {
	icon: React.ReactNode;
	label?: string;
	hasDropdown?: boolean;
	disabled?: boolean;
	onClick?: () => void;
}) {
	return (
		<button
			className={cn(
				"flex items-center gap-1 rounded-xs border border-transparent px-1 py-1",
				!props.disabled &&
					"hover:border-[#d1d1d1] hover:bg-white hover:shadow-xs active:border-gray-400 active:shadow-inner",
				props.disabled && "cursor-default opacity-50",
			)}
			disabled={props.disabled}
			onClick={props.onClick}
			type="button"
		>
			<div className="flex items-center gap-1">
				<span className={props.disabled ? "text-gray-400" : "text-black"}>{props.icon}</span>
				{props.label && <span className={props.disabled ? "text-gray-400" : "text-black"}>{props.label}</span>}
			</div>
			{props.hasDropdown && <ChevronDown className={props.disabled ? "text-gray-400" : "text-black"} size={10} />}
		</button>
	);
}

function SidebarSection(props: { title: string; isOpen?: boolean; children: React.ReactNode }) {
	return (
		<div className="mb-2 overflow-hidden rounded-t-md bg-[#d6dff7] shadow-md">
			<div
				className={cn(
					"flex cursor-pointer items-center justify-between px-3 py-1 font-bold",
					"bg-linear-to-r from-white/30 to-transparent text-[#215dc6]",
				)}
			>
				{props.title}
				<ChevronDown className="rounded-full border border-white bg-[#215dc6] p-0.5 text-white" size={14} />
			</div>
			<div className="flex flex-col gap-1 bg-[#d6dff7] p-3">{props.children}</div>
		</div>
	);
}

function SidebarLink(props: { icon: React.ReactNode; text: string; onClick?: () => void }) {
	return (
		<div
			className="flex cursor-pointer items-center gap-2 text-[#215dc6] hover:text-blue-800 hover:underline"
			onClick={props.onClick}
		>
			{props.icon}
			<span>{props.text}</span>
		</div>
	);
}

function RepoIconItem(props: { repo: GithubRepo; selected: boolean; onClick: () => void }) {
	return (
		<div
			className={cn("group flex w-20 cursor-pointer flex-col items-center", props.selected && "opacity-100")}
			onClick={props.onClick}
		>
			<div className={cn("flex h-12 w-12 items-center justify-center", props.selected && "opacity-80")}>
				<img alt="repo" className="h-full w-full object-contain" src="/assets/icons/shell32/23-folder-48.ico" />
			</div>
			<span
				className={cn(
					"mt-1 line-clamp-2 break-all rounded-sm px-1 py-0.5 text-center leading-tight",
					props.selected ? "bg-[#316ac5] text-white" : "text-black group-hover:text-blue-700 group-hover:underline",
				)}
			>
				{props.repo.name}
			</span>
		</div>
	);
}

function RepoListItem(props: { repo: GithubRepo; selected: boolean; onClick: () => void }) {
	return (
		<div
			className={cn(
				"flex cursor-pointer items-center px-2 py-0.5",
				props.selected ? "bg-[#316ac5] text-white" : "text-black hover:text-blue-700 hover:underline",
			)}
			onClick={props.onClick}
		>
			<div className="flex min-w-0 flex-1 items-center gap-2">
				<img alt="repo" className="h-4 w-4 shrink-0" src="/assets/icons/shell32/23-folder-48.ico" />
				<span className="truncate">{props.repo.name}</span>
			</div>
			<div className={cn("w-24 shrink-0 px-1", !props.selected && "text-gray-500")}>1 KB</div>
			<div className={cn("w-32 shrink-0 px-1", !props.selected && "text-gray-500")}>{props.repo.language} File</div>
			<div className={cn("w-40 shrink-0 px-1", !props.selected && "text-gray-500")}>{props.repo.updatedAt}</div>
		</div>
	);
}
