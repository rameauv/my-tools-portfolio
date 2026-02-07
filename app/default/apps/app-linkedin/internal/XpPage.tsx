import * as React from "react";
import { useState } from "react";
import { assertAllOptionsHandled } from "~/utils/assertIsNever";
import { cn } from "~/utils/cn";
import { linkedinData } from "./data";
import type { LinkedInProfile } from "./types";

function extractVanityName(url: string): string | null {
	const match = url.match(/\/in\/([^/?]+)/);
	return match ? match[1] : null;
}

export function XpPage() {
	const profile = linkedinData;
	const [activeSection, setActiveSection] = useState<
		"about" | "experience" | "education" | "skills" | "projects"
	>("about");
	const containerRef = React.useRef<HTMLDivElement>(null);

	const handleSectionChange = (
		section: "about" | "experience" | "education" | "skills" | "projects",
		platform: "desktop" | "mobile",
	) => {
		setActiveSection(section);

		if (platform === "mobile") {
			if (containerRef.current) {
				containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
			}
			return;
		}

		if (platform === "desktop") {
			const element = document.getElementById(`section-${section}`);
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			}
			return;
		}
		assertAllOptionsHandled(platform);
	};

	return (
		<div
			className="@container w-full h-full bg-[#e5e5e5] overflow-auto font-sans text-black"
			ref={containerRef}
		>
			{/* Page Header */}
			<div className="bg-linear-to-b from-[#dfe8f6] to-[#c8d5e8] border-b-2 border-[#a0a0a0] px-3 @sm:px-6 py-2 @sm:py-3">
				<h1 className="text-base @sm:text-lg font-bold text-[#003366]">
					{profile.personal_information.name}
				</h1>
				{profile.personal_information.job_title && (
					<p className="text-[10px] @sm:text-xs text-gray-700 mt-1">
						{profile.personal_information.job_title}
					</p>
				)}
			</div>

			{/* Mobile Navigation Tabs */}
			<div className="@sm:hidden bg-[#ece9d8] border-b border-gray-400 flex overflow-x-auto sticky top-0 z-20">
				<NavTab
					active={activeSection === "about"}
					label="About"
					onClick={() => handleSectionChange("about", "mobile")}
				/>
				<NavTab
					active={activeSection === "experience"}
					label="Experience"
					onClick={() => handleSectionChange("experience", "mobile")}
				/>
				<NavTab
					active={activeSection === "education"}
					label="Education"
					onClick={() => handleSectionChange("education", "mobile")}
				/>
				<NavTab
					active={activeSection === "skills"}
					label="Skills"
					onClick={() => handleSectionChange("skills", "mobile")}
				/>
				<NavTab
					active={activeSection === "projects"}
					label="Projects"
					onClick={() => handleSectionChange("projects", "mobile")}
				/>
			</div>

			{/* Main Content Area */}
			<div className="flex flex-col @sm:flex-row">
				{/* Sidebar - Desktop */}
				<div className="hidden @sm:block w-48 bg-[#f0f0f0] border-r-2 border-[#a0a0a0] p-3 shrink-0 sticky top-0 self-start h-fit">
					<SidebarNav
						activeSection={activeSection}
						onSectionChange={handleSectionChange}
					/>
				</div>

				{/* Content */}
				<div className="flex-1 p-3 @sm:p-6 bg-white min-h-0">
					{/* Mobile: Show only active section */}
					<div className="@sm:hidden">
						{activeSection === "about" && <AboutSection profile={profile} />}
						{activeSection === "experience" && (
							<ExperienceSection profile={profile} />
						)}
						{activeSection === "education" && (
							<EducationSection profile={profile} />
						)}
						{activeSection === "skills" && <SkillsSection profile={profile} />}
						{activeSection === "projects" && (
							<ProjectsSection profile={profile} />
						)}
					</div>

					{/* Desktop: Show all sections */}
					<div className="hidden @sm:block space-y-6">
						<AboutSection profile={profile} />
						<ExperienceSection profile={profile} />
						<EducationSection profile={profile} />
						<SkillsSection profile={profile} />
						<ProjectsSection profile={profile} />
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="bg-[#ece9d8] border-t border-gray-400 px-3 @sm:px-6 py-1 text-[9px] @sm:text-[10px] text-gray-600 text-center">
				Last updated: {new Date().toLocaleDateString()} | Powered by Internet
				Explorer 6
			</div>
		</div>
	);
}

function NavTab({
	active,
	onClick,
	label,
}: {
	active: boolean;
	onClick: () => void;
	label: string;
}) {
	return (
		<button
			className={cn(
				"px-4 py-2 text-[10px] @sm:text-xs font-semibold border-b-2 transition-colors whitespace-nowrap",
				active
					? "bg-white border-[#003366] text-[#003366]"
					: "bg-[#ece9d8] border-transparent text-gray-600 hover:bg-gray-100",
			)}
			onClick={onClick}
			type="button"
		>
			{label}
		</button>
	);
}

function SidebarNav({
	activeSection,
	onSectionChange,
}: {
	activeSection: string;
	onSectionChange: (
		section: "about" | "experience" | "education" | "skills" | "projects",
		platform: "desktop" | "mobile",
	) => void;
}) {
	const links = [
		{ id: "about" as const, label: "About" },
		{ id: "experience" as const, label: "Experience" },
		{ id: "education" as const, label: "Education" },
		{ id: "skills" as const, label: "Skills" },
		{ id: "projects" as const, label: "Projects" },
	];

	return (
		<div className="space-y-1">
			{links.map((link) => (
				<button
					className={cn(
						"w-full text-left px-3 py-2 text-xs rounded-sm border transition-colors",
						activeSection === link.id
							? "bg-[#dfe8f6] border-[#003366] text-[#003366] font-bold"
							: "bg-white border-gray-300 text-gray-700 hover:bg-gray-50",
					)}
					key={link.id}
					onClick={() => onSectionChange(link.id, "desktop")}
					style={{
						boxShadow:
							activeSection === link.id
								? "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)"
								: undefined,
					}}
					type="button"
				>
					{link.label}
				</button>
			))}
		</div>
	);
}

function AboutSection({ profile }: { profile: LinkedInProfile }) {
	const vanityName = extractVanityName(
		profile.personal_information.contact.linkedin,
	);

	return (
		<Section id="section-about" title="About">
			<div className="space-y-4">
				{/* Basic Info */}
				<div className="bg-[#f9f9f9] border border-gray-300 p-3 rounded-sm">
					<InfoRow label="Name" value={profile.personal_information.name} />
					{vanityName && (
						<InfoRow
							href={profile.personal_information.contact.linkedin}
							label="LinkedIn"
							value={`linkedin.com/in/${vanityName}`}
						/>
					)}
					{profile.personal_information.location && (
						<InfoRow
							label="Location"
							value={profile.personal_information.location}
						/>
					)}
				</div>

				{/* Summary */}
				{profile.summary && (
					<div className="bg-[#f9f9f9] border border-gray-300 p-3 rounded-sm">
						<h3 className="text-xs @sm:text-sm font-bold text-[#003366] mb-2">
							Summary
						</h3>
						<p className="text-[10px] @sm:text-xs text-gray-700 leading-relaxed whitespace-pre-line">
							{profile.summary}
						</p>
					</div>
				)}

				{/* Languages */}
				{profile.languages && profile.languages.length > 0 && (
					<div className="bg-[#f9f9f9] border border-gray-300 p-3 rounded-sm">
						<h3 className="text-xs @sm:text-sm font-bold text-[#003366] mb-2">
							Languages
						</h3>
						<div className="space-y-1">
							{profile.languages.map((lang) => (
								<div
									className="text-[10px] @sm:text-xs text-gray-700"
									key={lang.language}
								>
									<span className="font-semibold">{lang.language}:</span>{" "}
									{lang.proficiency}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</Section>
	);
}

function ExperienceSection({ profile }: { profile: LinkedInProfile }) {
	return (
		<Section id="section-experience" title="Experience">
			<div className="space-y-4">
				{profile.work_experience.length === 0 ? (
					<p className="text-[10px] @sm:text-xs text-gray-500">
						No experience listed.
					</p>
				) : (
					profile.work_experience.map((exp) => (
						<div
							className="bg-[#f9f9f9] border border-gray-300 p-3 @sm:p-4 rounded-sm hover:border-[#003366] transition-colors"
							key={`${exp.company}-${exp.role}`}
						>
							<div className="flex flex-col @sm:flex-row @sm:items-start @sm:justify-between gap-2 mb-2">
								<div className="flex-1">
									<h3 className="text-xs @sm:text-sm font-bold text-[#003366] mb-1">
										{exp.role}
									</h3>
									<div className="flex items-center gap-2 flex-wrap">
										<span className="text-[10px] @sm:text-xs font-semibold text-gray-700">
											{exp.company}
										</span>
										{exp.location && (
											<span className="text-[9px] @sm:text-[10px] text-gray-500">
												({exp.location})
											</span>
										)}
									</div>
								</div>
								<div className="text-[9px] @sm:text-[10px] text-gray-600 shrink-0">
									<span>
										{exp.start_date} - {exp.end_date}
									</span>
								</div>
							</div>

							{exp.description && (
								<div className="mt-2 text-[10px] @sm:text-xs text-gray-700 leading-relaxed whitespace-pre-line">
									{exp.description}
								</div>
							)}

							{exp.achievements && exp.achievements.length > 0 && (
								<div className="mt-3 space-y-1">
									<h4 className="text-[10px] @sm:text-xs font-semibold text-[#003366] mb-1">
										Key Achievements:
									</h4>
									<ul className="list-disc list-inside space-y-0.5 text-[10px] @sm:text-xs text-gray-700">
										{exp.achievements.map((achievement) => (
											<li key={achievement}>{achievement}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					))
				)}
			</div>
		</Section>
	);
}

function EducationSection({ profile }: { profile: LinkedInProfile }) {
	const allEducation = [
		...(profile.education || []),
		...(profile.certifications || []),
	];

	return (
		<Section id="section-education" title="Education">
			<div className="space-y-4">
				{allEducation.length === 0 ? (
					<p className="text-[10px] @sm:text-xs text-gray-500">
						No education listed.
					</p>
				) : (
					allEducation.map((item) => {
						// Check if it's education or certification
						const isEducation = "institution" in item;
						const uniqueKey = isEducation
							? `${item.institution}-${item.degree || ""}`
							: `${item.name}-${item.level || ""}`;

						return (
							<div
								className="bg-[#f9f9f9] border border-gray-300 p-3 @sm:p-4 rounded-sm"
								key={uniqueKey}
							>
								{isEducation ? (
									<>
										<h3 className="text-xs @sm:text-sm font-bold text-[#003366] mb-1">
											{item.institution}
										</h3>
										{item.degree && (
											<p className="text-[10px] @sm:text-xs text-gray-700 mb-2">
												{item.degree}
											</p>
										)}
										{item.location && (
											<p className="text-[9px] @sm:text-[10px] text-gray-600 mb-1">
												{item.location}
											</p>
										)}
										{(item.start_year || item.end_year) && (
											<p className="text-[9px] @sm:text-[10px] text-gray-600">
												{item.start_year} - {item.end_year || "Present"}
											</p>
										)}
									</>
								) : (
									<>
										<h3 className="text-xs @sm:text-sm font-bold text-[#003366] mb-1">
											{item.name}
										</h3>
										{item.level && (
											<p className="text-[10px] @sm:text-xs text-gray-700 mb-2">
												Level: {item.level}
											</p>
										)}
										{item.year && (
											<p className="text-[9px] @sm:text-[10px] text-gray-600">
												Year: {item.year}
											</p>
										)}
									</>
								)}
							</div>
						);
					})
				)}
			</div>
		</Section>
	);
}

function SkillsSection({ profile }: { profile: LinkedInProfile }) {
	// Flatten all skills from different categories
	const allSkills = [
		...(profile.skills.programming_languages || []),
		...(profile.skills.frontend || []),
		...(profile.skills.backend_cloud || []),
		...(profile.skills.tools || []),
		...(profile.skills.frameworks || []),
	];

	return (
		<Section id="section-skills" title="Skills">
			<div className="space-y-4">
				{allSkills.length === 0 ? (
					<p className="text-[10px] @sm:text-xs text-gray-500">
						No skills listed.
					</p>
				) : (
					<div className="flex flex-wrap gap-2">
						{allSkills.map((skill) => (
							<span
								className="bg-[#dfe8f6] text-[#003366] px-3 py-1.5 rounded-sm text-[10px] @sm:text-xs font-semibold border border-[#a0a0a0] hover:bg-[#c8d5e8] transition-colors cursor-default"
								key={skill}
								style={{
									boxShadow:
										"inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)",
								}}
							>
								{skill}
							</span>
						))}
					</div>
				)}
			</div>
		</Section>
	);
}

function ProjectsSection({ profile }: { profile: LinkedInProfile }) {
	return (
		<Section id="section-projects" title="Projects">
			<div className="space-y-4">
				{profile.projects.length === 0 ? (
					<p className="text-[10px] @sm:text-xs text-gray-500">
						No projects listed.
					</p>
				) : (
					profile.projects.map((project) => (
						<div
							className="bg-[#f9f9f9] border border-gray-300 p-3 @sm:p-4 rounded-sm hover:border-[#003366] transition-colors"
							key={project.name}
						>
							<h3 className="text-xs @sm:text-sm font-bold text-[#003366] mb-2">
								{project.name}
							</h3>
							{project.description && (
								<div className="text-[10px] @sm:text-xs text-gray-700 leading-relaxed whitespace-pre-line">
									{project.description}
								</div>
							)}
						</div>
					))
				)}
			</div>
		</Section>
	);
}

function Section({
	title,
	id,
	children,
}: {
	title: string;
	id?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="mb-6 scroll-mt-6" id={id}>
			<h2 className="text-sm @sm:text-base font-bold text-[#003366] mb-3 pb-2 border-b-2 border-[#003366]">
				{title}
			</h2>
			{children}
		</div>
	);
}

function InfoRow({
	label,
	value,
	href,
}: {
	label: string;
	value: string;
	href?: string;
}) {
	const content = (
		<div
			className={cn(
				"flex flex-col @sm:flex-row gap-1 @sm:gap-2 py-1 text-[10px] @sm:text-xs",
				href && "hover:bg-gray-100 transition-colors cursor-pointer",
			)}
		>
			<span className="font-semibold text-gray-700 w-20 @sm:w-24 shrink-0">
				{label}:
			</span>
			<span
				className={cn("text-gray-600", href && "text-[#003366] underline")}
			>
				{value}
			</span>
		</div>
	);

	if (href) {
		return (
			<a href={href} rel="noopener noreferrer" target="_blank">
				{content}
			</a>
		);
	}

	return content;
}
