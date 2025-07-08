import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import MainLayout from '@/components/MainLayout';

export const metadata: Metadata = {
  title: 'Team',
  description: 'Build a decentralized future with the Nifty DAO',
  openGraph: {
    title: 'Nifty League | Team',
    description: 'Build a decentralized future with the Nifty DAO',
    images: 'https://niftyleague.com/img/niftyverse/mansion_livingroom_int_03.webp',
  },
};

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'team-pg' }}>{children}</MainLayout>;
}
