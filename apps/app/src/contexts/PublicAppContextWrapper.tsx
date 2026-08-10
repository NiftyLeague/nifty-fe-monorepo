'use server'

import type { PropsWithChildren } from 'react'

import { FeatureFlagProvider } from '@/contexts/FeatureFlagsContext'
import { LocalStorageProvider } from '@/contexts/LocalStorageContext'
import ReduxProvider from '@/store/ReduxProvider'

export default async function PublicAppContextWrapper({ children }: PropsWithChildren) {
  return (
    <LocalStorageProvider>
      <ReduxProvider>
        <FeatureFlagProvider>{children}</FeatureFlagProvider>
      </ReduxProvider>
    </LocalStorageProvider>
  )
}
