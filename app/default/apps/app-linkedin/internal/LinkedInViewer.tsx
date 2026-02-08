import { Camera, ChevronRight, Music, User } from "lucide-react";
import { useState } from "react";
import { cn } from "~/utils/cn";
import { linkedinData } from "./data";
import type { Certification, Education, LinkedInProfile } from "./types";

type Tab = "home" | "profile" | "diary" | "photo" | "guestbook";

// Helper functions
function extractNameParts(name: string): {
	firstName: string;
	lastName: string;
} {
	const parts = name.split(" ");
	if (parts.length === 0) return { firstName: "", lastName: "" };
	if (parts.length === 1) return { firstName: parts[0], lastName: "" };
	const lastName = parts[parts.length - 1];
	const firstName = parts.slice(0, -1).join(" ");
	return { firstName, lastName };
}

function extractVanityName(url: string): string | null {
	const match = url.match(/\/in\/([^/?]+)/);
	return match ? match[1] : null;
}

export function LinkedInViewer() {
	const [activeTab, setActiveTab] = useState<Tab>("home");
	const profile = linkedinData;

	if (!profile) return <div className="p-4">No profile data found.</div>;

	const nameParts = extractNameParts(profile.personal_information.name);
	const vanityName = extractVanityName(profile.personal_information.contact.linkedin);

	return (
		<div
			className="@container flex h-full w-full select-none items-center justify-center overflow-auto bg-[#b3b3b3] @@sm:p-4 p-2 font-sans"
			style={{
				backgroundImage: "radial-gradient(#999 1px, transparent 1px)",
				backgroundSize: "4px 4px",
			}}
		>
			{/* Main Binder Container */}
			<div className="relative flex @sm:h-[580px] h-auto min-h-[580px] w-full max-w-[850px] @sm:flex-row flex-col gap-2 @sm:rounded-xl rounded-lg bg-[#a0a0a0] @sm:p-3 p-2 shadow-2xl">
				{/* Inner White Container (The "Paper") */}
				<div className="relative flex h-full w-full @sm:flex-row flex-col rounded-lg border-2 border-white bg-white">
					{/* Left Panel */}
					<div className="flex @sm:h-full h-auto @sm:w-[240px] w-full shrink-0 flex-col @sm:gap-3 gap-2 border-gray-300 @sm:border-r border-b @sm:border-b-0 bg-[#f0f0f0] @sm:p-3 p-2">
						<div className="mb-1 rounded border border-gray-300 bg-white p-1 text-center text-gray-500 text-xs shadow-sm">
							TODAY <span className="font-bold text-red-500">28</span> | TOTAL <span className="font-bold">2026</span>
						</div>

						<div className="relative flex flex-1 flex-col items-center gap-4 overflow-hidden rounded border border-gray-300 bg-white p-4 shadow-sm">
							{/* Profile Pic */}
							<div className="mx-auto @sm:h-40 h-24 @sm:w-40 w-24 border border-gray-300 bg-gray-200 p-1">
								<img alt="Profile" className="h-full w-full object-cover" src="/my-documents.png" />
							</div>

							<div className="w-full space-y-2 text-center">
								<p className="border-gray-400 border-b border-dotted pb-2 text-blue-800 text-xs leading-relaxed">
									{profile.personal_information.job_title || "Software Engineer"}
								</p>

								<div className="mt-2 w-full space-y-1 px-2 text-left text-gray-600 text-xs">
									<div className="flex items-center gap-1">
										<span className="font-bold text-gray-800">Name</span>
										<span>
											{nameParts.firstName} {nameParts.lastName}
										</span>
									</div>
									<div className="flex items-center gap-1">
										<span className="font-bold text-gray-800">Birth</span>
										<span>199X.XX.XX</span>
									</div>
									<div className="flex items-center gap-1">
										<span className="font-bold text-gray-800">Sex</span>
										<span>Male</span>
									</div>
								</div>

								<div className="mt-4 w-full">
									<div className="flex cursor-pointer items-center justify-between text-[10px] text-gray-500 transition-colors hover:text-orange-500">
										<span>Edit Profile</span>
										<ChevronRight size={10} />
									</div>
									<div className="my-1 h-px w-full bg-gray-200" />
									<div className="flex cursor-pointer items-center justify-between text-[10px] text-gray-500 transition-colors hover:text-orange-500">
										<span>History</span>
										<ChevronRight size={10} />
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Panel (Content) */}
					<div className="relative z-10 flex h-full flex-1 flex-col bg-white @sm:p-2 p-1">
						{/* Header */}
						<div className="@sm:mb-2 mb-1 flex w-full @sm:flex-row flex-col @sm:items-end @sm:justify-between gap-1 border-gray-300 border-b @sm:px-2 px-1 @sm:pb-2 pb-1">
							<div className="font-bold @sm:text-lg text-blue-900 text-sm tracking-tight">
								{nameParts.firstName}'s Minihompy
							</div>
							<div className="@sm:mb-1 mb-0 truncate @sm:text-[10px] text-[9px] text-gray-500">
								http://www.cyworld.com/{vanityName || "valentin"}
							</div>
						</div>

						{/* Content Area */}
						<div className="custom-scrollbar flex-1 overflow-y-auto bg-white @sm:p-2 p-1">
							{activeTab === "home" && <HomeView profile={profile} />}
							{activeTab === "profile" && <ProfileView profile={profile} />}
							{activeTab === "diary" && <DiaryView profile={profile} />}
							{activeTab === "photo" && <PhotoView profile={profile} />}
							{activeTab === "guestbook" && <GuestbookView profile={profile} />}
						</div>
					</div>

					{/* Side Tabs - Desktop: Right side, Mobile: Bottom */}
					<div className="absolute top-10 -right-[76px] z-0 @sm:flex hidden flex-col gap-1">
						<TabButton active={activeTab === "home"} label="Home" onClick={() => setActiveTab("home")} />
						<TabButton active={activeTab === "profile"} label="Profile" onClick={() => setActiveTab("profile")} />
						<TabButton active={activeTab === "diary"} label="Diary" onClick={() => setActiveTab("diary")} />
						<TabButton active={activeTab === "photo"} label="Photo" onClick={() => setActiveTab("photo")} />
						<TabButton active={activeTab === "guestbook"} label="Guest" onClick={() => setActiveTab("guestbook")} />
					</div>

					{/* Mobile Tabs - Bottom */}
					<div className="flex @sm:hidden w-full gap-1 overflow-x-auto border-gray-300 border-t bg-[#f0f0f0] p-2">
						<TabButton active={activeTab === "home"} label="Home" mobile onClick={() => setActiveTab("home")} />
						<TabButton
							active={activeTab === "profile"}
							label="Profile"
							mobile
							onClick={() => setActiveTab("profile")}
						/>
						<TabButton active={activeTab === "diary"} label="Diary" mobile onClick={() => setActiveTab("diary")} />
						<TabButton active={activeTab === "photo"} label="Photo" mobile onClick={() => setActiveTab("photo")} />
						<TabButton
							active={activeTab === "guestbook"}
							label="Guest"
							mobile
							onClick={() => setActiveTab("guestbook")}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// -- Sub Components --

function TabButton(props: { label: string; active: boolean; onClick: () => void; mobile?: boolean }) {
	if (props.mobile) {
		return (
			<button
				className={cn(
					"flex shrink-0 items-center rounded-md border px-3 py-1.5 @sm:text-xs text-[10px] text-white transition-all",
					props.active
						? "border-gray-400 bg-white font-bold text-gray-800"
						: "border-[#1b7291] bg-[#238db4] hover:bg-[#2aa6d3]",
				)}
				onClick={props.onClick}
				type="button"
			>
				{props.label}
			</button>
		);
	}

	return (
		<button
			className={cn(
				"mb-0.5 flex h-[30px] w-[74px] items-center rounded-r-md border border-l-0 pl-2 text-white text-xs transition-all",
				props.active
					? "z-20 translate-x-[-2px] border-gray-400 border-l border-l-white bg-white font-bold text-gray-800"
					: "border-[#1b7291] bg-[#238db4] hover:bg-[#2aa6d3]",
			)}
			onClick={props.onClick}
			type="button"
		>
			{props.label}
		</button>
	);
}

function HomeView(props: { profile: LinkedInProfile }) {
	return (
		<div className="flex h-full flex-col @sm:gap-4 gap-2">
			{/* BGM Player Mock */}
			<div className="flex w-full items-center justify-between rounded-sm border border-gray-300 bg-[#efefef] @sm:p-1 p-0.5 @sm:px-2 px-1 @sm:text-[11px] text-[9px]">
				<div className="flex min-w-0 items-center @sm:gap-1 gap-0.5">
					<Music className="@sm:h-3 @sm:w-3 shrink-0 text-gray-500" size={10} />
					<span className="truncate font-bold text-gray-700">Now Playing: Developer's Life - Coding All Night.mp3</span>
				</div>
				<div className="flex shrink-0 @sm:gap-2 gap-1 text-gray-400">
					<span>◀</span>
					<span>II</span>
					<span>▶</span>
				</div>
			</div>

			{/* Latest Posts Preview */}
			<div className="@sm:mb-2 mb-1 flex @sm:gap-2 gap-1 @sm:px-1 px-0.5 @sm:text-[11px] text-[9px] text-gray-600">
				<span className="shrink-0 font-bold text-orange-500">News</span>
				<span className="flex-1 truncate">Updated portfolio with new projects!</span>
				<span className="@sm:inline hidden shrink-0 text-gray-400">10.28</span>
			</div>

			{/* Miniroom */}
			<div className="relative flex @sm:h-[250px] h-[180px] w-full flex-col items-center justify-center rounded border border-gray-300 bg-[#c3d6e2] @sm:p-4 p-2 shadow-inner">
				<div className="absolute @sm:top-2 top-1 @sm:left-2 left-1 @sm:text-[10px] text-[9px] text-gray-500">
					My Miniroom
				</div>

				{/* Simple CSS Art Room */}
				<div className="relative @sm:h-[180px] h-[120px] @sm:w-[300px] w-[200px]">
					{/* Floor */}
					<div className="absolute bottom-0 z-0 h-[60px] w-full origin-bottom-left skew-x-[-20deg] transform border-[#c0a880] border-t bg-[#e0cba8]"></div>
					{/* Wall L */}
					<div className="absolute top-0 left-0 z-0 h-[120px] w-[100px] origin-top-right skew-y-20 transform border-gray-300 border-r bg-[#eef4f8]"></div>
					{/* Wall R */}
					<div className="absolute top-0 right-0 z-0 h-[120px] w-[200px] bg-[#dcebf5]"></div>

					{/* Avatar (Pixel-ish) */}
					<div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 transform flex-col items-center">
						<div className="mb-1 h-8 w-8 rounded-full border-2 border-white bg-black"></div> {/* Head */}
						<div className="h-10 w-6 rounded-t-lg bg-blue-600"></div> {/* Body */}
						<div className="mt-1 whitespace-nowrap rounded border border-gray-400 bg-white px-2 py-0.5 text-[9px] shadow-sm">
							Welcome to my home!
						</div>
					</div>

					{/* Furniture: Desk */}
					<div className="absolute right-10 bottom-16 z-10 h-10 w-16 rounded-sm bg-amber-800">
						<div className="absolute -top-4 left-2 h-6 w-8 rounded-t-md border-2 border-gray-600 bg-black"></div>{" "}
						{/* Monitor */}
					</div>
				</div>
			</div>

			{/* What's Friends Say (Headline) */}
			<div className="@sm:mt-2 mt-1 border-gray-300 border-t border-dotted @sm:pt-2 pt-1">
				<h3 className="@sm:mb-2 mb-1 font-bold @sm:text-xs text-[10px] text-blue-800">Updated News</h3>
				<div className="@sm:space-y-1 space-y-0.5 @sm:text-[11px] text-[9px] text-gray-600">
					<p>• {props.profile.personal_information.job_title}</p>
					<p>
						• Currently working at{" "}
						{props.profile.work_experience.find((p) => p.end_date === "Present")?.company || "Unknown"}
					</p>
				</div>
			</div>
		</div>
	);
}

function ProfileView(props: { profile: LinkedInProfile }) {
	const vanityName = extractVanityName(props.profile.personal_information.contact.linkedin);
	return (
		<div className="@sm:p-2 p-1">
			<div className="rounded border border-gray-200 bg-[#fcfcfc] @sm:p-4 p-2 shadow-sm">
				<h2 className="@sm:mb-3 mb-2 border-gray-200 border-b pb-1 font-bold @sm:text-sm text-blue-800 text-xs">
					Intro
				</h2>
				<div className="whitespace-pre-line @sm:text-xs text-[10px] text-gray-700 leading-relaxed">
					{props.profile.summary}
				</div>

				<h2 className="@sm:mt-6 mt-4 @sm:mb-3 mb-2 border-gray-200 border-b pb-1 font-bold @sm:text-sm text-blue-800 text-xs">
					Contact
				</h2>
				<div className="@sm:space-y-2 space-y-1 @sm:text-xs text-[10px] text-gray-700">
					{props.profile.personal_information.location && (
						<p>
							<span className="inline-block @sm:w-16 w-12 font-bold">Location:</span>{" "}
							{props.profile.personal_information.location}
						</p>
					)}
					{vanityName && (
						<p>
							<span className="inline-block @sm:w-16 w-12 font-bold">ID:</span> {vanityName}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

function DiaryView(props: { profile: LinkedInProfile }) {
	return (
		<div className="@sm:space-y-6 space-y-4 @sm:p-2 p-1">
			{props.profile.work_experience.map((exp) => (
				<div className="bg-white" key={`${exp.company}-${exp.role}`}>
					{/* Date Header */}
					<div className="@sm:mb-2 mb-1 flex items-center @sm:gap-2 gap-1">
						<span className="font-bold @sm:text-[11px] text-[10px] text-orange-500">{exp.start_date || "Unknown"}</span>
						<div className="h-px flex-1 bg-gray-200"></div>
					</div>

					{/* Diary Entry */}
					<div className="rounded-sm border border-gray-200 bg-[#f9f9f9] @sm:p-4 p-2 shadow-sm">
						<h3 className="mb-1 font-bold @sm:text-sm text-gray-800 text-xs">{exp.role}</h3>
						<div className="@sm:mb-3 mb-2 flex flex-wrap items-center @sm:gap-2 gap-1 font-semibold @sm:text-xs text-[10px] text-blue-600">
							<span className="min-w-0">{exp.company}</span>
							{exp.location && (
								<span className="font-normal @sm:text-[10px] text-[9px] text-gray-400">({exp.location})</span>
							)}
						</div>

						<div className="whitespace-pre-wrap font-sans @sm:text-xs text-[10px] text-gray-600 leading-relaxed">
							{exp.description}
						</div>

						{/* Achievements */}
						{exp.achievements && exp.achievements.length > 0 && (
							<div className="@sm:mt-4 mt-2 space-y-1">
								{exp.achievements.map((achievement) => (
									<div className="@sm:text-xs text-[10px] text-gray-700" key={achievement}>
										• {achievement}
									</div>
								))}
							</div>
						)}
					</div>

					{/* Footer */}
					<div className="mt-1 text-right @sm:text-[10px] text-[9px] text-gray-400">
						Feeling: 💻 Productive | Weather: ☀️ Sunny
					</div>
				</div>
			))}
		</div>
	);
}

function PhotoView(props: { profile: LinkedInProfile }) {
	// Combine education and certifications into a photo gallery style
	const items: (Education | Certification)[] = [
		...(props.profile.education || []),
		...(props.profile.certifications || []),
	];

	return (
		<div className="grid @sm:grid-cols-2 grid-cols-1 @sm:gap-4 gap-2 @sm:p-2 p-1">
			{items.map((item) => {
				const uniqueKey =
					"institution" in item ? `${item.institution}-${item.degree || ""}` : `${item.name}-${item.level || ""}`;
				return (
					<div
						className="group flex cursor-pointer flex-col items-center border border-gray-300 bg-white @sm:p-2 p-1.5 text-center shadow-sm transition-colors hover:border-orange-300"
						key={uniqueKey}
					>
						<div className="@sm:mb-2 mb-1 flex aspect-square w-full items-center justify-center overflow-hidden border border-gray-200 bg-gray-100">
							<div className="text-gray-300 transition-colors group-hover:text-orange-300">
								<Camera className="@sm:h-8 @sm:w-8" size={24} />
							</div>
						</div>
						<h4 className="line-clamp-1 font-bold @sm:text-xs text-[10px] text-gray-800">
							{"institution" in item ? item.institution : item.name}
						</h4>
						<p className="@sm:text-[10px] text-[9px] text-gray-500">{"degree" in item ? item.degree : item.level}</p>
						<p className="@sm:mt-1 mt-0.5 @sm:text-[10px] text-[9px] text-gray-400">
							{"start_year" in item ? `${item.start_year} ~ ${item.end_year || ""}` : item.year}
						</p>
					</div>
				);
			})}

			{items.length === 0 && (
				<div className="@sm:col-span-2 col-span-1 @sm:py-10 py-6 text-center @sm:text-xs text-[10px] text-gray-400">
					No photos uploaded yet.
				</div>
			)}
		</div>
	);
}

function GuestbookView(props: { profile: LinkedInProfile }) {
	// Flatten skills object into a single array
	const allSkills = [
		...(props.profile.skills.programming_languages || []),
		...(props.profile.skills.frontend || []),
		...(props.profile.skills.backend_cloud || []),
		...(props.profile.skills.tools || []),
		...(props.profile.skills.frameworks || []),
	];

	return (
		<div className="@sm:space-y-4 space-y-3 @sm:p-2 p-1">
			{/* Write Entry Mock */}
			<div className="@sm:mb-6 mb-4 rounded-sm border border-gray-300 bg-[#f0f0f0] @sm:p-3 p-2">
				<div className="@sm:mb-2 mb-1 flex @sm:gap-2 gap-1">
					<div className="@sm:h-8 h-6 @sm:w-8 w-6 shrink-0 rounded-full bg-gray-300"></div>
					<div className="flex @sm:h-8 h-6 min-w-0 flex-1 items-center border border-gray-300 bg-white @sm:px-2 px-1 @sm:text-xs text-[10px] text-gray-400">
						Write a message...
					</div>
					<button
						className="shrink-0 whitespace-nowrap rounded-sm bg-[#238db4] @sm:px-3 px-2 @sm:text-xs text-[10px] text-white"
						type="button"
					>
						Ok
					</button>
				</div>
			</div>

			{/* Skill List as Guestbook Entries */}
			{allSkills.map((skill, index) => (
				<div className="@sm:mb-2 mb-1.5 border-gray-200 border-b bg-white @sm:pb-2 pb-1.5" key={skill}>
					<div className="mb-1 flex flex-wrap items-center justify-between gap-1 rounded-sm bg-[#f5f5f5] @sm:px-2 px-1 @sm:py-1 py-0.5">
						<div className="flex items-center @sm:gap-1 gap-0.5 @sm:text-[11px] text-[10px]">
							<span className="font-bold text-blue-800">NO. {allSkills.length - index}</span>
							<span className="@sm:ml-2 ml-1 font-bold text-gray-500">Recruiter</span>
							<span className="@sm:inline hidden text-gray-400">(2026.01.12)</span>
						</div>
						<div className="flex gap-1 @sm:text-[10px] text-[9px] text-gray-400">
							<span>Secret</span> | <span>Delete</span>
						</div>
					</div>

					<div className="flex @sm:gap-3 gap-2 @sm:px-2 px-1">
						<div className="flex @sm:h-16 h-12 @sm:w-16 w-12 shrink-0 items-center justify-center border border-gray-200 bg-gray-100">
							<User className="@sm:h-6 @sm:w-6 text-gray-300" size={18} />
						</div>
						<div className="min-w-0 flex-1 @sm:py-1 py-0.5 @sm:text-xs text-[10px] text-gray-700">
							<p>
								Wow! You are really good at{" "}
								<span className="bg-orange-50 @sm:px-1 px-0.5 font-bold text-orange-600">{skill}</span>!
							</p>
							<p className="@sm:mt-1 mt-0.5">We should definitely hire you.</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
