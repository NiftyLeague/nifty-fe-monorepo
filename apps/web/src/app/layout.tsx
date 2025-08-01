import type { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import Head from 'next/head';

import { customFontClassName } from '@nl/ui/fonts';
import { cn } from '@nl/ui/utils';

import '@/styles/app.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://niftyleague.com'),
  title: { template: ' %s | Nifty League', default: 'Nifty League' },
  description:
    'A decentralized game studio & publisher creating an open & efficient path for indie studios to develop & publish groundbreaking games.',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Nifty League', 'NFT', 'Gaming', 'Web3', 'Metaverse', 'Mobile Gaming'],
  authors: [{ name: '0xPlayerOne', url: 'https://niftyleague.com' }],
  creator: '0xPlayerOne',
  publisher: 'Nifty League',
  assets: ['https://niftyleague.com'],
  formatDetection: { email: true, address: true, telephone: true },
  openGraph: {
    title: 'Nifty League: Community-Governed Game Studio & Publisher',
    description:
      'A decentralized game studio & publisher creating an open & efficient path for indie studios to develop & publish groundbreaking games.',
    url: 'https://niftyleague.com',
    siteName: 'Nifty League',
    images: 'https://niftyleague.com/img/console-game/classic-gaming-reinvented.webp',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon/nl_purple/favicon.ico',
    apple: '/favicon/nl_purple/apple-touch-icon.png',
    shortcut: '/favicon/nl_purple/android-chrome-192x192.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nifty League',
    description: 'Follow @NiftyLeague on Twitter',
    // siteId: 'XXXXXXXX',
    creator: '@NiftyLeague',
    // creatorId: 'XXXXXXXX',
    images: {
      url: 'https://niftyleague.com/img/console-game/classic-gaming-reinvented.webp',
      alt: 'Nifty League Banner',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#18181b',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(customFontClassName, 'dark')}>
      <Head>
        <link rel="icon" href="/favicon/nl_purple/favicon.ico" />
      </Head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
