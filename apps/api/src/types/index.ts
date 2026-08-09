import type { Signer } from 'ethers'

export * from './metadata'
export type ContractName =
  | 'NiftyDegen'
  | 'NiftyLaunchComics'
  | 'NiftyItemL2'
  | 'NFTLToken'
  | 'HydraDistributor'
  | 'NiftyBurningComicsL2'
  | 'BalanceManager'

export type TargetNetwork = 'mainnet' | 'sepolia'

export type { Signer }
