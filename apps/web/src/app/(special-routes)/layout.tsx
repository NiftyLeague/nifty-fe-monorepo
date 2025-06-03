import { type PropsWithChildren } from 'react';
import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';

import '@/styles/app.css';

const imbPlexSans = IBM_Plex_Sans({
  weight: ['100', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { template: 'Nifty League | %s', default: 'Nifty League' },
  description:
    'A decentralized game studio & publisher creating an open & efficient path for indie studios to develop & publish groundbreaking games',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  icons: {
    icon: '/favicon/nl_purple/favicon.ico',
    apple: '/favicon/nl_purple/apple-touch-icon.png',
    shortcut: '/favicon/nl_purple/android-chrome-192x192.png',
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
      <body suppressHydrationWarning={true} className={imbPlexSans.variable}>
        {children}
      </body>
    </html>
  );
}
