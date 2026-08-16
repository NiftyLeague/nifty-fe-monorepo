// This file sets a custom webpack configuration to use your Next.js app with Sentry
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import type { NextConfig } from 'next'

import { IMAGE_DEVICE_SIZES } from '../../config/image-device-sizes'

const ENV = (process.env.VERCEL_ENV as 'production' | 'preview' | undefined) ?? 'development'
const isExplicitWebpackBuild = process.argv.includes('--webpack')

const webpackFallback: NonNullable<NextConfig['webpack']> = (config) => {
  // Map @wagmi/core connectors package to wagmi/connectors to avoid ESM issues
  config.resolve.alias = { ...config.resolve.alias, '@wagmi/connectors': 'wagmi/connectors' }

  // Externalize native modules: https://github.com/vercel/next.js/issues/86099
  config.externals.push('pino-pretty', 'lokijs', 'encoding', 'sodium-native', 'require-addon')

  return config
}

const nextConfig: NextConfig = {
  transpilePackages: ['@nl/contracts', '@nl/imx-passport', '@nl/ui'],
  serverExternalPackages: ['pino-pretty', 'lokijs', 'encoding', 'sodium-native', 'require-addon'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
    useTypeScriptCli: true,
  },
  turbopack: { resolveAlias: { '@wagmi/connectors': 'wagmi/connectors' } },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Avoid jumping from 1,920px to 3,840px on common high-density screens.
    deviceSizes: [...IMAGE_DEVICE_SIZES],
  },
  // Keep the Webpack compatibility path for explicit `next build --webpack`
  // fallback runs; the normal build and dev paths stay on the Turbopack worker.
  ...(isExplicitWebpackBuild ? { webpack: webpackFallback } : {}),
}

const sentryOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  org: 'niftyleague',
  project: 'nifty-league-app',
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print Sentry build logs in CI
  silent: !process.env.CI,

  // Only upload source maps in production
  sourcemaps: { disable: ENV !== 'production' },

  // Keep production source maps enabled without uploading every client chunk.
  // The widened upload increases build time and deployment bandwidth without
  // changing the browser error signal we collect.
  widenClientFileUpload: false,

  // Only enable internal plugin errors and performance data on production
  telemetry: ENV === 'production',

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  tunnelRoute: true, // Generates a random route for each build (recommended)

  // Capture React component names to see which component a user clicked on.
  // Route grouping is not worth shipping Sentry's manifest on every initial route.
  routeManifestInjection: false as const,
  webpack: { reactComponentAnnotation: { enabled: true }, treeshake: { removeDebugLogging: true } },
}

// Sentry's config wrapper pulls its webpack plugin and OpenTelemetry graph into
// every build. Production is the only environment that uploads source maps,
// uses the tunnel rewrite, or needs component annotations, so keep preview and
// development builds on the plain Next config path.
export default process.env.VERCEL_ENV === 'production'
  ? import('@sentry/nextjs').then(({ withSentryConfig }) =>
      withSentryConfig(nextConfig, sentryOptions)
    )
  : nextConfig
