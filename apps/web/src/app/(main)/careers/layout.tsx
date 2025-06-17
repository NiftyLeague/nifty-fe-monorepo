import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import MainLayout from '@/components/MainLayout';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join us and change gaming forever',
  openGraph: {
    title: 'Nifty League | Careers',
    description: 'Join us and change gaming forever',
    images: 'https://niftyleague.com/img/backgrounds/banner-dark.webp',
  },
};

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'career-pg' }}>{children}</MainLayout>;
}
