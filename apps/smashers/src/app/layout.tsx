import type { PropsWithChildren } from 'react'
import type { Metadata, Viewport } from 'next'

import DeferredSentry from '@nl/sentry-client/react'
import { DeferredAnalytics } from '@nl/ui/gtm'
import { defaultFont } from '@nl/ui/fonts/default'
import { headerFont } from '@nl/ui/fonts/header'
import { specialFont } from '@nl/ui/fonts/special'
import { subheaderFont } from '@nl/ui/fonts/subheader'
import { cn } from '@nl/ui/utils'

import { sentryOptions } from '@/constants/sentry'
import '@/styles/app.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://niftysmashers.com'),
  title: { template: '%s | Nifty Smashers', default: 'Nifty Smashers' },
  description:
    'Free-to-play online multiplayer 3D party platform fighter. Play on iOS, Android, and Steam with full cross-play support! Jump in and brawl anytime, anywhere!',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: [
    'Nifty League',
    'Nifty Smashers',
    'Gaming',
    'Web3',
    'Mobile Games',
    'Steam Games',
    'PC Games',
    'Platform Fighter',
  ],
  alternates: { canonical: '/' },
  authors: [{ name: '0xPlayerOne', url: 'https://niftysmashers.com' }],
  creator: '0xPlayerOne',
  publisher: 'Nifty League',
  assets: ['https://niftysmashers.com'],
  formatDetection: { email: true, address: true, telephone: true },
  openGraph: {
    title: 'Nifty Smashers',
    description:
      'Free-to-play online multiplayer 3D party platform fighter. Play on iOS, Android, and Steam with full cross-play support! Jump in and brawl anytime, anywhere!',
    images: [
      {
        url: '/img/console-game/classic-gaming-reinvented.webp',
        width: 1200,
        height: 630,
        alt: 'Nifty Smashers gameplay',
      },
    ],
    siteName: 'Nifty Smashers',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon/smashers/favicon.ico',
    shortcut: '/favicon/smashers/favicon.ico',
    apple: '/favicon/smashers/apple-touch-icon.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nifty Smashers',
    description: 'Follow @NiftySmashers on Twitter',
    // siteId: 'XXXXXXXX',
    creator: '@NiftySmashers',
    // creatorId: 'XXXXXXXX',
    images: {
      url: 'https://niftysmashers.com/img/console-game/classic-gaming-reinvented.webp',
      alt: 'Nifty Smashers Banner',
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#18181b',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        defaultFont.variable,
        headerFont.variable,
        subheaderFont.variable,
        specialFont.variable,
        'dark'
      )}
    >
      <DeferredAnalytics />
      <DeferredSentry enabled={process.env.VERCEL_ENV === 'production'} options={sentryOptions} />

      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
