// This file sets a custom webpack configuration to use your Next.js app with Sentry
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

// Fail-fast environment variable validation
const requiredEnvs = [
  'NEXT_PUBLIC_APPLE_STORE_ID',
  'NEXT_PUBLIC_APPLE_STORE_LINK',
  'NEXT_PUBLIC_GOOGLE_PLAY_LINK',
  'NEXT_PUBLIC_EPIC_LINK',
  'NEXT_PUBLIC_STEAM_LINK',
];

if (process.env.GITHUB_ACTIONS !== 'true') {
  for (const env of requiredEnvs) {
    if (!process.env[env]) {
      throw new Error(`Build failed: Missing required environment variable "${env}"`);
    }
  }
}

const ENV = (process.env.VERCEL_ENV as 'production' | 'preview' | undefined) ?? 'development';

const getAppleStoreLink = (countryCode = '') =>
  countryCode.length > 0
    ? `https://apps.apple.com/${countryCode.toLowerCase()}/app/${process.env.NEXT_PUBLIC_APPLE_STORE_ID}`
    : (process.env.NEXT_PUBLIC_APPLE_STORE_LINK as string);

const generateAppleCountryRedirects = (countryCode: string) => [
  {
    source: '/ios',
    has: [{ type: 'header', key: 'x-vercel-ip-country', value: countryCode }],
    destination: getAppleStoreLink(countryCode),
    permanent: false,
  },
  {
    source: '/ios/:params*',
    has: [{ type: 'header', key: 'x-vercel-ip-country', value: countryCode }],
    destination: `${getAppleStoreLink(countryCode)}:params*`,
    permanent: false,
  },
];

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  transpilePackages: ['@nl/playfab', '@nl/ui'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'nifty-league.s3.amazonaws.com', port: '', pathname: '/degens/**' },
      { protocol: 'https', hostname: 'nifty-league.s3.amazonaws.com', port: '', pathname: '/assets/**' },
    ],
  },
  async redirects() {
    return [
      ...generateAppleCountryRedirects('AU'),
      ...generateAppleCountryRedirects('BR'),
      ...generateAppleCountryRedirects('CA'),
      ...generateAppleCountryRedirects('US'),
      { source: '/ios', destination: getAppleStoreLink(), permanent: false },
      { source: '/ios/:params*', destination: `${getAppleStoreLink()}:params*`, permanent: false },
      { source: '/android', destination: process.env.NEXT_PUBLIC_GOOGLE_PLAY_LINK as string, permanent: false },
      {
        source: '/android/:params*',
        destination: `${process.env.NEXT_PUBLIC_GOOGLE_PLAY_LINK as string}:params*`,
        permanent: false,
      },
      { source: '/epic', destination: process.env.NEXT_PUBLIC_EPIC_LINK as string, permanent: false },
      {
        source: '/epic/:params*',
        destination: `${process.env.NEXT_PUBLIC_EPIC_LINK as string}:params*`,
        permanent: false,
      },
      { source: '/steam', destination: process.env.NEXT_PUBLIC_STEAM_LINK as string, permanent: false },
      {
        source: '/steam/:params*',
        destination: `${process.env.NEXT_PUBLIC_STEAM_LINK as string}:params*`,
        permanent: false,
      },
      {
        source: '/invite/:ref_code(\\w{1,})',
        has: [{ type: 'header', key: 'User-Agent', value: '.*(iPhone|iPad|iPod).*' }],
        destination: '/ios/?referral=:ref_code',
        permanent: false,
      },
      {
        source: '/invite/:ref_code(\\w{1,})',
        has: [{ type: 'header', key: 'User-Agent', value: '.*(Mobile|Android).*' }],
        destination: '/android/?referral=:ref_code',
        permanent: false,
      },
      { source: '/invite/:ref_code(\\w{1,})', destination: '/?referral=:ref_code', permanent: false },
    ];
  },
};

// Injected content via Sentry wizard below

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'niftyleague',
  project: 'nifty-smashers-web',

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
