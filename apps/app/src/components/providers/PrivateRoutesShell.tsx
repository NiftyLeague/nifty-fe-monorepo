'use client'

import type { ParentProps } from 'solid-js'

import DeferredSkeleton from '@nl/ui/custom/deferred-skeleton'

import MainLayout from '@/layouts/_layout/_MainLayout'
import { AuthStatusProvider } from '@/contexts/AuthStatusContext'
import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { FeatureFlagProvider } from '@/contexts/FeatureFlagsContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import WalletStorageProviders from '@/contexts/WalletStorageProviders'
import DeferredNotifications from './DeferredNotifications'
import PrivateRoutesAuthGate from './PrivateRoutesAuthGate'
import type { JSX } from 'solid-js'

function PrivateRoutesContentLoading(): JSX.Element {
  return (
    <div
      class="flex min-h-[24rem] flex-col gap-6 rounded-lg bg-background p-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="flex min-h-0 flex-1 gap-6">
        <DeferredSkeleton class="hidden w-64 rounded-lg lg:block" />
        <DeferredSkeleton class="min-h-[20rem] flex-1 rounded-lg" />
      </div>
      <span class="sr-only">Loading private app content</span>
    </div>
  )
}

interface PrivateRoutesShellProps extends ParentProps {
  cookies?: string | null
}

export default function PrivateRoutesShell(props: PrivateRoutesShellProps) {
  return (
    <AuthStatusProvider>
      <PrivateRoutesAuthGate loading={<PrivateRoutesContentLoading />}>
        <WalletStorageProviders
          cookies={props.cookies}
          loadingFallback={
            <MainLayout walletReady={false}>
              <PrivateRoutesContentLoading />
            </MainLayout>
          }
        >
          <NotificationProvider>
            <AuthTokenProvider>
              <FeatureFlagProvider>
                <MainLayout>{props.children}</MainLayout>
                <DeferredNotifications />
              </FeatureFlagProvider>
            </AuthTokenProvider>
          </NotificationProvider>
        </WalletStorageProviders>
      </PrivateRoutesAuthGate>
    </AuthStatusProvider>
  )
}
