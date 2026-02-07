import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	ExternalLink,
	Eye,
	GitFork,
	Italic,
	List,
	Star,
	Underline,
} from "lucide-react";
import React from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import type { GithubRepo } from "../../app-github-explorer/internal/GithubRepo";
import { MenuBar } from "../../shared/MenuBar";
import { PROJECTS_CUSTOM_MARKDOWN } from "../../shared/projects/projects";
import { Ruler } from "./Ruler";

interface GithubProjectProps {
	data?: {
		repo: GithubRepo;
	};
}

export const GithubProject = React.memo(function GithubProject(
	props: GithubProjectProps,
) {
	const repo = props.data?.repo;
	if (!repo) {
		return (
			<div
				className="flex items-center justify-center h-full text-gray-500"
				style={{ fontFamily: "Tahoma, sans-serif" }}
			>
				No document selected
			</div>
		);
	}

	const projectConfig = PROJECTS_CUSTOM_MARKDOWN.find((p) => p.id === repo.id);
	const customMarkdown = projectConfig?.markdown;
	const displayMarkdown = customMarkdown ?? repo.readmeContent;
	const previewUrl = projectConfig?.previewUrl;

	return (
		<div
			className="flex flex-col h-full bg-[#ece9d8]"
			style={{ fontFamily: "Tahoma, sans-serif" }}
		>
			{/* Menu Bar */}
			<MenuBar
				className="bg-[#ece9d8] border-b border-[#d1d1d1] px-2 py-1 flex items-center gap-4 text-xs text-black"
				itemClassName="hover:bg-white hover:px-1 cursor-pointer"
				items={[
					{ label: "File" },
					{ label: "Edit" },
					{ label: "View" },
					{ label: "Insert" },
					{ label: "Format" },
					{ label: "Tools" },
					{ label: "Table" },
					{ label: "Window" },
					{ label: "Help" },
				]}
			/>

			{/* Formatting Toolbar */}
			<div className="bg-[#ece9d8] border-b border-[#d1d1d1] px-2 py-1 flex items-center gap-2 text-xs">
				<select
					className="border border-gray-400 bg-white text-xs px-1 py-0.5"
					defaultValue="Times New Roman"
				>
					<option>Times New Roman</option>
					<option>Arial</option>
					<option>Courier New</option>
				</select>
				<select
					className="border border-gray-400 bg-white text-xs px-1 py-0.5"
					defaultValue="12"
				>
					<option>8</option>
					<option>9</option>
					<option>10</option>
					<option>11</option>
					<option>12</option>
					<option>14</option>
					<option>16</option>
					<option>18</option>
					<option>20</option>
					<option>24</option>
				</select>
				<div className="w-px h-6 bg-[#d1d1d1] mx-1" />
				<ToolbarButton icon={<Bold size={14} />} />
				<ToolbarButton icon={<Italic size={14} />} />
				<ToolbarButton icon={<Underline size={14} />} />
				<div className="w-px h-6 bg-[#d1d1d1] mx-1" />
				<ToolbarButton icon={<AlignLeft size={14} />} />
				<ToolbarButton icon={<AlignCenter size={14} />} />
				<ToolbarButton icon={<AlignRight size={14} />} />
				<ToolbarButton icon={<List size={14} />} />
			</div>

			{/* Ruler */}
			<Ruler />

			{/* Document Area */}
			<div className="@container flex-1 overflow-auto bg-gray-200 py-8 px-1 @sm:px-8">
				<div className="bg-white shadow-lg mx-auto max-w-4xl min-h-full p-4 @sm:p-8 @md:p-12 relative">
					{/* Stats and Link Banner - Windows XP Style */}
					<div className="bg-[#ece9d8] border-b border-[#d1d1d1] px-2 @sm:px-3 py-1.5 @sm:py-2 mb-4 @sm:mb-8">
						<div className="flex flex-col @sm:flex-row @sm:items-center @sm:justify-between gap-2 @sm:gap-3">
							<div className="flex items-center flex-wrap gap-1.5 @sm:gap-2">
								{/* Star Count Button */}
								<button
									className="flex items-center gap-1 px-2 @sm:px-3 py-1 bg-[#ece9d8] border border-gray-400 rounded-sm hover:bg-white hover:border-gray-500 active:bg-gray-200 active:border-gray-600 active:shadow-inner text-xs @sm:text-sm font-medium text-gray-800 transition-all"
									style={{
										boxShadow:
											"inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)",
									}}
									type="button"
								>
									<Star
										className="text-yellow-500 w-3 h-3 @sm:w-4 @sm:h-4"
										size={16}
									/>
									<span className="font-semibold">{repo.starsCount || 0}</span>
								</button>

								{/* Fork Count Button */}
								<button
									className="flex items-center gap-1 px-2 @sm:px-3 py-1 bg-[#ece9d8] border border-gray-400 rounded-sm hover:bg-white hover:border-gray-500 active:bg-gray-200 active:border-gray-600 active:shadow-inner text-xs @sm:text-sm font-medium text-gray-800 transition-all"
									style={{
										boxShadow:
											"inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)",
									}}
									type="button"
								>
									<GitFork
										className="text-blue-500 w-3 h-3 @sm:w-4 @sm:h-4"
										size={16}
									/>
									<span className="font-semibold">{repo.forksCount || 0}</span>
								</button>

								{/* Watchers Count Button */}
								<button
									className="flex items-center gap-1 px-2 @sm:px-3 py-1 bg-[#ece9d8] border border-gray-400 rounded-sm hover:bg-white hover:border-gray-500 active:bg-gray-200 active:border-gray-600 active:shadow-inner text-xs @sm:text-sm font-medium text-gray-800 transition-all"
									style={{
										boxShadow:
											"inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)",
									}}
									type="button"
								>
									<Eye
										className="text-green-500 w-3 h-3 @sm:w-4 @sm:h-4"
										size={16}
									/>
									<span className="font-semibold">
										{repo.watchersCount || 0}
									</span>
								</button>

								{/* Language Badge */}
								<div className="px-2 @sm:px-3 py-1 bg-white border border-gray-400 rounded-sm text-xs @sm:text-sm font-medium text-gray-800 shadow-sm">
									{repo.language}
								</div>
							</div>

							{/* View on GitHub Button - XP Style */}
							{repo.htmlUrl && (
								<a
									className="flex items-center gap-1.5 @sm:gap-2 px-3 @sm:px-4 py-1 @sm:py-1.5 bg-linear-to-b from-[#3c81f0] to-[#245edb] hover:from-[#4c91ff] hover:to-[#346efb] active:from-[#1e52b7] active:to-[#163f8c] text-white text-xs @sm:text-sm font-semibold rounded-sm border border-[#1c56c5] active:border-[#163f8c] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.3)] active:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5)] transition-all shrink-0"
									href={repo.htmlUrl}
									rel="noopener noreferrer"
									style={{ fontFamily: "Tahoma, sans-serif" }}
									target="_blank"
								>
									View on GitHub
									<ExternalLink
										className="w-3 h-3 @sm:w-3.5 @sm:h-3.5"
										size={14}
									/>
								</a>
							)}
						</div>
					</div>

					{/* Preview Button */}
					{previewUrl && (
						<div className="flex justify-center mb-4 @sm:mb-6">
							<a
								className="inline-block bg-[#ece9d8] text-black px-3 py-1 h-[23px] leading-[19px] text-[11px] font-normal cursor-default align-middle transition-all"
								href={previewUrl}
								onMouseDown={(e) => {
									e.currentTarget.style.borderTop = "2px solid #aca899";
									e.currentTarget.style.borderLeft = "2px solid #aca899";
									e.currentTarget.style.borderBottom = "2px solid #ece9d8";
									e.currentTarget.style.borderRight = "2px solid #ece9d8";
									e.currentTarget.style.paddingLeft = "13px";
									e.currentTarget.style.paddingTop = "3px";
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.borderTop = "2px solid #f5f2e5";
									e.currentTarget.style.borderLeft = "2px solid #f5f2e5";
									e.currentTarget.style.borderBottom = "2px solid #8b8774";
									e.currentTarget.style.borderRight = "2px solid #8b8774";
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.borderTop = "2px solid #ece9d8";
									e.currentTarget.style.borderLeft = "2px solid #ece9d8";
									e.currentTarget.style.borderBottom = "2px solid #aca899";
									e.currentTarget.style.borderRight = "2px solid #aca899";
									e.currentTarget.style.paddingLeft = "12px";
									e.currentTarget.style.paddingTop = "2px";
								}}
								onMouseUp={(e) => {
									e.currentTarget.style.borderTop = "2px solid #f5f2e5";
									e.currentTarget.style.borderLeft = "2px solid #f5f2e5";
									e.currentTarget.style.borderBottom = "2px solid #8b8774";
									e.currentTarget.style.borderRight = "2px solid #8b8774";
									e.currentTarget.style.paddingLeft = "12px";
									e.currentTarget.style.paddingTop = "2px";
								}}
								rel="noopener noreferrer"
								style={{
									fontFamily: "Tahoma, sans-serif",
									borderTop: "2px solid #ece9d8",
									borderLeft: "2px solid #ece9d8",
									borderBottom: "2px solid #aca899",
									borderRight: "2px solid #aca899",
								}}
								target="_blank"
							>
								Preview
							</a>
						</div>
					)}

					<div
						className="prose prose-sm max-w-none"
						style={{ fontFamily: "Times New Roman, serif" }}
					>
						<Markdown
							rehypePlugins={[rehypeRaw]}
							remarkRehypeOptions={{ allowDangerousHtml: true }}
						>
							{displayMarkdown}
						</Markdown>
					</div>
				</div>
			</div>

			{/* Status Bar */}
			<div className="bg-[#ece9d8] border-t border-[#d1d1d1] px-2 py-1 flex items-center justify-between text-xs text-black">
				<div className="flex items-center gap-4">
					<span>Page 1</span>
					<span>Sec 1</span>
					<span>1/1</span>
					<span>At 1"</span>
					<span>Ln 1</span>
					<span>Col 1</span>
				</div>
				<div className="flex items-center gap-2">
					<span>REC</span>
					<span>TRK</span>
					<span>EXT</span>
					<span>OVR</span>
				</div>
			</div>
		</div>
	);
});

function ToolbarButton({ icon }: { icon: React.ReactNode }) {
	return (
		<button
			className="w-6 h-6 flex items-center justify-center border border-transparent hover:border-gray-400 hover:bg-white active:border-gray-500 active:bg-gray-100"
			type="button"
		>
			{icon}
		</button>
	);
}
