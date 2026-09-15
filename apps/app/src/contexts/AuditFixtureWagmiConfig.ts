import { createConfig, http } from '@wagmi/core'
import { hardhat } from 'viem/chains'

import { registerWagmiConfig } from '@/runtime/wagmi'

/**
 * Wagmi config used instead of `Web3ModalConfig` when the audit fixture build
 * (`VITE_AUDIT_FIXTURE=true`) runs without `VITE_WALLET_CONNECT_PROJECT_ID`.
 * The real config throws at module scope without a project id, which made the
 * dashboard provider boundary fall over in E2E runs. This config keeps the
 * wagmi hooks resolvable (disconnected, no connectors) so fixture surfaces
 * render instead of hitting the wallet error boundary.
 */
export const wagmiConfig = createConfig({
  chains: [hardhat],
  transports: { [hardhat.id]: http() },
  ssr: true,
})

registerWagmiConfig(wagmiConfig)

// Mirrors the `Web3ModalConfig` export shape consumed by Web3ModalRuntime.
export const wagmiAdapter = { wagmiConfig }
