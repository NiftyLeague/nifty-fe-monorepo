import { beforeEach, describe, expect, it, mock, spyOn } from 'bun:test'

const fetchMock = mock().mockResolvedValue({
  json: async () => ({ ownedNfts: [], pageKey: undefined }),
})
const sleepMock = mock().mockResolvedValue(undefined)

mock.module('node-fetch', () => ({ default: fetchMock }))
mock.module('node-config-ts', () => ({
  config: {
    eth: { network: 'mainnet', alchemy: { mainnet: 'alchemy-key' } },
  },
}))
mock.module('@/contracts', () => ({ getContractAddress: () => '0xdegen' }))
mock.module('./api', () => ({
  sleep: sleepMock,
  withCache: (_ttl: number, fn: () => unknown) => fn,
}))

import { fetchBurnedDegens } from './degensBurned'

function page(ownedNfts: Array<{ tokenId: string }>, pageKey?: string) {
  return {
    json: mock().mockResolvedValue({
      ownedNfts: ownedNfts.map(({ tokenId }) => ({
        tokenId,
        contractAddress: '0xdegen',
        balance: '1',
      })),
      pageKey,
    }),
  }
}

beforeEach(() => {
  fetchMock.mockClear()
  sleepMock.mockClear()
})

describe('fetchBurnedDegens', () => {
  it('collects both burn wallets, follows pagination, and sorts token IDs', async () => {
    fetchMock
      .mockResolvedValueOnce(page([{ tokenId: '9' }, { tokenId: '2' }], 'next'))
      .mockResolvedValueOnce(page([{ tokenId: '5' }]))
      .mockResolvedValueOnce(page([{ tokenId: '1' }]))

    await expect(fetchBurnedDegens()).resolves.toEqual([1, 2, 5, 9])
    expect(fetchMock).toHaveBeenCalledTimes(3)
    const urls = fetchMock.mock.calls.map((c) => c[0] as string)
    // Both burn wallets are queried (concurrently) and pagination is followed.
    expect(urls.filter((u) => u.includes('&pageKey=next'))).toHaveLength(1)
    expect(
      urls.filter((u) => u.includes('&owner=0x0000000000000000000000000000000000000001'))
    ).toHaveLength(1)
    expect(
      urls.filter((u) => u.includes('&owner=0x000000000000000000000000000000000000dEaD'))
    ).toHaveLength(2)
    expect(sleepMock).toHaveBeenCalledTimes(3)
  })

  it('returns an empty list when Alchemy is unavailable', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))

    await expect(fetchBurnedDegens()).resolves.toEqual([])
  })
})
