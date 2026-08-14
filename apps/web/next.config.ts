// This file sets a custom webpack configuration to use your Next.js app with Sentry
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import type { NextConfig } from 'next'

const ENV = (process.env.VERCEL_ENV as 'production' | 'preview' | undefined) ?? 'development'

const nextConfig: NextConfig = {
  transpilePackages: ['@nl/ui'],
  turbopack: {},
  images: {
    formats: ['image/avif', 'image/webp'],
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
    ],
  },
  async rewrites() {
    return [
      { source: '/contact', destination: 'https://forms.gle/hdivQVeFDqetjrzo8' },
      { source: '/shop', destination: 'https://shop.niftyleague.com' },
      {
        source: '/collections/:path*',
        destination: 'https://shop.niftyleague.com/collections/:path*',
      },
      { source: '/pages/:path*', destination: 'https://shop.niftyleague.com/pages/:path*' },
      { source: '/products/:path*', destination: 'https://shop.niftyleague.com/products/:path*' },
      { source: '/cart/:path*', destination: 'https://shop.niftyleague.com/cart/:path*' },
      { source: '/account/login', destination: 'https://shop.niftyleague.com/account/login' },
      ...(ENV === 'production' || ENV === 'preview'
        ? [
            {
              source: '/docs/:path*',
              destination: `https://${ENV === 'preview' ? 'staging.' : ''}docs.niftyleague.com/:path*`,
            },
          ]
        : []),
    ]
  },
  async headers() {
    // OpenSea embeds /gltf/* in sandboxed frames with an opaque origin. The
    // client chunks and local fonts still need to opt into that CORS request.
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }],
      },
    ]
  },
  async redirects() {
    return [
      ...(ENV === 'development'
        ? [
            {
              source: '/docs/:path*',
              destination: `http://localhost:3002/docs/:path*`,
              permanent: true,
            },
            { source: '/app', destination: 'http://localhost:3001', permanent: true },
          ]
        : [
            {
              source: '/app',
              destination: `https://${ENV === 'preview' ? 'staging.' : ''}app.niftyleague.com`,
              permanent: true,
            },
          ]),
      { source: '/blog', destination: 'https://niftyleague.medium.com', permanent: true },
      { source: '/feedback', destination: 'https://feedback.niftyleague.com', permanent: true },
      { source: '/snapshot', destination: 'https://snapshot.niftyleague.com', permanent: true },
      { source: '/tally', destination: 'https://www.tally.xyz/gov/niftyleague', permanent: true },
      {
        source: '/NFTL/supply',
        destination: 'https://api.niftyleague.com/NFTL/supply',
        permanent: true,
      },
      { source: '/HUB', destination: 'https://hub.xyz/niftyleague', permanent: false },
      { source: '/OS', destination: 'https://opensea.io/collection/niftydegen', permanent: false },
      {
        source: '/ME',
        destination: 'https://magiceden.io/collections/ethereum/niftydegen',
        permanent: false,
      },
      { source: '/BLUR', destination: 'https://blur.io/collection/niftydegen', permanent: false },
      {
        source: '/d/:token_id(\\d{1,})',
        destination:
          'https://opensea.io/assets/ethereum/0x986aea67c7d6a15036e18678065eb663fc5be883/:token_id',
        permanent: false,
      },
    ]
  },
}

const sentryOptions = {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  org: 'niftyleague',
  project: 'nifty-league-web',
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
