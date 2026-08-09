import { describe, expect, it, mock } from 'bun:test'

const mockContract = mock(() => ({}) as never)
const mockGetWallet = mock()

mock.module('ethers', () => ({
  Contract: mockContract,
}))

mock.module('@/utils/wallet', () => ({
  getWallet: mockGetWallet,
}))

const { getDeployedContract, getContractAddress, getContractABI, getContractFactory } =
  await import('./index')

describe('contracts.getDeployedContract', () => {
  it('returns the mainnet deployment for mainnet', () => {
    const dep = getDeployedContract('mainnet', 'NiftyDegen')
    expect(dep).toBeDefined()
    expect(dep.address).toBeDefined()
  })

  it('returns the sepolia (testnet) deployment for sepolia', () => {
    const dep = getDeployedContract('sepolia', 'NiftyDegen')
    expect(dep).toBeDefined()
    expect(dep.address).toBeDefined()
  })
})

describe('contracts.getContractAddress', () => {
  it('returns the deployed address typed as 0x string', () => {
    const address = getContractAddress('mainnet', 'NiftyDegen')
    expect(typeof address).toBe('string')
    expect(address.startsWith('0x')).toBe(true)
  })
})

describe('contracts.getContractABI', () => {
  it('returns the deployed ABI', () => {
    const abi = getContractABI('mainnet', 'NiftyDegen')
    expect(Array.isArray(abi)).toBe(true)
  })
})

describe('contracts.getContractFactory', () => {
  it('constructs a Contract with address, abi and the wallet', async () => {
    const contract = await getContractFactory('mainnet', 'NiftyDegen')
    expect(mockGetWallet).toHaveBeenCalledTimes(1)
    expect(mockContract).toHaveBeenCalledTimes(1)
    expect(contract).toBeDefined()
  })
})
