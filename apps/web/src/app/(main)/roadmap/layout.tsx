import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import MainLayout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'Roadmap',
  description: 'Nifty League roadmap... or moonmap?',
  openGraph: {
    title: 'Nifty League | Roadmap',
    description: 'Nifty League roadmap... or moonmap?',
    images: 'https://niftyleague.com/img/roadmap/roadmap.png',
  },
};

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'roadmap-pg' }}>{children}</MainLayout>;
}
