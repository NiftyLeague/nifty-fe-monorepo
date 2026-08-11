'use client'

import type { PropsWithChildren } from 'react'

import MainLayout from '@/app/_layout/_MainLayout'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { FeatureFlagProvider } from '@/contexts/FeatureFlagsContext'
import { LocalStorageProvider } from '@/contexts/LocalStorageContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'
import ReduxProvider from '@/store/ReduxProvider'

interface PrivateRoutesShellProps extends PropsWithChildren {
  cookies?: string | null
}

export default function PrivateRoutesShell({ children, cookies }: PrivateRoutesShellProps) {
  return (
    <LocalStorageProvider>
      <Web3ModalProvider cookies={cookies}>
        <ReduxProvider>
          <AuthTokenProvider>
            <FeatureFlagProvider>
              <MainLayout>{children}</MainLayout>
            </FeatureFlagProvider>
          </AuthTokenProvider>
        </ReduxProvider>
      </Web3ModalProvider>
    </LocalStorageProvider>
  )
}
