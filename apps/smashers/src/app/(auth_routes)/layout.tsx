import { type PropsWithChildren, Suspense } from 'react';
import { type Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthProvider';

export const metadata: Metadata = {
  title: 'Profile',
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Suspense fallback={null}>
      <AuthProvider>
        <main id="auth-layout" className="min-h-screen bg-background-default">
          {children}
        </main>
      </AuthProvider>
    </Suspense>
  );
}
