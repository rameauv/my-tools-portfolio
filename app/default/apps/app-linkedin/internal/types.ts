// Legacy types kept for backward compatibility
export interface LinkedInPosition {
	title: string;
	companyName: string;
	companyUrl: string | null;
	companyLogo: string | null;
	startDate: string | null;
	endDate: string | null;
	description: string | null;
	isCurrent: boolean;
	location: string | null;
	locationType: "office" | "remote" | "hybrid";
	images: string[] | null;
	skills: string[];
}

export interface LinkedInEducation {
	schoolName: string;
	schoolUrl: string | null;
	schoolLogo: string | null;
	degree: string | null;
	fieldOfStudy: string | null;
	startYear: number | null;
	startMonth: number | null;
	endYear: number | null;
	endMonth: number | null;
	grade: string | null;
	images: string[] | null;
}

export interface LinkedInDiploma {
	name: string;
	issuingOrganization: string;
	issuedDate: string | null;
	expirationDate: string | null;
	CredentialID: string;
	images: { url: string; name: string }[] | null;
}

// New types matching the data structure
export interface Contact {
	phone: string;
	email: string;
	linkedin: string;
}

export interface PersonalInformation {
	name: string;
	job_title: string;
	location: string;
	contact: Contact;
	visa_status: string;
}

export interface WorkExperience {
	company: string;
	role: string;
	location: string;
	start_date: string;
	end_date: string;
	description: string;
	achievements: string[];
}

export interface Education {
	institution: string;
	degree: string;
	location: string;
	start_year: string;
	end_year: string;
}

export interface Skills {
	programming_languages: string[];
	frontend: string[];
	backend_cloud: string[];
	tools: string[];
	frameworks: string[];
}

export interface Project {
	name: string;
	description: string;
}

export interface Certification {
	name: string;
	level: string;
	year: string;
}

export interface LinkedInLanguage {
	language: string;
	proficiency: string; // Changed to string to accommodate values like "TOPIK Level 5"
}

export interface LinkedInProfile {
	personal_information: PersonalInformation;
	summary: string;
	work_experience: WorkExperience[];
	education: Education[];
	skills: Skills;
	projects: Project[];
	languages: LinkedInLanguage[];
	certifications: Certification[];
}
