'use client'

import type { PropsWithChildren } from 'react'

import { AuthProvider } from './AuthProvider'
import { FeatureFlagProvider } from './FeatureFlagsProvider'

export default function AuthProviders({ children }: PropsWithChildren) {
  return (
    <FeatureFlagProvider>
      <AuthProvider>{children}</AuthProvider>
    </FeatureFlagProvider>
  )
}
