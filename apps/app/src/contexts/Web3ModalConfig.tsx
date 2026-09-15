import {
  mainnet,
  sepolia,
  hardhat,
  immutableZkEvm,
  immutableZkEvmTestnet,
  type Chain,
} from 'viem/chains'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { cookieStorage, createStorage } from '@wagmi/core'
import { WALLET_CONNECT_PROJECT_ID } from '@/runtime/env'
import { registerWagmiConfig } from '@/runtime/wagmi'

export { immutableZkEvm, immutableZkEvmTestnet, mainnet, sepolia }

// Get projectId at https://cloud.walletconnect.com
export const projectId = WALLET_CONNECT_PROJECT_ID
if (!projectId) throw new Error('VITE_WALLET_CONNECT_PROJECT_ID is not defined')

export const metadata = {
  name: 'Nifty League App',
  description: 'Nifty League Web3 Player Dashboards',
  url: 'https://app.niftyleague.com',
  icons: ['https://app.niftyleague.com/img/logos/NL/purple-filled.webp'],
}

export const networks: [Chain, ...Chain[]] = [
  mainnet,
  sepolia,
  immutableZkEvm,
  immutableZkEvmTestnet,
  hardhat,
]

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
})

// Register the wagmi Config for the Solid bindings in `runtime/wagmi.ts`.
// This module is loaded lazily so the AppKit graph stays out of the initial
// bundle and missing project ids only fail once the wallet surface mounts.
registerWagmiConfig(wagmiAdapter.wagmiConfig)
