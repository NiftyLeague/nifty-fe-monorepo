'use client'

import type { PropsWithChildren } from 'react'

import WalletAuthProvidersBoundary from '@/contexts/WalletAuthProvidersBoundary'
import { getRequestCookieHeader } from '@/runtime/request-cookies'

/**
 * The smallest wallet boundary for routes that only authenticate a wallet.
 *
 * Keeping the balance and Immutable providers out of this boundary prevents
 * auth-only deep links from downloading the dapp dashboard data clients.
 */
export default function WalletAuthContextWrapper({ children }: PropsWithChildren) {
  const cookies = getRequestCookieHeader()

  return <WalletAuthProvidersBoundary cookies={cookies}>{children}</WalletAuthProvidersBoundary>
}
