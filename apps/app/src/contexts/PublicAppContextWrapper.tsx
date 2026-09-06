'use server'

import type { PropsWithChildren } from 'react'

import { FeatureFlagProvider } from '@/contexts/FeatureFlagsContext'

export default async function PublicAppContextWrapper({ children }: PropsWithChildren) {
  return <FeatureFlagProvider>{children}</FeatureFlagProvider>
}
