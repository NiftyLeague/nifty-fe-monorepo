import { type PropsWithChildren } from 'react';
import { type Metadata } from 'next';
import { IMXProvider } from '@/contexts/IMXContext';
import AuthGuard from '@/utils/route-guard/AuthGuard';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <AuthGuard>
      <IMXProvider>{children}</IMXProvider>
    </AuthGuard>
  );
}
