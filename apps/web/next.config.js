// This file sets a custom webpack configuration to use your Next.js app with Sentry
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

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
  async rewrites() {
    return [
      {
        source: '/shop',
        destination: 'https://shop.niftyleague.com',
      },
      {
        source: '/collections/:path*',
        destination: 'https://shop.niftyleague.com/collections/:path*',
      },
      {
        source: '/pages/:path*',
        destination: 'https://shop.niftyleague.com/pages/:path*',
      },
      {
        source: '/products/:path*',
        destination: 'https://shop.niftyleague.com/products/:path*',
      },
      {
        source: '/cart/:path*',
        destination: 'https://shop.niftyleague.com/cart/:path*',
      },
      {
        source: '/account/login',
        destination: 'https://shop.niftyleague.com/account/login',
      },
      ...(process.env.NODE_ENV !== 'development'
        ? [
            {
              source: '/docs/:path*',
              destination: 'https://docs.niftyleague.com/:path*',
            },
          ]
        : []),
    ];
  },
  async redirects() {
    return [
      ...(process.env.NODE_ENV === 'development'
        ? [
            {
              source: '/docs/:path*',
              destination: `http://localhost:3002/docs/:path*`,
              permanent: false,
            },
            {
              source: '/app',
              destination: 'http://localhost:3001',
              permanent: true,
            },
          ]
        : [
            {
              source: '/app',
              destination: 'https://app.niftyleague.com',
              permanent: true,
            },
          ]),
      {
        source: '/blog',
        destination: 'https://niftyleague.medium.com',
        permanent: true,
      },
      {
        source: '/feedback',
        destination: 'https://feedback.niftyleague.com/',
        permanent: true,
      },
      {
        source: '/NFTL/supply',
        destination: 'https://api.niftyleague.com/NFTL/supply',
        permanent: true,
      },
      {
        source: '/OS',
        destination: 'https://opensea.io/collection/niftydegen',
        permanent: false,
      },
      {
        source: '/ME',
        destination: 'https://magiceden.io/collections/ethereum/niftydegen',
        permanent: false,
      },
      {
        source: '/BLUR',
        destination: 'https://blur.io/collection/niftydegen',
        permanent: false,
      },
      {
        source: '/d/:token_id(\\d{1,})',
        destination: 'https://opensea.io/assets/ethereum/0x986aea67c7d6a15036e18678065eb663fc5be883/:token_id',
        permanent: false,
      },
      {
        source: '/invite/smashers/:ref_code(\\w{1,})',
        destination: 'https://niftysmashers.com/invite/:ref_code',
        permanent: false,
      },
    ];
  },
  // Optional build-time configuration options
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
  },
};

// Injected content via Sentry wizard below

module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'niftyleague',
    project: 'nifty-league-web',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
);
