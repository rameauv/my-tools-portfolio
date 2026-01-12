#!/usr/bin/env node

/**
 * LinkedIn Profile Fetcher Script
 * 
 * Fetches LinkedIn profile data using the LinkedIn API and generates a TypeScript file
 * with profile data in all available locales.
 * 
 * Usage:
 *   node scripts/fetch-linkedin-profile.mjs [--client-id <id>] [--client-secret <secret>] [--output <path>]
 * 
 * Authentication options:
 *   --client-id <id>        LinkedIn OAuth Client ID
 *   --client-secret <secret> LinkedIn OAuth Client Secret
 *   LINKEDIN_CLIENT_ID       Client ID from environment variable
 *   LINKEDIN_CLIENT_SECRET   Client Secret from environment variable
 * 
 * The script will open your browser for OAuth authorization.
 * 
 * Required LinkedIn App Scopes:
 *   - openid: OpenID Connect authentication
 *   - profile: Basic profile information
 *   - email: Email address
 * 
 * Note: The deprecated r_liteprofile and r_fullprofile scopes are not used.
 *       Positions, Education, and Skills endpoints may require additional LinkedIn
 *       API permissions or Partner Program access.
 */

import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { createHash, randomBytes } from 'crypto';
import { setTimeout } from 'timers/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// LinkedIn API endpoints
const LINKEDIN_AUTH_BASE = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_API_BASE = 'https://api.linkedin.com/v2';
const REDIRECT_URI = 'http://localhost:3456/callback';
const PORT = 3456;

/**
 * @typedef {Object} Config
 * @property {string|null} clientId
 * @property {string|null} clientSecret
 * @property {string|null} output
 */

/**
 * Parse command-line arguments
 * @returns {Config}
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    clientId: null,
    clientSecret: null,
    output: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--client-id' && i + 1 < args.length) {
      config.clientId = args[++i];
    } else if (arg === '--client-secret' && i + 1 < args.length) {
      config.clientSecret = args[++i];
    } else if (arg === '--output' && i + 1 < args.length) {
      config.output = args[++i];
    }
  }

  // Get credentials from environment if not provided via flags
  if (!config.clientId) {
    config.clientId = process.env.LINKEDIN_CLIENT_ID || null;
  }
  if (!config.clientSecret) {
    config.clientSecret = process.env.LINKEDIN_CLIENT_SECRET || null;
  }

  // Default output path
  if (!config.output) {
    config.output = join(__dirname, '..', 'app', 'welcome', 'apps', 'app-two', 'linkedinProfile.ts');
  }

  return config;
}

/**
 * Generate PKCE code verifier and challenge
 * @returns {{codeVerifier: string, codeChallenge: string}}
 */
function generatePKCE() {
  const codeVerifier = randomBytes(32).toString('base64url');
  const codeChallenge = createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  return { codeVerifier, codeChallenge };
}

/**
 * Start local HTTP server to receive OAuth callback
 * @param {string} codeVerifier
 * @returns {Promise<string>} Authorization code
 */
function startCallbackServer(codeVerifier) {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      if (req.url?.startsWith('/callback')) {
        const url = new URL(req.url, `http://localhost:${PORT}`);
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
          const errorDescription = url.searchParams.get('error_description') || 'No description provided';
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body>
                <h1>Authorization Failed</h1>
                <p><strong>Error:</strong> ${error}</p>
                <p><strong>Description:</strong> ${errorDescription}</p>
                <p>You can close this window.</p>
              </body>
            </html>
          `);
          server.close();
          reject(new Error(`OAuth error: ${error} - ${errorDescription}`));
          return;
        }

        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body>
                <h1>Authorization Successful!</h1>
                <p>You can close this window and return to the terminal.</p>
              </body>
            </html>
          `);
          server.close();
          resolve(code);
        } else {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body>
                <h1>Authorization Failed</h1>
                <p>No authorization code received.</p>
                <p>You can close this window.</p>
              </body>
            </html>
          `);
          server.close();
          reject(new Error('No authorization code received'));
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    server.listen(PORT, () => {
      console.log(`Callback server listening on http://localhost:${PORT}`);
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error('Authorization timeout. Please try again.'));
    }, 5 * 60 * 1000);
  });
}

/**
 * Open URL in default browser
 * @param {string} url
 */
async function openBrowser(url) {
  const platform = process.platform;
  let command;

  if (platform === 'darwin') {
    command = `open "${url}"`;
  } else if (platform === 'win32') {
    command = `start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }

  try {
    await execAsync(command);
  } catch (error) {
    console.warn(`Could not open browser automatically. Please visit: ${url}`);
  }
}

/**
 * Exchange authorization code for access token
 * @param {string} code
 * @param {string} codeVerifier
 * @param {string} clientId
 * @param {string} clientSecret
 * @returns {Promise<string>} Access token
 */
async function exchangeCodeForToken(code, codeVerifier, clientId, clientSecret) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    client_id: clientId,
    client_secret: clientSecret,
    code_verifier: codeVerifier,
  });

  const response = await fetch(LINKEDIN_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to exchange code for token: ${response.status} ${response.statusText}\n${errorText}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error('No access token in response');
  }

  return data.access_token;
}

/**
 * Get OAuth access token using Authorization Code flow with PKCE
 * @param {string} clientId
 * @param {string} clientSecret
 * @returns {Promise<string>} Access token
 */
async function getAccessToken(clientId, clientSecret) {
  const { codeVerifier, codeChallenge } = generatePKCE();
  const state = randomBytes(16).toString('hex');

  // Scopes for LinkedIn API (OpenID Connect)
  // Note: r_liteprofile and r_fullprofile are deprecated
  // Using OpenID Connect scopes only
  // IMPORTANT: These scopes must be enabled in your LinkedIn app settings
  // Go to: https://www.linkedin.com/developers/apps -> Your App -> Auth tab -> Scopes
  const scopes = [
    'openid',
    'profile',
    'email',
  ].join(' ');
  
  console.log(`Requesting scopes: ${scopes}`);
  console.log('\n⚠️  IMPORTANT: Make sure these scopes are enabled in your LinkedIn app:');
  console.log('   1. Go to https://www.linkedin.com/developers/apps');
  console.log('   2. Select your app');
  console.log('   3. Go to the "Auth" tab');
  console.log('   4. Under "OAuth 2.0 scopes", ensure these are checked:');
  console.log('      - openid');
  console.log('      - profile');
  console.log('      - email');
  console.log('   5. Save your changes\n');

  const authUrl = new URL(LINKEDIN_AUTH_BASE);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Opening browser for LinkedIn authorization...');
  console.log('  If browser does not open, visit:');
  console.log(`  ${authUrl.toString()}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Start callback server
  const codePromise = startCallbackServer(codeVerifier);

  // Open browser
  await openBrowser(authUrl.toString());

  console.log('Waiting for authorization...');

  // Wait for authorization code
  const code = await codePromise;

  console.log('✓ Authorization code received');
  console.log('Exchanging code for access token...');

  // Exchange code for token
  const accessToken = await exchangeCodeForToken(code, codeVerifier, clientId, clientSecret);

  console.log('✓ Access token obtained\n');

  return accessToken;
}

/**
 * Make a LinkedIn API request with error handling and retry logic
 * @param {string} endpoint
 * @param {string} accessToken
 * @param {string} [locale] Optional locale for Accept-Language header
 * @param {number} [retries=3] Number of retry attempts
 * @returns {Promise<Response>}
 */
async function fetchLinkedInAPI(endpoint, accessToken, locale = null, retries = 3) {
  const url = `${LINKEDIN_API_BASE}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Accept': 'application/json',
  };

  if (locale) {
    headers['Accept-Language'] = locale;
  }

  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, { headers });

      if (response.status === 401) {
        throw new Error('Authentication failed. Token may have expired.');
      }

      if (response.status === 403) {
        throw new Error('Forbidden. You may not have access to this resource or your app may need additional permissions.');
      }

      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : (attempt + 1) * 2000;
        if (attempt < retries - 1) {
          console.warn(`Rate limit hit. Waiting ${waitTime / 1000}s before retry...`);
          await setTimeout(waitTime);
          continue;
        }
        throw new Error(`Rate limit exceeded. Retry after ${retryAfter || 'some time'}.`);
      }

      if (response.status === 404) {
        // Some endpoints may not be available, return null to indicate missing data
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LinkedIn API error (${response.status}): ${errorText}`);
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < retries - 1 && !error.message.includes('Authentication') && !error.message.includes('Forbidden')) {
        await setTimeout((attempt + 1) * 1000);
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}

/**
 * Fetch basic profile information using OpenID Connect userinfo endpoint
 * @param {string} accessToken
 * @param {string} [locale]
 * @returns {Promise<Object|null>}
 */
async function fetchProfile(accessToken, locale = null) {
  try {
    // Try OpenID Connect /userinfo endpoint first
    let response = await fetchLinkedInAPI('/userinfo', accessToken, locale);
    if (response) {
      const data = await response.json();
      // Transform userinfo response to match expected format
      return {
        id: data.sub || data.id,
        firstName: data.given_name || data.firstName,
        lastName: data.family_name || data.lastName,
        email: data.email,
        picture: data.picture,
      };
    }
    
    // Fallback to /me endpoint
    response = await fetchLinkedInAPI('/me', accessToken, locale);
    if (!response) return null;
    return await response.json();
  } catch (error) {
    console.warn(`Warning: Could not fetch profile${locale ? ` for locale ${locale}` : ''}: ${error.message}`);
    return null;
  }
}

/**
 * Fetch profile with additional fields using projection or userinfo
 * @param {string} accessToken
 * @param {string} [locale]
 * @returns {Promise<Object|null>}
 */
async function fetchProfileWithFields(accessToken, locale = null) {
  try {
    // First try /userinfo endpoint (OpenID Connect standard)
    let response = await fetchLinkedInAPI('/userinfo', accessToken, locale);
    if (response) {
      const data = await response.json();
      // Transform userinfo response to match expected format
      return {
        id: data.sub || data.id,
        firstName: data.given_name || data.firstName,
        lastName: data.family_name || data.lastName,
        email: data.email,
        picture: data.picture,
        profilePicture: data.picture ? { 'displayImage~': { elements: [{ identifiers: [{ identifier: data.picture }] }] } } : null,
      };
    }
    
    // Fallback: Try /me endpoint with projection (may require additional permissions)
    const projection = '(id,firstName,lastName,profilePicture(displayImage~:playableStreams),headline,vanityName)';
    response = await fetchLinkedInAPI(`/me?projection=${projection}`, accessToken, locale);
    if (!response) return null;
    return await response.json();
  } catch (error) {
    console.warn(`Warning: Could not fetch profile with fields${locale ? ` for locale ${locale}` : ''}: ${error.message}`);
    return null;
  }
}

/**
 * Fetch positions/experiences
 * Note: This endpoint may require additional LinkedIn API permissions or Partner Program access
 * @param {string} accessToken
 * @param {string} [locale]
 * @returns {Promise<Array>}
 */
async function fetchPositions(accessToken, locale = null) {
  try {
    // Try the Profile API endpoint (may require additional permissions)
    const response = await fetchLinkedInAPI('/me/positions', accessToken, locale);
    if (!response) return [];
    const data = await response.json();
    return data.elements || [];
  } catch (error) {
    // Silently fail - this endpoint may not be available with basic OpenID Connect scopes
    return [];
  }
}

/**
 * Fetch education
 * Note: This endpoint may require additional LinkedIn API permissions or Partner Program access
 * @param {string} accessToken
 * @param {string} [locale]
 * @returns {Promise<Array>}
 */
async function fetchEducations(accessToken, locale = null) {
  try {
    // Try the Profile API endpoint (may require additional permissions)
    const response = await fetchLinkedInAPI('/me/educations', accessToken, locale);
    if (!response) return [];
    const data = await response.json();
    return data.elements || [];
  } catch (error) {
    // Silently fail - this endpoint may not be available with basic OpenID Connect scopes
    return [];
  }
}

/**
 * Fetch skills
 * Note: This endpoint may require additional LinkedIn API permissions or Partner Program access
 * @param {string} accessToken
 * @param {string} [locale]
 * @returns {Promise<Array>}
 */
async function fetchSkills(accessToken, locale = null) {
  try {
    // Try the Profile API endpoint (may require additional permissions)
    const response = await fetchLinkedInAPI('/me/skills', accessToken, locale);
    if (!response) return [];
    const data = await response.json();
    return data.elements || [];
  } catch (error) {
    // Silently fail - this endpoint may not be available with basic OpenID Connect scopes
    return [];
  }
}

/**
 * Get available locales from profile
 * @param {string} accessToken
 * @returns {Promise<string[]>}
 */
async function getAvailableLocales(accessToken) {
  try {
    // Fetch profile without locale to get default, then try common locales
    const defaultProfile = await fetchProfile(accessToken);
    if (!defaultProfile) return ['en_US'];

    // Common LinkedIn locales
    const commonLocales = [
      'en_US', 'en_GB', 'fr_FR', 'de_DE', 'es_ES', 'it_IT',
      'pt_BR', 'ja_JP', 'zh_CN', 'ko_KR', 'nl_NL', 'sv_SE',
      'da_DK', 'fi_FI', 'no_NO', 'pl_PL', 'ru_RU', 'tr_TR',
    ];

    const availableLocales = ['en_US']; // Always include default

    // Test which locales return data
    for (const locale of commonLocales) {
      const profile = await fetchProfile(accessToken, locale);
      if (profile && profile.id) {
        availableLocales.push(locale);
      }
      // Small delay to avoid rate limits
      await setTimeout(100);
    }

    return availableLocales;
  } catch (error) {
    console.warn(`Warning: Could not determine available locales: ${error.message}`);
    return ['en_US'];
  }
}

/**
 * Format date from LinkedIn format
 * @param {Object|null} dateObj LinkedIn date object with year/month
 * @returns {string|null}
 */
function formatDate(dateObj) {
  if (!dateObj) return null;
  const year = dateObj.year || '';
  const month = dateObj.month ? String(dateObj.month).padStart(2, '0') : '01';
  const day = dateObj.day ? String(dateObj.day).padStart(2, '0') : '01';
  if (!year) return null;
  return `${year}-${month}-${day}`;
}

/**
 * Extract profile picture URL from LinkedIn response
 * @param {Object} profilePicture
 * @returns {string|null}
 */
function extractProfilePictureUrl(profilePicture) {
  if (!profilePicture || !profilePicture['displayImage~']) {
    return null;
  }

  const streams = profilePicture['displayImage~'].elements;
  if (!streams || streams.length === 0) {
    return null;
  }

  // Get the largest image
  const sortedStreams = streams.sort((a, b) => {
    const aSize = (a.width || 0) * (a.height || 0);
    const bSize = (b.width || 0) * (b.height || 0);
    return bSize - aSize;
  });

  return sortedStreams[0].identifiers?.[0]?.identifier || null;
}

/**
 * Extract localized string from LinkedIn field
 * @param {string|Object} field LinkedIn field (can be string or object with localized property)
 * @param {string} locale Locale to extract
 * @returns {string}
 */
function extractLocalizedString(field, locale) {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (field.localized && field.localized[locale]) return field.localized[locale];
  if (field.localized) {
    // Fallback to first available locale
    const locales = Object.keys(field.localized);
    if (locales.length > 0) return field.localized[locales[0]];
  }
  return '';
}

/**
 * Transform LinkedIn position data
 * @param {Object} position
 * @param {string} locale
 * @returns {Object}
 */
function transformPosition(position, locale) {
  return {
    title: extractLocalizedString(position.title, locale) || '',
    companyName: extractLocalizedString(position.companyName, locale) || '',
    startDate: formatDate(position.timePeriod?.startDate),
    endDate: formatDate(position.timePeriod?.endDate),
    description: extractLocalizedString(position.description, locale) || null,
  };
}

/**
 * Transform LinkedIn education data
 * @param {Object} education
 * @param {string} locale
 * @returns {Object}
 */
function transformEducation(education, locale) {
  return {
    schoolName: extractLocalizedString(education.schoolName, locale) || '',
    degree: extractLocalizedString(education.degree, locale) || null,
    fieldOfStudy: extractLocalizedString(education.fieldOfStudy, locale) || null,
    startDate: formatDate(education.timePeriod?.startDate),
    endDate: formatDate(education.timePeriod?.endDate),
  };
}

/**
 * Transform LinkedIn skill data
 * @param {Object} skill
 * @param {string} locale
 * @returns {string}
 */
function transformSkill(skill, locale) {
  return extractLocalizedString(skill.name, locale) || '';
}

/**
 * Escape TypeScript string content
 * @param {string} str
 * @returns {string}
 */
function escapeTypeScriptString(str) {
  if (!str) return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

/**
 * Generate TypeScript file content
 * @param {Record<string, Object>} profilesByLocale
 * @returns {string}
 */
function generateTypeScriptFile(profilesByLocale) {
  const interfaces = `export interface LinkedInPosition {
  title: string;
  companyName: string;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface LinkedInEducation {
  schoolName: string;
  degree: string | null;
  fieldOfStudy: string | null;
  startDate: string | null;
  endDate: string | null;
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
  skills: string[];
}`;

  const profilesObject = Object.entries(profilesByLocale).map(([locale, profile]) => {
    const positions = profile.positions.map(pos => {
      return `    {
      title: ${JSON.stringify(pos.title)},
      companyName: ${JSON.stringify(pos.companyName)},
      startDate: ${pos.startDate ? JSON.stringify(pos.startDate) : 'null'},
      endDate: ${pos.endDate ? JSON.stringify(pos.endDate) : 'null'},
      description: ${pos.description ? JSON.stringify(pos.description) : 'null'}
    }`;
    }).join(',\n');

    const educations = profile.educations.map(edu => {
      return `    {
      schoolName: ${JSON.stringify(edu.schoolName)},
      degree: ${edu.degree ? JSON.stringify(edu.degree) : 'null'},
      fieldOfStudy: ${edu.fieldOfStudy ? JSON.stringify(edu.fieldOfStudy) : 'null'},
      startDate: ${edu.startDate ? JSON.stringify(edu.startDate) : 'null'},
      endDate: ${edu.endDate ? JSON.stringify(edu.endDate) : 'null'}
    }`;
    }).join(',\n');

    const skills = profile.skills.map(skill => JSON.stringify(skill)).join(', ');

    return `  ${JSON.stringify(locale)}: {
    id: ${JSON.stringify(profile.id)},
    firstName: ${JSON.stringify(profile.firstName)},
    lastName: ${JSON.stringify(profile.lastName)},
    headline: ${profile.headline ? JSON.stringify(profile.headline) : 'null'},
    profilePicture: ${profile.profilePicture ? JSON.stringify(profile.profilePicture) : 'null'},
    vanityName: ${profile.vanityName ? JSON.stringify(profile.vanityName) : 'null'},
    locale: ${JSON.stringify(profile.locale)},
    positions: [
${positions}
    ],
    educations: [
${educations}
    ],
    skills: [${skills}]
  }`;
  }).join(',\n');

  return `${interfaces}

export const linkedinProfiles: Record<string, LinkedInProfile> = {
${profilesObject}
};
`;
}

/**
 * Main execution function
 */
async function main() {
  try {
    const config = parseArgs();

    if (!config.clientId || !config.clientSecret) {
      console.error('Error: LinkedIn Client ID and Client Secret are required.');
      console.error('Usage: node scripts/fetch-linkedin-profile.mjs --client-id <id> --client-secret <secret>');
      console.error('Or set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET environment variables.');
      process.exit(1);
    }

    console.log('Fetching LinkedIn profile data...\n');

    // Get access token
    const accessToken = await getAccessToken(config.clientId, config.clientSecret);

    // Get available locales
    console.log('Determining available locales...');
    const locales = await getAvailableLocales(accessToken);
    console.log(`Found ${locales.length} locale(s): ${locales.join(', ')}\n`);

    // Fetch profile data for each locale
    const profilesByLocale = {};

    for (const locale of locales) {
      console.log(`Fetching profile data for locale: ${locale}`);

      // Fetch profile with fields
      const profileWithFields = await fetchProfileWithFields(accessToken, locale);
      const basicProfile = await fetchProfile(accessToken, locale);
      
      if (!basicProfile && !profileWithFields) {
        console.warn(`  Skipping locale ${locale} - no profile data available`);
        continue;
      }

      const profile = profileWithFields || basicProfile;

      // Fetch additional data
      const positions = await fetchPositions(accessToken, locale);
      const educations = await fetchEducations(accessToken, locale);
      const skills = await fetchSkills(accessToken, locale);

      // Transform data - handle both userinfo format and regular API format
      const firstName = profile.given_name || extractLocalizedString(profile.firstName, locale) || '';
      const lastName = profile.family_name || extractLocalizedString(profile.lastName, locale) || '';
      const profilePic = profile.picture 
        ? profile.picture 
        : extractProfilePictureUrl(profile.profilePicture);
      
      profilesByLocale[locale] = {
        id: profile.sub || profile.id || '',
        firstName: firstName,
        lastName: lastName,
        headline: extractLocalizedString(profile.headline, locale) || profile.headline || null,
        profilePicture: profilePic,
        vanityName: profile.vanityName || null,
        locale: locale,
        positions: positions.map(pos => transformPosition(pos, locale)),
        educations: educations.map(edu => transformEducation(edu, locale)),
        skills: skills.map(skill => transformSkill(skill, locale)).filter(Boolean),
      };

      // Small delay between locales to avoid rate limits
      if (locale !== locales[locales.length - 1]) {
        await setTimeout(200);
      }
    }

    if (Object.keys(profilesByLocale).length === 0) {
      throw new Error('No profile data could be fetched. Please check your API permissions.');
    }

    // Generate TypeScript file
    console.log('\nGenerating TypeScript file...');
    const fileContent = generateTypeScriptFile(profilesByLocale);

    // Write file
    const outputPath = config.output;
    writeFileSync(outputPath, fileContent, 'utf-8');
    console.log(`✓ Successfully generated: ${outputPath}`);
    console.log(`✓ Exported ${Object.keys(profilesByLocale).length} profile locale(s)`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('invalid_scope_error') || error.message.includes('invalid_scope')) {
      console.error('\n📋 Scope Configuration Issue:');
      console.error('   The requested scopes are not enabled in your LinkedIn app.');
      console.error('\n   To fix this:');
      console.error('   1. Visit https://www.linkedin.com/developers/apps');
      console.error('   2. Select your LinkedIn app');
      console.error('   3. Navigate to the "Auth" tab');
      console.error('   4. Scroll to "OAuth 2.0 scopes" section');
      console.error('   5. Enable these scopes:');
      console.error('      ✓ openid');
      console.error('      ✓ profile');
      console.error('      ✓ email');
      console.error('   6. Click "Update" to save');
      console.error('   7. Wait a few minutes for changes to propagate');
      console.error('   8. Run this script again\n');
    }
    
    process.exit(1);
  }
}

// Run the script
main();
