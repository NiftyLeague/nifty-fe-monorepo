import { type PropsWithChildren, Suspense } from 'react';
import { type Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthProvider';

export const metadata: Metadata = { title: 'Profile' };

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={null}>
      <AuthProvider>{children}</AuthProvider>
    </Suspense>
  );
}
