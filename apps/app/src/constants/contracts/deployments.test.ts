import { describe, expect, it } from 'bun:test'
import { immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains'

import deployments from './deployments'

const functionNames = (abi: readonly unknown[]) =>
  abi.flatMap((entry) => {
    if (typeof entry !== 'object' || entry === null || !('type' in entry) || !('name' in entry))
      return []

    const item = entry as { name?: unknown; type?: unknown }
    return item.type === 'function' && typeof item.name === 'string' ? [item.name] : []
  })

describe('Immutable contract deployments', () => {
  it('keeps only the ABI methods used by the app', () => {
    for (const chainId of [immutableZkEvmTestnet.id, immutableZkEvm.id]) {
      expect(deployments[chainId].BalanceManagerDistributor.address).toMatch(/^0x[0-9a-fA-F]{40}$/)
      expect(functionNames(deployments[chainId].BalanceManagerDistributor.abi)).toEqual([
        'claim',
        'isClaimed',
      ])
      expect(functionNames(deployments[chainId].NFTL.abi)).toEqual(['balanceOf'])
      expect(functionNames(deployments[chainId].NiftyMarketplace.abi)).toEqual([
        'balanceOfBatch',
        'isApprovedForAll',
        'setApprovalForAll',
      ])
    }
  })
})
