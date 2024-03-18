import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import MainLayout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'NiftyVerse',
  description: 'A virtual space for gamers to connect, collaborate, and compete with each other',
  openGraph: {
    title: 'Nifty League | NiftyVerse',
    description: 'A virtual space for gamers to connect, collaborate, and compete with each other',
    images: 'https://niftyleague.com/img/niftyverse/beachfront_night.png',
  },
};

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'niftyverse-pg' }}>{children}</MainLayout>;
}
