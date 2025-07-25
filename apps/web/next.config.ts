// This file sets a custom webpack configuration to use your Next.js app with Sentry
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const ENV = (process.env.VERCEL_ENV as 'production' | 'preview' | undefined) ?? 'development';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  transpilePackages: ['@nl/ui'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'nifty-league.s3.amazonaws.com', port: '', pathname: '/degens/**' },
      { protocol: 'https', hostname: 'nifty-league.s3.amazonaws.com', port: '', pathname: '/assets/**' },
    ],
  },
  async rewrites() {
    return [
      { source: '/contact', destination: 'https://forms.gle/hdivQVeFDqetjrzo8' },
      { source: '/shop', destination: 'https://shop.niftyleague.com' },
      { source: '/collections/:path*', destination: 'https://shop.niftyleague.com/collections/:path*' },
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
    ];
  },
  async redirects() {
    return [
      ...(ENV === 'development'
        ? [
            { source: '/docs/:path*', destination: `http://localhost:3002/docs/:path*`, permanent: true },
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
      { source: '/NFTL/supply', destination: 'https://api.niftyleague.com/NFTL/supply', permanent: true },
      { source: '/HUB', destination: 'https://hub.xyz/niftyleague', permanent: false },
      { source: '/OS', destination: 'https://opensea.io/collection/niftydegen', permanent: false },
      { source: '/ME', destination: 'https://magiceden.io/collections/ethereum/niftydegen', permanent: false },
      { source: '/BLUR', destination: 'https://blur.io/collection/niftydegen', permanent: false },
      {
        source: '/d/:token_id(\\d{1,})',
        destination: 'https://opensea.io/assets/ethereum/0x986aea67c7d6a15036e18678065eb663fc5be883/:token_id',
        permanent: false,
      },
    ];
  },
};

// Injected content via Sentry wizard below

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'niftyleague',
  project: 'nifty-league-web',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: ENV === 'production',

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
