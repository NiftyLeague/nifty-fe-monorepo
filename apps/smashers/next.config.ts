// This file sets a custom webpack configuration to use your Next.js app with Sentry
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import type { NextConfig } from 'next'

import { IMAGE_DEVICE_SIZES } from '../../config/image-device-sizes'

// Fail-fast environment variable validation (production builds only, not local dev)
const isProductionBuild = process.env.NEXT_PHASE === 'phase-production-build'
const requiredEnvs = [
  'NEXT_PUBLIC_APPLE_STORE_ID',
  'NEXT_PUBLIC_APPLE_STORE_LINK',
  'NEXT_PUBLIC_GOOGLE_PLAY_LINK',
  'NEXT_PUBLIC_EPIC_LINK',
  'NEXT_PUBLIC_STEAM_LINK',
]

if (isProductionBuild && process.env.GITHUB_ACTIONS !== 'true') {
  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      throw new Error(`Build failed: Missing required environment variable "${env}"`)
    }
  }
}

const ENV = (process.env.VERCEL_ENV as 'production' | 'preview' | undefined) ?? 'development'

const getAppleStoreLink = (countryCode = '') =>
  countryCode.length > 0
    ? `https://apps.apple.com/${countryCode.toLowerCase()}/app/${process.env.NEXT_PUBLIC_APPLE_STORE_ID}`
    : (process.env.NEXT_PUBLIC_APPLE_STORE_LINK as string)

const generateAppleCountryRedirects = (countryCode: string) => [
  {
    source: '/ios',
    has: [{ type: 'header' as const, key: 'x-vercel-ip-country', value: countryCode }],
    destination: getAppleStoreLink(countryCode),
    permanent: false,
  },
  {
    source: '/ios/:params*',
    has: [{ type: 'header' as const, key: 'x-vercel-ip-country', value: countryCode }],
    destination: `${getAppleStoreLink(countryCode)}:params*`,
    permanent: false,
  },
]

const nextConfig: NextConfig = {
  transpilePackages: ['@nl/playfab', '@nl/ui'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
    useTypeScriptCli: true,
  },
  turbopack: {},
  images: {
    formats: ['image/avif', 'image/webp'],
    // Avoid jumping from 1,920px to 3,840px on common high-density screens.
    deviceSizes: [...IMAGE_DEVICE_SIZES],
    qualities: [65, 75, 85],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nifty-league.s3.amazonaws.com',
        port: '',
        pathname: '/degens/**',
      },
      {
        protocol: 'https',
        hostname: 'nifty-league.s3.amazonaws.com',
        port: '',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'niftyworldprodbb95.blob.core.windows.net',
        port: '',
        pathname: '/account-avatars/**',
      },
    ],
  },
  async redirects() {
    return [
      ...(process.env.NEXT_PUBLIC_APPLE_STORE_ID || process.env.NEXT_PUBLIC_APPLE_STORE_LINK
        ? [
            ...generateAppleCountryRedirects('AU'),
            ...generateAppleCountryRedirects('BR'),
            ...generateAppleCountryRedirects('CA'),
            ...generateAppleCountryRedirects('US'),
            { source: '/ios', destination: getAppleStoreLink(), permanent: false },
            {
              source: '/ios/:params*',
              destination: `${getAppleStoreLink()}:params*`,
              permanent: false,
            },
          ]
        : []),
      ...(
        [
          ['GOOGLE_PLAY', 'android'],
          ['EPIC', 'epic'],
          ['STEAM', 'steam'],
        ] as const
      ).flatMap(([name, path]) => {
        const destination = process.env[`NEXT_PUBLIC_${name}_LINK`]
        return destination
          ? [
              { source: `/${path}`, destination, permanent: false },
              {
                source: `/${path}/:params*`,
                destination: `${destination}:params*`,
                permanent: false,
              },
            ]
          : []
      }),
      {
        source: '/invite/:ref_code(\\w{1,})',
        has: [{ type: 'header' as const, key: 'User-Agent', value: '.*(iPhone|iPad|iPod).*' }],
        destination: '/ios/?referral=:ref_code',
        permanent: false,
      },
      {
        source: '/invite/:ref_code(\\w{1,})',
        has: [{ type: 'header' as const, key: 'User-Agent', value: '.*(Mobile|Android).*' }],
        destination: '/android/?referral=:ref_code',
        permanent: false,
      },
      {
        source: '/invite/:ref_code(\\w{1,})',
        destination: '/?referral=:ref_code',
        permanent: false,
      },
    ]
  },
}

const sentryOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  org: 'niftyleague',
  project: 'nifty-smashers-web',
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
