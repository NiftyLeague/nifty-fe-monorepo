import { Contract } from 'ethers'
import type { TargetNetwork, ContractName } from '@/types'
import MAINNET_DEPLOYMENTS from './deployments.mainnet'
import TESTNET_DEPLOYMENTS from './deployments.sepolia'
import { getWallet } from '@/utils/wallet'

export const getDeployedContract = (targetNetwork: TargetNetwork, contractName: ContractName) => {
  const deployments = targetNetwork === 'mainnet' ? MAINNET_DEPLOYMENTS : TESTNET_DEPLOYMENTS
  return deployments.contracts[contractName]
}

export const getContractAddress = (targetNetwork: TargetNetwork, contractName: ContractName) => {
  return getDeployedContract(targetNetwork, contractName).address as `0x${string}`
}

export const getContractABI = (targetNetwork: TargetNetwork, contractName: ContractName) => {
  return getDeployedContract(targetNetwork, contractName).abi
}

/**
 * Get NFT contract initialized with ABI & target address
 */
export async function getContractFactory<T = Contract>(
  targetNetwork: TargetNetwork,
  contractName: ContractName
): Promise<T> {
  const { address, abi } = getDeployedContract(targetNetwork, contractName)
  const wallet = getWallet()
  return new Contract(address, abi, wallet) as T
}
