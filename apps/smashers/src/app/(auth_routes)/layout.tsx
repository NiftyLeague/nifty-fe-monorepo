import { type PropsWithChildren } from 'react'
import { type Metadata } from 'next'
import AuthProvidersBoundary from '@/contexts/AuthProvidersBoundary'
import { getServerSession } from '@nl/playfab/utils/auth'

export const metadata: Metadata = {
  title: 'Profile',
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
}

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await getServerSession()

  return (
    <AuthProvidersBoundary session={session}>
      <main id="auth-layout" className="min-h-screen">
        {children}
      </main>
    </AuthProvidersBoundary>
  )
}
