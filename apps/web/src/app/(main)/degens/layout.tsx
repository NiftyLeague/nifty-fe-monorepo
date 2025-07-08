import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import MainLayout from '@/components/MainLayout';

export const metadata: Metadata = {
  title: 'DEGENs',
  description: 'Community-generated DEGEN NFTs. Playable avatars in all Nifty League and partner games.',
  openGraph: {
    title: 'Nifty League | DEGENs',
    description: 'Community-generated DEGEN NFTs. Playable avatars in all Nifty League and partner games.',
    images: 'https://niftyleague.com/img/careers/careers_v02_2x.webp',
  },
};

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'degens-pg' }}>{children}</MainLayout>;
}
