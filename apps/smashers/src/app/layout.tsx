import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, Press_Start_2P, Lilita_One } from 'next/font/google';
import { StyledEngineProvider } from '@mui/material/styles';
import { FeatureFlagProvider } from '@/contexts/FeatureFlagsProvider';
import '@/styles/globals.css';
import '@/styles/animations.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['100', '400', '500', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});
const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-press-start-2p',
  display: 'swap',
});
const lilitaOne = Lilita_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-lilita-one',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://niftysmashers.com'),
  title: {
    template: 'Nifty Smashers | %s',
    default: 'Nifty Smashers',
  },
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
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
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
  other: {
    'theme-color': '#000000',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <link rel="icon" href="/favicon/smashers/favicon.ico" />

      <body
        className={`${ibmPlexSans.variable} ${pressStart2P.variable} ${lilitaOne.variable} font-sans dark`}
        suppressHydrationWarning
      >
        <StyledEngineProvider injectFirst>
          <FeatureFlagProvider>{children}</FeatureFlagProvider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
