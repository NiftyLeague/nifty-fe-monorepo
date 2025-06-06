import type { PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { ThemeProvider, customFontClassName } from '@nl/theme';
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
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: 'var(--color-brand-purple)' },
  ],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" className={customFontClassName}>
      <link rel="icon" href="/favicon/nl_purple/favicon.ico" />
      <Script defer src="https://d7ct17ettlkln.cloudfront.net/public/stats.js" />

      <Script strategy="lazyOnload" id="clarity-script">
        {`
          if (!window.location.host.includes('localhost')) {
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "box6efnxlz");
          }
        `}
      </Script>

      <Script src="https://www.googletagmanager.com/gtag/js?id=G-7GJRQ9KGCE" />
      <Script id="google-analytics">
        {`
          if (!window.location.host.includes('localhost')) {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7GJRQ9KGCE', {
              page_path: window.location.pathname,
            });
          }
        `}
      </Script>

      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          <AppContextWrapper>
            <MainLayout>{children}</MainLayout>
          </AppContextWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
