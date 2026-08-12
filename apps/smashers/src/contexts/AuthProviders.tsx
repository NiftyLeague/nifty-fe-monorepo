'use client'

import type { PropsWithChildren } from 'react'
import type { Session } from 'next-auth'

import { AuthProvider } from './AuthProvider'
import { FeatureFlagProvider } from './FeatureFlagsProvider'

type AuthProvidersProps = PropsWithChildren<{ session: Session | null }>

export default function AuthProviders({ children, session }: AuthProvidersProps) {
  return (
    <FeatureFlagProvider>
      <AuthProvider session={session}>{children}</AuthProvider>
    </FeatureFlagProvider>
  )
}
