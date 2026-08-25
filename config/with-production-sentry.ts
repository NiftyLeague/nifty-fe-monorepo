type SentryProject = 'nifty-league-web' | 'nifty-league-app' | 'nifty-smashers-web'
export type BuildEnvironment = 'production' | 'preview' | 'development'

/**
 * Build the shared Sentry options used by each Next app.
 *
 * Keeping this boundary shared prevents the three Next apps from drifting in
 * their source-map, telemetry, and webpack plugin settings. Each app keeps
 * its own dynamic wrapper import because Next and Sentry are app-local
 * dependencies rather than root-level dependencies.
 */
export function getProductionSentryOptions(project: SentryProject, env: BuildEnvironment) {
  return {
    org: 'niftyleague',
    project,
    authToken: process.env.SENTRY_AUTH_TOKEN,

    // Only print Sentry build logs in CI.
    silent: !process.env.CI,

    // Only upload source maps in production.
    sourcemaps: { disable: env !== 'production' },

    // Keep production source maps enabled without uploading every client chunk.
    // The widened upload increases build time and deployment bandwidth without
    // changing the browser error signal we collect.
    widenClientFileUpload: false,

    // Only enable internal plugin errors and performance data in production.
    telemetry: env === 'production',

    // Route browser requests to Sentry through a Next.js rewrite to circumvent
    // ad-blockers. This can increase server load and hosting cost.
    tunnelRoute: true,

    // Component annotations are useful in production errors, while route
    // manifests are not worth shipping on every initial route.
    routeManifestInjection: false as const,
    webpack: {
      reactComponentAnnotation: { enabled: true },
      treeshake: { removeDebugLogging: true },
    },
  }
}
