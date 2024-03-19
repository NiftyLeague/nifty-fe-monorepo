import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import MainLayout from '@/components/Layout';

export const metadata: Metadata = { title: 'Disclaimer' };

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'legal-pg' }}>{children}</MainLayout>;
}
