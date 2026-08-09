import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

const fetchMock = mock()
const getContractAddressMock = mock(() => '0xcontract')

mock.module('node-fetch', () => ({ default: fetchMock }))
mock.module('node-config-ts', () => ({
  config: {
    eth: { opensea: 'opensea-key' },
    imx: {
      mainnet: {
        apiKey: 'main-key',
        collection: { contractAddress: '0xmain' },
        client: { publicApiUrl: 'https://main.imx.example' },
      },
      sepolia: {
        apiKey: 'test-key',
        collection: { contractAddress: '0xtest' },
        client: { publicApiUrl: 'https://test.imx.example' },
      },
    },
  },
}))
mock.module('@/contracts', () => ({ getContractAddress: getContractAddressMock }))
mock.module('./constants/metadata/degens', () => ({
  MARKETPLACE_ITEMS: [{ name: 'Arcade Token', image: 'ipfs://token' }],
}))

import { refreshImmutable, refreshOpenSea } from './refreshMetadata'

function response(status: number, statusText = '') {
  return {
    status,
    statusText,
    json: mock().mockResolvedValue({ accepted: true }),
  }
}

beforeEach(() => {
  ;(fetchMock.mockClear(), getContractAddressMock.mockClear())
  fetchMock.mockClear()
  getContractAddressMock.mockClear()
  spyOn(console, 'log').mockImplementation(() => undefined)
  spyOn(console, 'error').mockImplementation(() => undefined)
})

describe('refreshOpenSea', () => {
  it('posts a mainnet refresh and returns the JSON response', async () => {
    fetchMock.mockResolvedValue(response(200))

    await expect(refreshOpenSea('mainnet', 42)).resolves.toEqual({ accepted: true })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.opensea.io/api/v2/chain/ethereum/contract/0xcontract/nfts/42/refresh',
      { method: 'POST', headers: { 'X-API-KEY': 'opensea-key' } }
    )
  })

  it('uses the testnet endpoint and returns null on an upstream failure', async () => {
    fetchMock.mockResolvedValue(response(429, 'rate limited'))

    await expect(refreshOpenSea('sepolia', '7')).resolves.toBeNull()
    expect(fetchMock.mock.calls[0]?.[0]).toContain(
      'https://testnets-api.opensea.io/api/v2/chain/sepolia/'
    )
  })
})

describe('refreshImmutable', () => {
  it('posts marketplace metadata to the configured testnet collection', async () => {
    fetchMock.mockResolvedValue(response(202))

    const result = await refreshImmutable('sepolia')
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(
      'https://test.imx.example/chains/imtbl-zkevm-testnet/collections/0xtest/nfts/refresh-metadata'
    )
    expect(options.headers).toMatchObject({ 'x-immutable-api-key': 'test-key' })
    const parsed = JSON.parse(String(options.body))
    expect(parsed.nft_metadata[0]).toMatchObject({
      animation_url: '',
      youtube_url: '',
    })
    expect(parsed.nft_metadata.length).toBeGreaterThan(0)
  })

  it('returns null when the mainnet refresh is rejected', async () => {
    fetchMock.mockResolvedValue(response(500, 'unavailable'))

    await expect(refreshImmutable('mainnet')).resolves.toBeNull()
    expect(fetchMock.mock.calls[0]?.[0]).toContain('/chains/imtbl-zkevm-mainnet/')
  })
})
