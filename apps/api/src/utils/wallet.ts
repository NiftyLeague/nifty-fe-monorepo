import { config } from 'node-config-ts'
import { AlchemyProvider, Wallet } from 'ethers'
import type { TargetNetwork } from '@/types'

/**
 * Get Ethers Provider
 */
export function getProvider(targetNetwork?: TargetNetwork) {
  const network = (targetNetwork || config.eth.network) as TargetNetwork
  return new AlchemyProvider(network, config.eth.alchemy[network])
}

/**
 * Get Ethers Wallet Instance with signer
 */
export function getWallet<T = Wallet>(targetNetwork?: TargetNetwork): T {
  const provider = getProvider(targetNetwork)
  const privateKey = config.eth.account.pk
  return new Wallet(privateKey, provider) as T
}
