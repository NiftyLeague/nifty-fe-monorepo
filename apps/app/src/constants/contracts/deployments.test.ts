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

describe('Ethereum client deployments', () => {
  it('contains the methods used by the app without bundling server-only registries', async () => {
    const { hardhat, mainnet, sepolia } = await import('viem/chains')
    const expectedMethods = {
      AllowedColorsStorage: ['isAllowedColor'],
      NFTLToken: [
        'accumulated',
        'accumulatedMultiCheck',
        'allowance',
        'approve',
        'balanceOf',
        'claim',
        'increaseAllowance',
      ],
      NiftyBurningComicsL2: ['burnComics'],
      NiftyDegen: [
        'changeName',
        'getCharacterTraits',
        'getNFTPrice',
        'getName',
        'getRemovedTraits',
        'ownerOf',
        'purchase',
      ],
    } as const

    for (const chainId of [hardhat.id, sepolia.id, mainnet.id]) {
      for (const [contractName, methods] of Object.entries(expectedMethods)) {
        expect(functionNames(deployments[chainId][contractName].abi)).toEqual(methods)
      }
    }
  })
})
