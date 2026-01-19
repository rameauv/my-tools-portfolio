export interface GithubRepo {
	id: string;
	name: string;
	description: string | null;
	language: string | null;
	updatedAt: string;
	readmeContent: string;
	htmlUrl?: string;
	starsCount?: number;
	forksCount?: number;
	watchersCount?: number;
}
