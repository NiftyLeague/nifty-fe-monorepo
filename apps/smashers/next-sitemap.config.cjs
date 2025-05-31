const HIGH_PRIORITY_PATHS = ['/'];
const MID_PRIORITY_PATHS = ['/android', '/ios', '/epic', '/steam', '/loot'];
const LOW_PRIORITY_PATHS = ['/login', '/profile'];
const ALL_PATHS = [...HIGH_PRIORITY_PATHS, ...MID_PRIORITY_PATHS, ...LOW_PRIORITY_PATHS];

function customPathPriority(path) {
  if (HIGH_PRIORITY_PATHS.includes(path)) return '1.0';
  if (MID_PRIORITY_PATHS.includes(path)) return '0.7';
  if (LOW_PRIORITY_PATHS.includes(path)) return '0.4';
  return '0.4';
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://niftysmashers.com',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/invite/'],
      },
    ],
  },
  generateIndexSitemap: false,
  exclude: ['/api/*', '/invite/*'],
  transform: async (config, path) => {
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: customPathPriority(path),
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  /**
   * Add additional paths to the sitemap that are not automatically discovered
   * by next-sitemap. In this case, we add app store redirects or other paths,
   * which are not regular Next.js pages, but are still important to include.
   *
   * @param {object} config - The Next.js sitemap configuration object.
   * @returns {Promise<object[]>} - A promise that resolves with an array of
   *   objects, each of which represents a URL that should be in the sitemap.
   */
  additionalPaths: async config =>
    ALL_PATHS.map(path => ({
      loc: path,
      changefreq: config.changefreq,
      priority: customPathPriority(path),
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    })),
};
