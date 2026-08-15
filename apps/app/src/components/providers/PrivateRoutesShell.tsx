'use client'

import type { PropsWithChildren } from 'react'

import { Skeleton } from '@nl/ui/base/skeleton'

import MainLayout from '@/app/_layout/_MainLayout'
import { AuthStatusProvider } from '@/contexts/AuthStatusContext'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { FeatureFlagProvider } from '@/contexts/FeatureFlagsContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import WalletStorageProviders from '@/contexts/WalletStorageProviders'
import DeferredNotifications from './DeferredNotifications'

function PrivateRoutesContentLoading(): React.ReactNode {
  return (
    <div
      className="flex min-h-[24rem] flex-col gap-6 rounded-lg bg-background p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex min-h-0 flex-1 gap-6">
        <Skeleton className="hidden w-64 rounded-lg lg:block" />
        <Skeleton className="min-h-[20rem] flex-1 rounded-lg" />
      </div>
      <span className="sr-only">Loading private app content</span>
    </div>
  )
}

interface PrivateRoutesShellProps extends PropsWithChildren {
  cookies?: string | null
}

export default function PrivateRoutesShell({ children, cookies }: PrivateRoutesShellProps) {
  return (
    <WalletStorageProviders
      cookies={cookies}
      loadingFallback={
        <MainLayout walletReady={false}>
          <PrivateRoutesContentLoading />
        </MainLayout>
      }
    >
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
    </WalletStorageProviders>
  )
}
