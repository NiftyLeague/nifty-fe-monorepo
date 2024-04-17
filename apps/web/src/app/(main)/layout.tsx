import { type PropsWithChildren, Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { ThemeProvider } from '@nl/theme';
import { NavigationEvents } from '@/components/NavigationEvents';

import '@/styles/index.scss';

export const metadata: Metadata = {
  metadataBase: new URL('https://niftyleague.com'),
  title: {
    template: 'Nifty League | %s',
    default: 'Nifty League',
  },
  description:
    'A game studio at the cutting edge of Web3 with a mission to inspire other indie game developers to build a decentralized future with us.',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Nifty League', 'NFT', 'Gaming', 'Web3', 'Metaverse', 'Mobile Gaming'],
  authors: [{ name: 'NiftyAndy', url: 'https://niftyleague.com' }],
  creator: 'NiftyAndy',
  publisher: 'Nifty League',
  assets: ['https://niftyleague.com'],
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: 'Nifty League: Community-Governed Game Studio',
    description:
      'A game studio at the cutting edge of Web3 with a mission to inspire other indie game developers to build a decentralized future with us.',
    url: 'https://niftyleague.com',
    siteName: 'NiftyLeague',
    images: 'https://niftyleague.com/img/console-game/classic-gaming-reinvented.png',
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
      url: 'https://niftyleague.com/img/console-game/classic-gaming-reinvented.png',
      alt: 'Nifty League Banner',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'cyan' },
    { media: '(prefers-color-scheme: dark)', color: '#620EDF' },
  ],
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <Script strategy="lazyOnload" id="clarity-script">
        {`
          if (!window.location.host.includes('localhost')) {
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_TAG}");
          }
        `}
      </Script>

      <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />
      <Script id="google-analytics">
        {`
          if (!window.location.host.includes('localhost')) {
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          }
        `}
      </Script>

      <body suppressHydrationWarning={true}>
        <ThemeProvider>{children}</ThemeProvider>

        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
      </body>
    </html>
  );
}
