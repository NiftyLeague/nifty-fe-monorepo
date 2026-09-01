// This file sets a custom webpack configuration to use your Next.js app with Sentry
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import type { NextConfig } from 'next'

import { IMAGE_DEVICE_SIZES, IMAGE_SMALL_SIZES } from '../../config/image-device-sizes'
import { getProductionSentryOptions } from '../../config/with-production-sentry'

const ENV = (process.env.VERCEL_ENV as 'production' | 'preview' | undefined) ?? 'development'

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
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Allow the critical game posters to use the measured lower quality ladder.
    qualities: [60, 65, 75],
    // Avoid jumping from 1,920px to 3,840px on common high-density screens.
    deviceSizes: [...IMAGE_DEVICE_SIZES],
    imageSizes: [...IMAGE_SMALL_SIZES],
  },
  webpack: webpackFallback,
}

const sentryOptions = getProductionSentryOptions('nifty-league-app', ENV)

// Keep preview and development builds on the plain Next config path. The
// dynamic import avoids loading Sentry's webpack/OpenTelemetry graph there.
export default process.env.VERCEL_ENV === 'production'
  ? import('@sentry/nextjs').then(({ withSentryConfig }) =>
      withSentryConfig(nextConfig, sentryOptions)
    )
  : nextConfig
