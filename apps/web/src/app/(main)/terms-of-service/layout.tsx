import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import MainLayout from '@/components/MainLayout';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function Layout({ children }: PropsWithChildren) {
  return <MainLayout classes={{ root: 'legal-pg' }}>{children}</MainLayout>;
}
