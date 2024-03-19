import { type PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';

import '@/styles/globals.scss';

const imbPlexSans = IBM_Plex_Sans({
  weight: ['100', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: 'Nifty League | %s',
    default: 'Nifty League',
  },
  description:
    'A game studio at the cutting edge of Web3 with a mission to inspire other indie game developers to build a decentralized future with us.',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  icons: '/icons/favicon.ico',
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
      <body suppressHydrationWarning={true} className={imbPlexSans.variable}>
        {children}
      </body>
    </html>
  );
}
