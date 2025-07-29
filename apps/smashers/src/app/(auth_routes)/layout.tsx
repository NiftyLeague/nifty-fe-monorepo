import { type PropsWithChildren, Suspense } from 'react';
import { type Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthProvider';
import { getServerSession } from '@nl/playfab/utils';

export const metadata: Metadata = {
  title: 'Profile',
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await getServerSession();

  return (
    <Suspense fallback={null}>
      <AuthProvider session={session}>
        <main id="auth-layout" className="min-h-screen">
          {children}
        </main>
      </AuthProvider>
    </Suspense>
  );
}
