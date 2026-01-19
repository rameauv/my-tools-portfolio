export interface GithubRepo {
	id: string;
	name: string;
	description: string | null;
	language: string | null;
	updatedAt: string;
	readmeContent: string;
}
