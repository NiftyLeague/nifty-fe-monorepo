import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import MainLayout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Community comes first at Nifty League',
  openGraph: {
    title: 'Nifty League | Community',
    description: 'Community comes first at Nifty League',
    images: 'https://niftyleague.com/img/home/banner-mobile.png',
  },
};

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'com-pg' }}>{children}</MainLayout>;
}