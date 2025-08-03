// This file sets a custom webpack configuration to use your Next.js app with Sentry
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';
import TerserPlugin from 'terser-webpack-plugin';

const ENV = (process.env.VERCEL_ENV as 'production' | 'preview' | undefined) ?? 'development';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  transpilePackages: ['@nl/theme', '@nl/ui'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        buffer: false,
        crypto: 'crypto-browserify',
        fs: false,
        stream: false,
        path: false,
        os: false,
      };

      // Add aliases for problematic native modules
      config.resolve.alias = { ...config.resolve.alias, 'sodium-native': false, 'require-addon': false };
    }

    // Temp prod build solution: https://github.com/diegomura/react-pdf/issues/3121
    if (config.optimization.minimizer) {
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            mangle: false, // Disable function renaming
            keep_fnames: true, // Preserve function names (prevents SHA256 loss)
            keep_classnames: true, // Preserve class names (for internal PDFKit use)
          },
        }),
      );
    }

    // Externalize native modules
    config.externals.push('pino-pretty', 'lokijs', 'encoding', 'sodium-native', 'require-addon');

    // Ignore warnings for specific modules
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      // Ignore warnings about require() calls that cannot be statically analyzed
      { module: /require-addon/ },
      { module: /sodium-native/ },
      { module: /node_modules\\@stellar/ },
      { module: /node_modules\\@axelar-network/ },
    ];

    return config;
  },
};

// Injected content via Sentry wizard below

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  org: 'niftyleague',
  project: 'nifty-league-app',
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Only upload source maps in production
  sourcemaps: { disable: ENV !== 'production' },

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: ENV === 'production',

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  tunnelRoute: true, // Generates a random route for each build (recommended)

  // Capture React component names to see which component a user clicked on.
  reactComponentAnnotation: { enabled: true },

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
});
