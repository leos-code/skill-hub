/**
 * Base URL for the site (origin + basePath). Used for sitemap, robots, metadata canonical/og:url.
 * Set NEXT_PUBLIC_SITE_URL in build (e.g. GitHub Actions env) for production.
 * Example: https://your-username.github.io/skill-hub
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://leos-code.github.io/skill-hub'

export const BASE_PATH = '/skill-hub'
