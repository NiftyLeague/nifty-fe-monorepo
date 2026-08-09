import { beforeEach, describe, expect, it, mock } from 'bun:test'

const mockFetch = mock<() => Promise<any>>()
const mockGetContractFactory = mock<() => Promise<any>>()
const mockGetBurnedDegens = mock<() => Promise<any>>()

const mockConfig = {
  eth: {
    network: 'mainnet',
    etherscan: '',
    alchemy: { mainnet: 'mainnet-key', sepolia: 'sepolia-key' },
  },
}

mock.module('node-config-ts', () => ({
  config: mockConfig,
}))

mock.module('node-fetch', () => ({
  default: mockFetch,
}))

mock.module('@/contracts', () => ({
  getContractFactory: mockGetContractFactory,
  getContractAddress: mock(),
}))

mock.module('@/utils/degensBurned', () => ({
  getBurnedDegens: mockGetBurnedDegens,
}))

const {
  resolveCirculatingSupplyImpl,
  resolveUnclaimedSupplyImpl,
  resolveTotalSupplyImpl,
  resolveMaxSupplyImpl,
} = await import('./nftl')

// The exported resolvers are memoized (withCache) for production resilience;
// the *Impl variants are the raw implementations, which is what this unit suite
// exercises in isolation.
const resolveCirculatingSupply = resolveCirculatingSupplyImpl
const resolveUnclaimedSupply = resolveUnclaimedSupplyImpl
const resolveTotalSupply = resolveTotalSupplyImpl
const resolveMaxSupply = resolveMaxSupplyImpl

const CIRCULATING = 500000000000000000000000001n
const UNCLAIMED = 1234n

function mockContract() {
  return {
    totalSupply: mock<() => Promise<any>>(),
    accumulatedMultiCheck: mock<() => Promise<any>>(),
  }
}

beforeEach(() => {
  mockFetch.mockClear()
  mockGetContractFactory.mockClear()
  mockGetBurnedDegens.mockClear()

  mockConfig.eth.etherscan = ''
  const contract = mockContract()
  contract.totalSupply.mockResolvedValue(CIRCULATING)
  contract.accumulatedMultiCheck.mockResolvedValue(UNCLAIMED)
  mockGetContractFactory.mockResolvedValue(contract)
  mockGetBurnedDegens.mockResolvedValue([])
  mockFetch.mockClear()
})

describe('resolveCirculatingSupply', () => {
  it('uses the Etherscan v2 result when configured and valid', async () => {
    mockConfig.eth.etherscan = 'fake-key'
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ status: '1', result: CIRCULATING.toString() }),
      text: async () => '',
    })

    const result = await resolveCirculatingSupply()

    expect(mockFetch).toHaveBeenCalledTimes(1)
    expect(mockGetContractFactory).not.toHaveBeenCalled()
    expect(result).toBe(CIRCULATING.toString())
  })

  it('falls back to the contract when Etherscan returns a non-numeric result', async () => {
    mockConfig.eth.etherscan = 'fake-key'
    mockFetch.mockResolvedValue({
      status: 200,
      json: async () => ({ status: '0', result: 'NOT_A_NUMBER' }),
      text: async () => '',
    })

    const result = await resolveCirculatingSupply()

    expect(mockGetContractFactory).toHaveBeenCalledTimes(1)
    expect(result).toBe(CIRCULATING.toString())
  })

  it('falls back to the contract when no Etherscan key is configured', async () => {
    mockConfig.eth.etherscan = ''

    const result = await resolveCirculatingSupply()

    expect(mockFetch).not.toHaveBeenCalled()
    expect(mockGetContractFactory).toHaveBeenCalledTimes(1)
    expect(result).toBe(CIRCULATING.toString())
  })

  it('returns null when the contract is unavailable', async () => {
    mockConfig.eth.etherscan = ''
    mockGetContractFactory.mockResolvedValue(null)

    const result = await resolveCirculatingSupply()

    expect(result).toBeNull()
  })

  it('falls back to the contract and logs when Etherscan returns a non-OK status', async () => {
    mockConfig.eth.etherscan = 'fake-key'
    mockFetch.mockResolvedValue({
      status: 429,
      json: async () => ({}),
      text: async () => 'rate limited',
    })

    const result = await resolveCirculatingSupply()

    expect(mockGetContractFactory).toHaveBeenCalledTimes(1)
    expect(result).toBe(CIRCULATING.toString())
  })

  it('falls back to the contract when the Etherscan fetch throws', async () => {
    mockConfig.eth.etherscan = 'fake-key'
    mockFetch.mockRejectedValue(new Error('network down'))

    const result = await resolveCirculatingSupply()

    expect(mockGetContractFactory).toHaveBeenCalledTimes(1)
    expect(result).toBe(CIRCULATING.toString())
  })

  it('returns null when both Etherscan and the outer fallback fail', async () => {
    mockConfig.eth.etherscan = ''
    mockGetContractFactory.mockRejectedValue(new Error('rpc dead'))

    const result = await resolveCirculatingSupply()

    expect(result).toBeNull()
  })
})

describe('resolveUnclaimedSupply', () => {
  it('sums accumulated rewards over active degens', async () => {
    mockGetBurnedDegens.mockResolvedValue([1, 2, 3])

    const result = await resolveUnclaimedSupply()

    expect(mockGetBurnedDegens).toHaveBeenCalledTimes(1)
    expect(mockGetContractFactory).toHaveBeenCalledTimes(1)
    expect(result).toBe(UNCLAIMED.toString())
  })

  it('returns null when the contract is unavailable', async () => {
    mockGetContractFactory.mockResolvedValue(null)

    const result = await resolveUnclaimedSupply()

    expect(result).toBeNull()
  })
})

describe('resolveTotalSupply', () => {
  it('is the sum of circulating and unclaimed supply', async () => {
    const result = await resolveTotalSupply()

    expect(result).toBe((CIRCULATING + UNCLAIMED).toString())
  })

  it('returns null when a component is missing', async () => {
    mockGetContractFactory.mockResolvedValue(null)

    const result = await resolveTotalSupply()

    expect(result).toBeNull()
  })
})

describe('resolveMaxSupply', () => {
  it('adds remaining emissions to the total (zero after the emission end date)', async () => {
    const result = await resolveMaxSupply()

    expect(result).toBe((CIRCULATING + UNCLAIMED).toString())
  })

  it('returns null when the total supply cannot be resolved', async () => {
    mockGetContractFactory.mockResolvedValue(null)

    const result = await resolveMaxSupply()

    expect(result).toBeNull()
  })
})

describe('resolveCirculatingSupply — retry path', () => {
  it('retries contract call in the outer catch when the first getContractFactory attempt fails', async () => {
    const contract = mockContract()
    contract.totalSupply.mockResolvedValue(CIRCULATING)
    mockGetContractFactory
      .mockRejectedValueOnce(new Error('rpc timeout'))
      .mockResolvedValue(contract)

    const result = await resolveCirculatingSupply()

    expect(mockGetContractFactory).toHaveBeenCalledTimes(2)
    expect(result).toBe(CIRCULATING.toString())
  })
})

describe('resolveUnclaimedSupply — throw path', () => {
  it('returns null when the contract factory rejects', async () => {
    mockGetContractFactory.mockRejectedValue(new Error('rpc dead'))

    const result = await resolveUnclaimedSupply()

    expect(result).toBeNull()
  })
})
