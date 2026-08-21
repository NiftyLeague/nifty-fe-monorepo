import type { InterfaceAbi } from 'ethers'

import CLIENT_DEPLOYMENTS from '@nl/contracts/deployments/client'
import IMX_CONTRACTS from './deployments.imx'

const CONTRACTS: {
  [chainId: number]: { [contractName: string]: { address: `0x${string}`; abi: InterfaceAbi } }
} = { ...(CLIENT_DEPLOYMENTS as typeof CONTRACTS), ...IMX_CONTRACTS }

export default CONTRACTS
