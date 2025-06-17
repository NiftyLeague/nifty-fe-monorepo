import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import MainLayout from '@/components/MainLayout';

export const metadata: Metadata = {
  title: 'Lore',
  description: 'Discover the origin story behind Nifty League',
  openGraph: {
    title: 'Nifty League | Lore',
    description: 'Discover the origin story behind Nifty League',
    images: 'https://niftyleague.com/img/backgrounds/dgen-network.webp',
  },
};

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'lore-pg' }}>{children}</MainLayout>;
}
