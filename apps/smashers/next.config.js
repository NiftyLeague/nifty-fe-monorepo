const { withSentryConfig } = require('@sentry/nextjs');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@nl/theme', '@nl/ui'],
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
  },
  images: {
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
  async redirects() {
    return [
      {
        source: '/ios',
        has: [
          {
            type: 'header',
            key: 'x-vercel-ip-country',
            value: 'CA',
          },
        ],
        destination: process.env.NEXT_PUBLIC_APPLE_CA_STORE_LINK,
        permanent: false,
      },
      {
        source: '/ios/:params*',
        has: [
          {
            type: 'header',
            key: 'x-vercel-ip-country',
            value: 'CA',
          },
        ],
        destination: `${process.env.NEXT_PUBLIC_APPLE_CA_STORE_LINK}:params*`,
        permanent: false,
      },
      {
        source: '/ios',
        destination: process.env.NEXT_PUBLIC_APPLE_STORE_LINK,
        permanent: false,
      },
      {
        source: '/ios/:params*',
        destination: `${process.env.NEXT_PUBLIC_APPLE_STORE_LINK}:params*`,
        permanent: false,
      },
      {
        source: '/android',
        destination: process.env.NEXT_PUBLIC_GOOGLE_PLAY_LINK,
        permanent: false,
      },
      {
        source: '/android/:params*',
        destination: `${process.env.NEXT_PUBLIC_GOOGLE_PLAY_LINK}:params*`,
        permanent: false,
      },
      {
        source: '/invite/:ref_code(\\w{1,})',
        has: [
          {
            type: 'header',
            key: 'User-Agent',
            value: '.*(iPhone|iPad|iPod).*',
          },
        ],
        destination: '/ios/?referral=:ref_code',
        permanent: false,
      },
      {
        source: '/invite/:ref_code(\\w{1,})',
        has: [
          {
            type: 'header',
            key: 'User-Agent',
            value: '.*(Mobile|Android).*',
          },
        ],
        destination: '/android/&referral=:ref_code',
        permanent: false,
      },
      {
        source: '/invite/:ref_code(\\w{1,})',
        destination: '/?referral=:ref_code',
        permanent: false,
      },
    ];
  },
};

// Injected content via Sentry wizard below

module.exports = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'niftyleague',
  project: 'nifty-smashers-web',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
