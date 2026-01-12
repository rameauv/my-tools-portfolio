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
  images: { url: string; name: string }[] | null;
}

export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline: string | null;
  profilePicture: string | null;
  vanityName: string | null;
  locale: string;
  positions: LinkedInPosition[];
  educations: LinkedInEducation[];
  diplomas: LinkedInDiploma[];
  languages: LinkedInLanguage[];
  skills: string[];
}

export interface LinkedInLanguage {
  language: string;
  proficiency:
    | "Native"
    | "Bilingual"
    | "Fluent"
    | "Professional Working"
    | "Basic"
    | "Elementary";
}
