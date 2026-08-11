'use server'

import type { PropsWithChildren } from 'react'
import { headers } from 'next/headers'

import { AuthTokenProvider } from '@/contexts/AuthTokenContext'
import { Web3ModalProvider } from '@/contexts/Web3ModalContext'

/**
 * The smallest wallet boundary for routes that only authenticate a wallet.
 *
 * Keeping the balance and Immutable providers out of this boundary prevents
 * auth-only deep links from downloading the dapp dashboard data clients.
 */
export default async function WalletAuthContextWrapper({ children }: PropsWithChildren) {
  const cookies = (await headers()).get('cookie')

  return (
    <Web3ModalProvider cookies={cookies}>
      <AuthTokenProvider>{children}</AuthTokenProvider>
    </Web3ModalProvider>
  )
}
