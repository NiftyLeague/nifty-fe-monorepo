// This file sets a custom webpack configuration to use your Next.js app with Sentry
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const ENV = (process.env.VERCEL_ENV as 'production' | 'preview' | undefined) ?? 'development'

const nextConfig: NextConfig = {
  transpilePackages: ['@nl/imx-passport', '@nl/ui'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Keep the Webpack compatibility path for explicit `next build --webpack`
  // fallback runs; local development uses Turbopack for faster iteration.
  // serverExternalPackages: ['pino-pretty', 'lokijs', 'encoding', 'sodium-native', 'require-addon'],
  webpack: (config, { isServer }) => {
    // Map @wagmi/core connectors package to wagmi/connectors to avoid ESM issues
    config.resolve.alias = { ...config.resolve.alias, '@wagmi/connectors': 'wagmi/connectors' }
    // Externalize native modules: https://github.com/vercel/next.js/issues/86099
    config.externals.push('pino-pretty', 'lokijs', 'encoding', 'sodium-native', 'require-addon')
    return config
  },
}

// Injected content via Sentry wizard below

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  org: 'niftyleague',
  project: 'nifty-league-app',
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print Sentry build logs in CI
  silent: !process.env.CI,

  // Only upload source maps in production
  sourcemaps: { disable: ENV !== 'production' },

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: ENV === 'production',

  // Only enable internal plugin errors and performance data on production
  telemetry: ENV === 'production',

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  tunnelRoute: true, // Generates a random route for each build (recommended)

  // Capture React component names to see which component a user clicked on.
  // Route grouping is not worth shipping Sentry's manifest on every initial route.
  routeManifestInjection: false,
  webpack: { reactComponentAnnotation: { enabled: true }, treeshake: { removeDebugLogging: true } },
})
