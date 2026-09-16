import type { ParentProps } from 'solid-js'

import AuditFixtureContextWrapper from '@/contexts/AuditFixtureContextWrapper'
import WalletAuthProviders from '@/contexts/WalletAuthProviders'
import { AUDIT_FIXTURE } from '@/runtime/env'
import { getRequestCookieHeader } from '@/runtime/request-cookies'

/**
 * Game surfaces consume only wallet auth (the Unity bridge reads the account
 * and auth token). Network, IMX, NFT-balance, and token-balance clients are
 * deliberately NOT mounted here: no game surface reads them, and mounting
 * them costs ethers/Passport setup plus a burst of balance RPCs on every
 * game navigation.
 */
export default function GameWalletProviders(props: ParentProps) {
  const auditFixtureEnabled = AUDIT_FIXTURE

  if (auditFixtureEnabled)
    return <AuditFixtureContextWrapper>{props.children}</AuditFixtureContextWrapper>

  const cookies = getRequestCookieHeader()

  return <WalletAuthProviders cookies={cookies}>{props.children}</WalletAuthProviders>
}
