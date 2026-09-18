import type { Abi } from 'viem'
import type { Config } from '@wagmi/core'

export interface Ethereumish {
  autoRefreshOnNetworkChange?: boolean
  chainId?: string
  enable?: () => Promise<unknown>
  isMetaMask?: boolean
  isStatus?: boolean
  networkVersion?: string
  on?: (...args: unknown[]) => void
  removeListener?: (...args: unknown[]) => void
  request?: (request: { method: string; params?: Array<unknown> }) => Promise<unknown>
  selectedAddress?: string
  send?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: unknown, response: unknown) => void
  ) => void
  sendAsync?: (
    request: { method: string; params?: Array<unknown> },
    callback: (error: unknown, response: unknown) => void
  ) => void
}

export type NetworkName =
  | 'mainnet'
  | 'sepolia'
  | 'hardhat'
  | 'imtbl-zkevm-mainnet'
  | 'imtbl-zkevm-testnet'

export interface Network {
  blockExplorer: string
  chainId: number
  gasPrice?: bigint
  label: string
  name?: NetworkName
  rpcUrl: string
}

export interface GasStationResponse {
  fast: number
  fastest: number
  safeLow: number
  average: number
  block_time: number
  blockNum: number
  speed: number
  safeLowWait: number
  avgWait: number
  fastWait: number
  fastestWait: number
  gasPriceRange: { [range: string]: number }
}

export type UseReadContractParams<T extends { args: unknown[]; result: unknown }> = {
  abi: Abi
  functionName: 'balanceOfBatch'
  args: T['args']
  config: Config
  result: T['result']
}
