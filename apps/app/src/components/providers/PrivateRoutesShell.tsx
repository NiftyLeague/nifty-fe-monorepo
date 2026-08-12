'use client'

import type { PropsWithChildren } from 'react'

import MainLayout from '@/app/_layout/_MainLayout'
import { AuthStatusProvider } from '@/contexts/AuthStatusContext'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { FeatureFlagProvider } from '@/contexts/FeatureFlagsContext'
import { LocalStorageProvider } from '@/contexts/LocalStorageContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'
import DeferredNotifications from './DeferredNotifications'

interface PrivateRoutesShellProps extends PropsWithChildren {
  cookies?: string | null
}

export default function PrivateRoutesShell({ children, cookies }: PrivateRoutesShellProps) {
  return (
    <LocalStorageProvider>
      <Web3ModalProvider cookies={cookies}>
        <AuthStatusProvider>
          <NotificationProvider>
            <AuthTokenProvider>
              <FeatureFlagProvider>
                <MainLayout>{children}</MainLayout>
                <DeferredNotifications />
              </FeatureFlagProvider>
            </AuthTokenProvider>
          </NotificationProvider>
        </AuthStatusProvider>
      </Web3ModalProvider>
    </LocalStorageProvider>
  )
}
