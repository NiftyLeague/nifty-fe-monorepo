import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import MainLayout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'Overview',
  description: 'Overview and FAQ for Nifty League',
  openGraph: {
    title: 'Nifty League | Overview',
    description: 'Overview and FAQ for Nifty League',
    images: 'https://niftyleague.com/img/backgrounds/mars-degens.png',
  },
};

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'learn-pg' }}>{children}</MainLayout>;
}
