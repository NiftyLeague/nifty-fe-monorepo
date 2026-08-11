'use server'

// third party
import type { PropsWithChildren } from 'react'
import { headers } from 'next/headers'

import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { FeatureFlagProvider } from '@/contexts/FeatureFlagsContext'
import { LocalStorageProvider } from '@/contexts/LocalStorageContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'
import ReduxProvider from '@/store/ReduxProvider'

const AppContextWrapper = async ({ children }: PropsWithChildren) => {
  const cookies = (await headers()).get('cookie')

  return (
    <LocalStorageProvider>
      <Web3ModalProvider cookies={cookies}>
        <ReduxProvider>
          <AuthTokenProvider>
            <FeatureFlagProvider>{children}</FeatureFlagProvider>
          </AuthTokenProvider>
        </ReduxProvider>
      </Web3ModalProvider>
    </LocalStorageProvider>
  )
}

export default AppContextWrapper
