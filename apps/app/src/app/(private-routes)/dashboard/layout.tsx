import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import AuthGuard from '@/utils/route-guard/AuthGuard';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <AuthGuard>{children}</AuthGuard>;
}
