import { describe, expect, it } from 'bun:test'

import mainnet from './deployments/mainnet'
import sepolia from './deployments/sepolia'

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
