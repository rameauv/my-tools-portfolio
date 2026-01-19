import type { LinkedInProfile } from "./types";

export const linkedinData: LinkedInProfile = {
	personal_information: {
		name: "Valentin Rameau",
		job_title: "Software Engineer",
		location: "Seoul, Dongjak-gu",
		contact: {
			phone: "010-6540-2066",
			email: "valentin.rameau@outlook.fr",
			linkedin:
				"https://www.linkedin.com/in/valentin-rameau-3a1404112/",
		},
		visa_status: "E-7 visa",
	},
	summary:
		"Software engineer with 7 years of experience, currently on an E-7 visa. Expertise includes building large-scale platforms with Next.js and optimizing AWS infrastructure. Trilingual strength helping with global collaboration and service expansion. Spends free time developing a game for the PlayStation Vita.",
	work_experience: [
		{
			company: "빅인사이트그룹주식회사",
			role: "Software Engineer, permanent contract",
			location: "Seoul, South Korea",
			start_date: "2023-07",
			end_date: "Present",
			description: "I develop a marketing consulting platform.",
			achievements: [
				"Led the 4-month migration of a legacy Kotlin Spring/Angular stack to Next.js/tRPC, creating a unified type-safe environment and implementing automated testing to prevent regressions",
				"Reduced total hosting costs by 70% (~$830/month) by optimizing the codebase and right-sizing AWS infrastructure",
				"Partnered with a second developer to deploy LLM content generation and image vector search/auto-matching",
				"Led the DevOps side of the implementation, reducing blog production time from 40+ to ~10 minutes",
				"Continue to scale and improve the platform together as a two-developer team",
			],
		},
		{
			company: "Socrate Education",
			role: "Ionic/Angular developer, permanent contract",
			location: "Remote",
			start_date: "2020-03",
			end_date: "2023-06",
			description:
				'I developed a social network focused on knowledge sharing, "Socrate" (4.5 stars on the Play Store).',
			achievements: [
				"Used the Scrum framework, defined the code architecture/design and implemented it with other developers",
				"Conducted E2E testing using Cypress",
				"Developed the application from scratch with other developers",
			],
		},
		{
			company: "Acensi Finance",
			role: ".Net/C# Software Engineer - Training Program",
			location: "Paris, France",
			start_date: "2019-09",
			end_date: "2020-02",
			description:
				"Participated in an internal consultant training program focused on investment-banking software systems",
			achievements: [
				"Built a non-production, real-time market risk analysis platform through supervised case studies using ASP.NET Core and MS SQL",
				"Applied TDD, Clean Code principles, and common design patterns in a controlled training environment",
			],
		},
	],
	education: [
		{
			institution: "Epitech",
			degree: "CS Master's degree",
			location: "Lyon, France",
			start_year: "2015",
			end_year: "2020",
		},
	],
	skills: {
		programming_languages: [
			"TypeScript",
			"Javascript",
			"C#",
		],
		frontend: [
			"Next.js",
			"React",
			"Angular",
			"Ionic",
		],
		backend_cloud: [
			"Node.js",
			"ASP.NET Core",
			"AWS (EC2, S3)",
			"Docker",
			"tRPC",
		],
		tools: ["Git", "Cypress (E2E)"],
		frameworks: ["Scrum"],
	},
	projects: [
		{
			name: "Swiper.js library contribution",
			description:
				"Had a bugfix merged in the Swiper.js library linked to preloading (JS)",
		},
		{
			name: "Morphman Anki plugin",
			description:
				"Extended Morphman to support Korean and contributed bug fixes linked to the switch to QT6 (Python 3)",
		},
		{
			name: "Breezy-weather app",
			description:
				"Extended the breezy-weather app to support the Korea Meteorological Administration open API (Kotlin)",
		},
		{
			name: "Conway's Game of Life",
			description:
				"Implemented the Conway's Game of Life on the PlayStation Vita (C)",
		},
	],
	languages: [
		{
			language: "English",
			proficiency: "Professional working proficiency",
		},
		{
			language: "Korean",
			proficiency: "TOPIK Level 5",
		},
		{
			language: "French",
			proficiency: "Native",
		},
	],
	certifications: [
		{
			name: "TOPIK (한국어능력시험)",
			level: "Level 5",
			year: "2023",
		},
	],
} as const;
