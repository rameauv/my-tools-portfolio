import { Eye, GitFork, Star } from "lucide-react";
import React from "react";
import Markdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import type { GithubRepo } from "../../app-github-explorer/internal/GithubRepo";
import { MenuBar } from "../../shared/ds/MenuBar";
import { PROJECTS_CUSTOM_MARKDOWN } from "../../shared/projects/projects";
import { FormattingToolbar } from "./FormattingToolbar";
import { LanguageBadge } from "./LanguageBadge";
import { PreviewLink } from "./PreviewLink";
import { Ruler } from "./Ruler";
import { StatButton } from "./StatButton";
import { StatusBar } from "./StatusBar";
import { ViewOnGitHubLink } from "./ViewOnGitHubLink";

const MENU_BAR_ITEMS = [
	{ label: "File" },
	{ label: "Edit" },
	{ label: "View" },
	{ label: "Insert" },
	{ label: "Format" },
	{ label: "Tools" },
	{ label: "Table" },
	{ label: "Window" },
	{ label: "Help" },
];

const components: Components = {
	img: ({ node, ...props }) => (
		<img {...props} alt={props.alt ?? "Image"} crossOrigin="anonymous" style={{ maxWidth: "100%" }} />
	),
};

interface GithubProjectProps {
	data?: {
		repo: GithubRepo;
	};
}

export const GithubProject = React.memo((props: GithubProjectProps) => {
	const repo = props.data?.repo;
	if (!repo) {
		return (
			<div
				className="flex h-full items-center justify-center text-gray-500"
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
		<div className="flex h-full flex-col bg-[#ece9d8]" style={{ fontFamily: "Tahoma, sans-serif" }}>
			<MenuBar items={MENU_BAR_ITEMS} />

			<FormattingToolbar />

			<Ruler />

			<div className="@container flex-1 overflow-auto bg-gray-200 @sm:px-8 px-1 py-8">
				<div className="relative mx-auto min-h-full max-w-4xl bg-white @md:p-12 @sm:p-8 p-4 shadow-lg">
					<div className="@sm:mb-8 mb-4 border-[#d1d1d1] border-b bg-[#ece9d8] @sm:px-3 px-2 @sm:py-2 py-1.5">
						<div className="flex @sm:flex-row flex-col @sm:items-center @sm:justify-between @sm:gap-3 gap-2">
							<div className="flex flex-wrap items-center @sm:gap-2 gap-1.5">
								<StatButton count={repo.starsCount || 0}>
									<Star className="@sm:h-4 h-3 @sm:w-4 w-3 text-yellow-500" size={16} />
								</StatButton>
								<StatButton count={repo.forksCount || 0}>
									<GitFork className="@sm:h-4 h-3 @sm:w-4 w-3 text-blue-500" size={16} />
								</StatButton>
								<StatButton count={repo.watchersCount || 0}>
									<Eye className="@sm:h-4 h-3 @sm:w-4 w-3 text-green-500" size={16} />
								</StatButton>

								<LanguageBadge language={repo.language} />
							</div>

							{repo.htmlUrl && <ViewOnGitHubLink href={repo.htmlUrl} />}
						</div>
					</div>

					{previewUrl && (
						<div className="@sm:mb-6 mb-4 flex justify-center">
							<PreviewLink href={previewUrl} />
						</div>
					)}

					<div className="prose prose-sm max-w-none" style={{ fontFamily: "Times New Roman, serif" }}>
						<Markdown
							components={components}
							rehypePlugins={[rehypeRaw]}
							remarkRehypeOptions={{ allowDangerousHtml: true }}
						>
							{displayMarkdown}
						</Markdown>
					</div>
				</div>
			</div>

			<StatusBar />
		</div>
	);
});
