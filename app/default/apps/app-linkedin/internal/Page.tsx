import * as React from "react";
import { useState } from "react";
import { assertAllOptionsHandled } from "~/utils/assertIsNever";
import { cn } from "~/utils/cn";
import { linkedinData } from "./data";
import type { LinkedInProfile } from "./types";

const SECTIONS = [
	{ label: "About", id: "about", Component: AboutSection },
	{ label: "Experience", id: "experience", Component: ExperienceSection },
	{ label: "Education", id: "education", Component: EducationSection },
	{ label: "Skills", id: "skills", Component: SkillsSection },
	{ label: "Projects", id: "projects", Component: ProjectsSection },
] as const;

const MOBILE_SECTIONS = SECTIONS.map((section) => ({ ...section, elId: mobileSectionIdProvider(section.id) }));

const DESKTOP_SECTIONS = SECTIONS.map((section) => ({ ...section, elId: desktopSectionIdProvider(section.id) }));

export function Page() {
	const profile = linkedinData;
	const [activeSection, setActiveSection] = useState<"about" | "experience" | "education" | "skills" | "projects">(
		"about",
	);
	const containerRef = React.useRef<HTMLDivElement>(null);

	const handleSectionChange = (
		section: "about" | "experience" | "education" | "skills" | "projects",
		platform: "desktop" | "mobile",
	) => {
		if (platform === "mobile") {
			setActiveSection(section);
			if (containerRef.current) {
				containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
			}
			return;
		}

		if (platform === "desktop") {
			const element = document.getElementById(desktopSectionIdProvider(section));
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			}
			return;
		}
		assertAllOptionsHandled(platform);
	};

	const activeMobileSection = MOBILE_SECTIONS.find((section) => section.id === activeSection);

	return (
		<div className="@container h-full w-full overflow-auto bg-[#e5e5e5] font-sans text-black" ref={containerRef}>
			<ProfileHeader jobTitle={profile.personal_information.job_title} name={profile.personal_information.name} />

			<div className="sticky top-0 z-20 flex @sm:hidden overflow-x-auto border-gray-400 border-b bg-[#ece9d8]">
				{MOBILE_SECTIONS.map((section) => (
					<NavTab
						active={activeSection === section.id}
						key={section.id}
						label={section.label}
						onClick={() => handleSectionChange(section.id, "mobile")}
					/>
				))}
			</div>

			<div className="flex @sm:flex-row flex-col">
				<div className="sticky top-0 @sm:block hidden h-fit w-48 shrink-0 self-start border-[#a0a0a0] border-r-2 bg-[#f0f0f0] p-3">
					<DesktopSidebarNav activeSection={""} onSectionChange={handleSectionChange} />
				</div>

				<div className="min-h-0 flex-1 bg-white @sm:p-6 p-3">
					<div className="@sm:hidden">
						{activeMobileSection && <activeMobileSection.Component id={activeMobileSection.elId} profile={profile} />}
					</div>

					<div className="@sm:block hidden space-y-6">
						{DESKTOP_SECTIONS.map((section) => (
							<section.Component id={section.elId} key={section.id} profile={profile} />
						))}
					</div>
				</div>
			</div>

			<PageFooter />
		</div>
	);
}

function ProfileHeader(props: { name: string; jobTitle?: string }) {
	return (
		<div className="border-[#a0a0a0] border-b-2 bg-linear-to-b from-[#dfe8f6] to-[#c8d5e8] @sm:px-6 px-3 @sm:py-3 py-2">
			<h1 className="font-bold @sm:text-lg text-[#003366] text-base">{props.name}</h1>
			{props.jobTitle && <p className="mt-1 @sm:text-xs text-[10px] text-gray-700">{props.jobTitle}</p>}
		</div>
	);
}

function PageFooter() {
	return (
		<div className="border-gray-400 border-t bg-[#ece9d8] @sm:px-6 px-3 py-1 text-center @sm:text-[10px] text-[9px] text-gray-600">
			Last updated: {new Date().toLocaleDateString()} | Powered by Internet Explorer 6
		</div>
	);
}

function NavTab(props: { active: boolean; onClick: () => void; label: string }) {
	return (
		<button
			className={cn(
				"cursor-pointer whitespace-nowrap border-b-2 px-4 py-2 font-semibold @sm:text-xs text-[10px] transition-colors",
				props.active
					? "border-[#003366] bg-white text-[#003366]"
					: "border-transparent bg-[#ece9d8] text-gray-600 hover:bg-gray-100",
			)}
			onClick={props.onClick}
			type="button"
		>
			{props.label}
		</button>
	);
}

function DesktopSidebarNav(props: {
	activeSection: string;
	onSectionChange: (
		section: "about" | "experience" | "education" | "skills" | "projects",
		platform: "desktop" | "mobile",
	) => void;
}) {
	return (
		<div className="space-y-1">
			{DESKTOP_SECTIONS.map((section) => (
				<button
					className={cn(
						"w-full cursor-pointer rounded-sm border px-3 py-2 text-left text-xs transition-colors",
						props.activeSection === section.id
							? "border-[#003366] bg-[#dfe8f6] font-bold text-[#003366]"
							: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
					)}
					key={section.id}
					onClick={() => props.onSectionChange(section.id, "desktop")}
					style={{
						boxShadow:
							props.activeSection === section.id
								? "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)"
								: undefined,
					}}
					type="button"
				>
					{section.label}
				</button>
			))}
		</div>
	);
}

function AboutSection(props: { profile: LinkedInProfile; id: string }) {
	const vanityName = extractVanityName(props.profile.personal_information.contact.linkedin);

	return (
		<Section id={props.id} title="About">
			<div className="space-y-4">
				{/* Basic Info */}
				<div className="rounded-sm border border-gray-300 bg-[#f9f9f9] p-3">
					<InfoRow label="Name" value={props.profile.personal_information.name} />
					{vanityName && (
						<InfoRow
							href={props.profile.personal_information.contact.linkedin}
							label="LinkedIn"
							value={`linkedin.com/in/${vanityName}`}
						/>
					)}
					{props.profile.personal_information.location && (
						<InfoRow label="Location" value={props.profile.personal_information.location} />
					)}
				</div>

				{/* Summary */}
				{props.profile.summary && (
					<div className="rounded-sm border border-gray-300 bg-[#f9f9f9] p-3">
						<h3 className="mb-2 font-bold @sm:text-sm text-[#003366] text-xs">Summary</h3>
						<p className="whitespace-pre-line @sm:text-xs text-[10px] text-gray-700 leading-relaxed">
							{props.profile.summary}
						</p>
					</div>
				)}

				{/* Languages */}
				{props.profile.languages && props.profile.languages.length > 0 && (
					<div className="rounded-sm border border-gray-300 bg-[#f9f9f9] p-3">
						<h3 className="mb-2 font-bold @sm:text-sm text-[#003366] text-xs">Languages</h3>
						<div className="space-y-1">
							{props.profile.languages.map((lang) => (
								<div className="@sm:text-xs text-[10px] text-gray-700" key={lang.language}>
									<span className="font-semibold">{lang.language}:</span> {lang.proficiency}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</Section>
	);
}

function ExperienceSection(props: { profile: LinkedInProfile; id: string }) {
	return (
		<Section id={props.id} title="Experience">
			<div className="space-y-4">
				{props.profile.work_experience.length === 0 ? (
					<p className="@sm:text-xs text-[10px] text-gray-500">No experience listed.</p>
				) : (
					props.profile.work_experience.map((exp) => (
						<div
							className="rounded-sm border border-gray-300 bg-[#f9f9f9] @sm:p-4 p-3 transition-colors hover:border-[#003366]"
							key={`${exp.company}-${exp.role}`}
						>
							<div className="mb-2 flex @sm:flex-row flex-col @sm:items-start @sm:justify-between gap-2">
								<div className="flex-1">
									<h3 className="mb-1 font-bold @sm:text-sm text-[#003366] text-xs">{exp.role}</h3>
									<div className="flex flex-wrap items-center gap-2">
										<span className="font-semibold @sm:text-xs text-[10px] text-gray-700">{exp.company}</span>
										{exp.location && <span className="@sm:text-[10px] text-[9px] text-gray-500">({exp.location})</span>}
									</div>
								</div>
								<div className="shrink-0 @sm:text-[10px] text-[9px] text-gray-600">
									<span>
										{exp.start_date} - {exp.end_date}
									</span>
								</div>
							</div>

							{exp.description && (
								<div className="mt-2 whitespace-pre-line @sm:text-xs text-[10px] text-gray-700 leading-relaxed">
									{exp.description}
								</div>
							)}

							{exp.achievements && exp.achievements.length > 0 && (
								<div className="mt-3 space-y-1">
									<h4 className="mb-1 font-semibold @sm:text-xs text-[#003366] text-[10px]">Key Achievements:</h4>
									<ul className="list-inside list-disc space-y-0.5 @sm:text-xs text-[10px] text-gray-700">
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

function EducationSection(props: { profile: LinkedInProfile; id: string }) {
	const allEducation = [...(props.profile.education || []), ...(props.profile.certifications || [])];

	return (
		<Section id={props.id} title="Education">
			<div className="space-y-4">
				{allEducation.length === 0 ? (
					<p className="@sm:text-xs text-[10px] text-gray-500">No education listed.</p>
				) : (
					allEducation.map((item) => {
						// Check if it's education or certification
						const isEducation = "institution" in item;
						const uniqueKey = isEducation
							? `${item.institution}-${item.degree || ""}`
							: `${item.name}-${item.level || ""}`;

						return (
							<div className="rounded-sm border border-gray-300 bg-[#f9f9f9] @sm:p-4 p-3" key={uniqueKey}>
								{isEducation ? (
									<>
										<h3 className="mb-1 font-bold @sm:text-sm text-[#003366] text-xs">{item.institution}</h3>
										{item.degree && <p className="mb-2 @sm:text-xs text-[10px] text-gray-700">{item.degree}</p>}
										{item.location && <p className="mb-1 @sm:text-[10px] text-[9px] text-gray-600">{item.location}</p>}
										{(item.start_year || item.end_year) && (
											<p className="@sm:text-[10px] text-[9px] text-gray-600">
												{item.start_year} - {item.end_year || "Present"}
											</p>
										)}
									</>
								) : (
									<>
										<h3 className="mb-1 font-bold @sm:text-sm text-[#003366] text-xs">{item.name}</h3>
										{item.level && <p className="mb-2 @sm:text-xs text-[10px] text-gray-700">Level: {item.level}</p>}
										{item.year && <p className="@sm:text-[10px] text-[9px] text-gray-600">Year: {item.year}</p>}
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

function SkillsSection(props: { profile: LinkedInProfile; id: string }) {
	// Flatten all skills from different categories
	const allSkills = [
		...(props.profile.skills.programming_languages || []),
		...(props.profile.skills.frontend || []),
		...(props.profile.skills.backend_cloud || []),
		...(props.profile.skills.tools || []),
		...(props.profile.skills.frameworks || []),
	];

	return (
		<Section id={props.id} title="Skills">
			<div className="space-y-4">
				{allSkills.length === 0 ? (
					<p className="@sm:text-xs text-[10px] text-gray-500">No skills listed.</p>
				) : (
					<div className="flex flex-wrap gap-2">
						{allSkills.map((skill) => (
							<span
								className="cursor-default rounded-sm border border-[#a0a0a0] bg-[#dfe8f6] px-3 py-1.5 font-semibold @sm:text-xs text-[#003366] text-[10px] transition-colors hover:bg-[#c8d5e8]"
								key={skill}
								style={{
									boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(0,0,0,0.1)",
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

function ProjectsSection(props: { profile: LinkedInProfile; id: string }) {
	return (
		<Section id={props.id} title="Projects">
			<div className="space-y-4">
				{props.profile.projects.length === 0 ? (
					<p className="@sm:text-xs text-[10px] text-gray-500">No projects listed.</p>
				) : (
					props.profile.projects.map((project) => (
						<div
							className="rounded-sm border border-gray-300 bg-[#f9f9f9] @sm:p-4 p-3 transition-colors hover:border-[#003366]"
							key={project.name}
						>
							<h3 className="mb-2 font-bold @sm:text-sm text-[#003366] text-xs">{project.name}</h3>
							{project.description && (
								<div className="whitespace-pre-line @sm:text-xs text-[10px] text-gray-700 leading-relaxed">
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

function Section(props: { title: string; id?: string; children: React.ReactNode }) {
	return (
		<div className="mb-6 scroll-mt-6" id={props.id}>
			<h2 className="mb-3 border-[#003366] border-b-2 pb-2 font-bold @sm:text-base text-[#003366] text-sm">
				{props.title}
			</h2>
			{props.children}
		</div>
	);
}

function InfoRow(props: { label: string; value: string; href?: string }) {
	const content = (
		<div
			className={cn(
				"flex @sm:flex-row flex-col @sm:gap-2 gap-1 py-1 @sm:text-xs text-[10px]",
				props.href && "cursor-pointer transition-colors hover:bg-gray-100",
			)}
		>
			<span className="@sm:w-24 w-20 shrink-0 font-semibold text-gray-700">{props.label}:</span>
			<span className={cn("text-gray-600", props.href && "text-[#003366] underline")}>{props.value}</span>
		</div>
	);

	if (props.href) {
		return (
			<a href={props.href} rel="noopener noreferrer" target="_blank">
				{content}
			</a>
		);
	}

	return content;
}

function extractVanityName(url: string): string | null {
	const match = url.match(/\/in\/([^/?]+)/);
	return match ? match[1] : null;
}

function mobileSectionIdProvider(section: string) {
	return `section-${section}-mobile`;
}

function desktopSectionIdProvider(section: string) {
	return `section-${section}-desktop`;
}
