import { describe, expect, it } from 'bun:test'

import clientDeployments from './deployments/client'
import mainnet from './deployments/mainnet'
import sepolia from './deployments/sepolia'

const clientMethods = {
  AllowedColorsStorage: ['isAllowedColor'],
  BalanceManager: [
    'admin',
    'changeAdmin',
    'implementation',
    'upgradeTo',
    'upgradeToAndCall',
    'deposit',
    'initialize',
    'maintainer',
    'nftl',
    'nonce',
    'owner',
    'renounceOwnership',
    'signatures',
    'transferOwnership',
    'updateMaintainer',
    'withdraw',
    'withdrawByDAO',
  ],
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

const functionByName = (abi: readonly unknown[], name: string) =>
  abi.find(
    (entry) =>
      typeof entry === 'object' &&
      entry !== null &&
      'type' in entry &&
      'name' in entry &&
      entry.type === 'function' &&
      entry.name === name
  )

const withoutParameterNames = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(withoutParameterNames)
  if (typeof value !== 'object' || value === null) return value

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== 'name' && key !== 'internalType')
      .map(([key, child]) => [key, withoutParameterNames(child)])
  )
}

const functionShape = (entry: unknown) => {
  if (typeof entry !== 'object' || entry === null || !('name' in entry)) return entry
  const { name, ...rest } = entry
  return { name, ...withoutParameterNames(rest) }
}

describe('shared contract deployments', () => {
  it('preserves the network metadata and contract registry used by the app and api', () => {
    expect(mainnet.name).toBe('mainnet')
    expect(mainnet.chainId).toBe('1')
    expect(sepolia.name).toBe('sepolia')
    expect(sepolia.chainId).toBe('11155111')

    for (const deployment of [mainnet, sepolia]) {
      expect(deployment.contracts.NFTLToken.address).toMatch(/^0x[0-9a-fA-F]{40}$/)
      expect(deployment.contracts.NFTLToken.abi.length).toBeGreaterThan(0)
      expect(deployment.contracts.NiftyDegen.address).toMatch(/^0x[0-9a-fA-F]{40}$/)
      expect(deployment.contracts.NiftyDegen.abi.length).toBeGreaterThan(0)
    }
  })
})

describe('client contract deployments', () => {
  it('keeps client addresses and used ABI signatures aligned with generated deployments', () => {
    for (const deployment of [mainnet, sepolia]) {
      const client = clientDeployments[Number(deployment.chainId)]

      for (const [contractName, methods] of Object.entries(clientMethods)) {
        expect(client[contractName].address).toBe(deployment.contracts[contractName].address)
        for (const method of methods) {
          expect(functionShape(functionByName(client[contractName].abi, method))).toEqual(
            functionShape(functionByName(deployment.contracts[contractName].abi, method))
          )
        }
      }
    }

    expect(clientDeployments[31337].NFTLToken.address).toMatch(/^0x[0-9a-fA-F]{40}$/)
    expect(clientDeployments[31337].NiftyDegen.address).toMatch(/^0x[0-9a-fA-F]{40}$/)
  })
})
