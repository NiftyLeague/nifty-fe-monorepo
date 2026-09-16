import type { ParentProps } from 'solid-js'

import WalletAuthProvidersBoundary from '@/contexts/WalletAuthProvidersBoundary'
import { getRequestCookieHeader } from '@/runtime/request-cookies'

/**
 * The smallest wallet boundary for routes that only authenticate a wallet.
 *
 * Keeping the balance and Immutable providers out of this boundary prevents
 * auth-only deep links from downloading the dapp dashboard data clients.
 */
export default function WalletAuthContextWrapper(props: ParentProps) {
  const cookies = getRequestCookieHeader()

  return (
    <WalletAuthProvidersBoundary cookies={cookies}>{props.children}</WalletAuthProvidersBoundary>
  )
}
