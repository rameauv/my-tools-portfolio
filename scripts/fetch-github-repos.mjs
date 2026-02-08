#!/usr/bin/env node

/**
 * GitHub Repositories Fetcher Script
 *
 * Fetches repositories from a GitHub user and generates a JSON file
 * with repository data matching the GithubRepo interface.
 *
 * Usage:
 *   node scripts/fetch-github-repos.mjs <username> [--output <path>] [--token <token>] [--oauth]
 *
 * Authentication options:
 *   --oauth              Use OAuth Device Flow to get a short-lived token (recommended)
 *   --token <token>      Use a provided token directly
 *   GITHUB_TOKEN         Use token from environment variable
 *
 * If no authentication is provided, the script will use OAuth Device Flow automatically.
 */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { setTimeout } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// GitHub API base URL
const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_OAUTH_BASE = "https://github.com/login/device/code";
const GITHUB_OAUTH_TOKEN_URL = "https://github.com/login/oauth/access_token";

// OAuth App Client ID (public, safe to include)
// This is a public OAuth app for GitHub CLI tools
const OAUTH_CLIENT_ID = "Iv23liAAvf3UhItTmdUX";

/**
 * Parse command-line arguments
 */
function parseArgs() {
	const args = process.argv.slice(2);
	const config = {
		username: null,
		output: null,
		token: null,
		useOAuth: false,
	};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		if (arg === "--output" && i + 1 < args.length) {
			config.output = args[++i];
		} else if (arg === "--token" && i + 1 < args.length) {
			config.token = args[++i];
		} else if (arg === "--oauth") {
			config.useOAuth = true;
		} else if (!arg.startsWith("--") && !config.username) {
			config.username = arg;
		}
	}

	// Get token from environment if not provided via flag
	if (!config.token && !config.useOAuth) {
		config.token = process.env.GITHUB_TOKEN || null;
	}

	// If no token and not explicitly using OAuth, default to OAuth
	if (!config.token && !config.useOAuth) {
		config.useOAuth = true;
	}

	// Default output path
	if (!config.output) {
		config.output = join(
			__dirname,
			"..",
			"app",
			"default",
			"apps",
			"shared",
			"projects",
			"github-repos",
			"githubRepos.json",
		);
	}

	return config;
}

/**
 * Initiate OAuth Device Flow
 */
async function initiateOAuthDeviceFlow() {
	const _params = new URLSearchParams({
		client_id: OAUTH_CLIENT_ID,
		scope: "public_repo read:user",
	});

	const response = await fetch(GITHUB_OAUTH_BASE, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			client_id: OAUTH_CLIENT_ID,
			scope: "public_repo read:user",
		}),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Failed to initiate OAuth flow: ${response.status} ${response.statusText}\n${errorText}`);
	}

	const data = await response.json();
	return {
		deviceCode: data.device_code,
		userCode: data.user_code,
		verificationUri: data.verification_uri,
		expiresIn: data.expires_in,
		interval: data.interval || 5,
	};
}

/**
 * Poll for OAuth access token
 */
async function pollForAccessToken(deviceCode, interval) {
	const maxAttempts = 120; // 10 minutes max (120 * 5 seconds)
	let attempts = 0;

	while (attempts < maxAttempts) {
		await setTimeout(interval * 1000);

		const response = await fetch(GITHUB_OAUTH_TOKEN_URL, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				client_id: OAUTH_CLIENT_ID,
				device_code: deviceCode,
				grant_type: "urn:ietf:params:oauth:grant-type:device_code",
			}),
		});

		const data = await response.json();

		if (data.access_token) {
			return data.access_token;
		}

		if (data.error === "authorization_pending") {
			attempts++;
			continue;
		}

		if (data.error === "slow_down") {
			// Increase interval if GitHub requests slower polling
			interval = data.interval || interval + 5;
			attempts++;
			continue;
		}

		if (data.error === "expired_token") {
			throw new Error("Device code expired. Please try again.");
		}

		if (data.error === "access_denied") {
			throw new Error("Access denied. Authorization was cancelled.");
		}

		throw new Error(`OAuth error: ${data.error}`);
	}

	throw new Error("OAuth authorization timed out. Please try again.");
}

/**
 * Get OAuth token using Device Flow
 */
async function getOAuthToken() {
	console.log("Initiating OAuth Device Flow...");
	const { deviceCode, userCode, verificationUri, interval } = await initiateOAuthDeviceFlow();

	console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
	console.log(`  Please visit: ${verificationUri}`);
	console.log(`  Enter code:   ${userCode}`);
	console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
	console.log("Waiting for authorization...");

	const accessToken = await pollForAccessToken(deviceCode, interval);
	console.log("✓ Authorization successful! Token obtained.\n");

	return accessToken;
}

/**
 * Make a GitHub API request with error handling
 */
async function fetchGitHubAPI(endpoint, token) {
	const url = `${GITHUB_API_BASE}${endpoint}`;
	const headers = {
		Accept: "application/vnd.github.v3+json",
		"User-Agent": "github-repos-fetcher",
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(url, { headers });

	if (response.status === 404) {
		throw new Error(`Resource not found: ${endpoint}`);
	}

	if (response.status === 401) {
		throw new Error("Authentication failed. Please check your GitHub token.");
	}

	if (response.status === 403) {
		const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
		if (rateLimitRemaining === "0") {
			const rateLimitReset = response.headers.get("x-ratelimit-reset");
			const resetDate = new Date(parseInt(rateLimitReset, 10) * 1000);
			throw new Error(`Rate limit exceeded. Reset at: ${resetDate.toISOString()}`);
		}
		throw new Error("Forbidden. You may not have access to this resource.");
	}

	if (response.status === 429) {
		const retryAfter = response.headers.get("retry-after");
		throw new Error(`Rate limit exceeded. Retry after ${retryAfter || "some time"}.`);
	}

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`GitHub API error (${response.status}): ${errorText}`);
	}

	return response;
}

/**
 * Fetch all repositories for a user (with pagination)
 */
async function fetchUserRepositories(username, token) {
	const repos = [];
	let page = 1;
	const perPage = 100; // Maximum per page

	while (true) {
		const endpoint = `/users/${username}/repos?page=${page}&per_page=${perPage}&sort=updated&direction=desc`;

		try {
			const response = await fetchGitHubAPI(endpoint, token);
			const pageRepos = await response.json();

			if (pageRepos.length === 0) {
				break;
			}

			repos.push(...pageRepos);

			// Check if there are more pages
			const linkHeader = response.headers.get("link");
			if (!linkHeader || !linkHeader.includes('rel="next"')) {
				break;
			}

			page++;
		} catch (error) {
			if (error.message.includes("not found")) {
				throw new Error(`User '${username}' not found on GitHub.`);
			}
			throw error;
		}
	}

	return repos;
}

/**
 * Fetch README content for a repository
 */
async function fetchReadmeContent(owner, repo, token) {
	try {
		const endpoint = `/repos/${owner}/${repo}/readme`;
		const response = await fetchGitHubAPI(endpoint, token);
		const readmeData = await response.json();

		if (readmeData.content) {
			// Decode Base64 content
			const content = Buffer.from(readmeData.content, "base64").toString("utf-8");
			return content;
		}

		return "";
	} catch (error) {
		// README not found or other error - return empty string
		if (error.message.includes("not found")) {
			return "";
		}
		// For other errors, log but continue
		console.warn(`Warning: Could not fetch README for ${owner}/${repo}: ${error.message}`);
		return "";
	}
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(dateString) {
	const date = new Date(dateString);
	return date.toISOString().split("T")[0];
}

/**
 * Generate JSON file content
 */
function generateJSONFile(repos) {
	// Clean up repos data for JSON output
	const reposData = repos.map((repo) => {
		const repoData = {
			id: repo.id,
			name: repo.name,
			description: repo.description || null,
			language: repo.language || null,
			updatedAt: repo.updatedAt,
			readmeContent: repo.readmeContent || "",
		};

		// Add optional fields only if they exist
		if (repo.htmlUrl) {
			repoData.htmlUrl = repo.htmlUrl;
		}
		if (repo.starsCount !== undefined) {
			repoData.starsCount = repo.starsCount;
		}
		if (repo.forksCount !== undefined) {
			repoData.forksCount = repo.forksCount;
		}
		if (repo.watchersCount !== undefined) {
			repoData.watchersCount = repo.watchersCount;
		}

		return repoData;
	});

	return JSON.stringify(reposData, null, 2);
}

/**
 * Main execution function
 */
async function main() {
	try {
		const config = parseArgs();

		if (!config.username) {
			console.error("Error: GitHub username is required.");
			console.error(
				"Usage: node scripts/fetch-github-repos.mjs <username> [--output <path>] [--token <token>] [--oauth]",
			);
			process.exit(1);
		}

		console.log(`Fetching repositories for user: ${config.username}`);

		// Get token via OAuth if requested
		let token = config.token;
		if (config.useOAuth && !token) {
			token = await getOAuthToken();
		} else if (token) {
			console.log("Using provided GitHub token for authentication");
		} else {
			console.log("Warning: No GitHub token provided. Rate limits may apply.");
		}

		// Fetch repositories
		console.log("Fetching repository list...");
		const repositories = await fetchUserRepositories(config.username, token);
		console.log(`Found ${repositories.length} repositories`);

		// Fetch README content for each repository
		console.log("Fetching README content...");
		const reposWithReadme = await Promise.all(
			repositories.map(async (repo) => {
				const readmeContent = await fetchReadmeContent(repo.owner.login, repo.name, token);

				const repoData = {
					id: String(repo.id),
					name: `${repo.name}.git`,
					description: repo.description || "",
					language: repo.language || "",
					updatedAt: formatDate(repo.updated_at),
					readmeContent: readmeContent,
				};

				// Add optional fields only if they exist
				if (repo.html_url) {
					repoData.htmlUrl = repo.html_url;
				}
				if (repo.stargazers_count !== undefined && repo.stargazers_count !== null) {
					repoData.starsCount = repo.stargazers_count;
				}
				if (repo.forks_count !== undefined && repo.forks_count !== null) {
					repoData.forksCount = repo.forks_count;
				}
				if (repo.watchers_count !== undefined && repo.watchers_count !== null) {
					repoData.watchersCount = repo.watchers_count;
				}

				return repoData;
			}),
		);

		// Generate JSON file
		console.log("Generating JSON file...");
		const fileContent = generateJSONFile(reposWithReadme);

		// Write file
		const outputPath = config.output;
		writeFileSync(outputPath, fileContent, "utf-8");
		console.log(`✓ Successfully generated: ${outputPath}`);
		console.log(`✓ Exported ${reposWithReadme.length} repositories`);
	} catch (error) {
		console.error("Error:", error.message);
		process.exit(1);
	}
}

// Run the script
main();
