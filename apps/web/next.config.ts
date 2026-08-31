// This file sets a custom webpack configuration to use your Next.js app with Sentry
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import type { NextConfig } from 'next'

import { IMAGE_DEVICE_SIZES, IMAGE_SMALL_SIZES } from '../../config/image-device-sizes'
import { getProductionSentryOptions } from '../../config/with-production-sentry'

const ENV = (process.env.VERCEL_ENV as 'production' | 'preview' | undefined) ?? 'development'

const nextConfig: NextConfig = {
  transpilePackages: ['@nl/ui'],
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Inline the small Tailwind-generated route styles so first-time visitors
    // can render the hero without a render-blocking CSS request.
    inlineCss: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 65, 75],
    // Fill the gaps in Next's default ladder so common 1x/2x desktop
    // viewports do not jump from 1,920px straight to the 3,840px source.
    deviceSizes: [...IMAGE_DEVICE_SIZES],
    imageSizes: [...IMAGE_SMALL_SIZES],
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
              destination: `http://localhost:3002/:path*`,
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

const sentryOptions = getProductionSentryOptions('nifty-league-web', ENV)

// Keep preview and development builds on the plain Next config path. The
// dynamic import avoids loading Sentry's webpack/OpenTelemetry graph there.
export default process.env.VERCEL_ENV === 'production'
  ? import('@sentry/nextjs').then(({ withSentryConfig }) =>
      withSentryConfig(nextConfig, sentryOptions)
    )
  : nextConfig
