import type { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import Head from 'next/head';
import Script from 'next/script';

import { ThemeProvider } from '@nl/theme';
import { GoogleTagManager } from '@nl/ui/gtm';
import { customFontClassName } from '@nl/ui/fonts';
import AppContextWrapper from '@/contexts/AppContextWrapper';
import MainLayout from '@/app/_layout/_MainLayout';

import '@/styles/app.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://app.niftyleague.com'),
  title: { template: '%s | Nifty League App', default: 'Nifty League App' },
  description: 'Web3 gaming app brought to you by Nifty League',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Nifty League', 'NFT', 'Gaming', 'Web3', 'Metaverse'],
  authors: [{ name: 'NiftyAndy', url: 'https://niftyleague.com' }],
  creator: 'NiftyAndy',
  publisher: 'Nifty League',
  assets: ['https://app.niftyleague.com'],
  formatDetection: { email: true, address: true, telephone: true },
  openGraph: {
    title: 'Nifty League Web3 App',
    description: 'Web3 gaming app brought to you by Nifty League',
    url: 'https://app.niftyleague.com',
    siteName: 'NiftyLeagueApp',
    images: 'https://niftyleague.com/img/backgrounds/banner-dark.webp',
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
    title: 'Nifty League Web3 App',
    description: 'Follow @NiftyLeague on Twitter',
    // siteId: '1467726470533754880',
    creator: '@NiftyLeague',
    // creatorId: '1467726470533754880',
    images: { url: 'https://niftyleague.com/img/backgrounds/banner-dark.webp', alt: 'Nifty League Banner' },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#18181b' },
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
  ],
  colorScheme: 'dark light',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={customFontClassName}>
      <Head>
        <link rel="icon" href="/favicon/nl_purple/favicon.ico" />
      </Head>

      <GoogleTagManager />
      <Script id="device-stats" defer src="https://d7ct17ettlkln.cloudfront.net/public/stats.js" />

      <body suppressHydrationWarning>
        <ThemeProvider>
          <AppContextWrapper>
            <MainLayout>{children}</MainLayout>
          </AppContextWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
