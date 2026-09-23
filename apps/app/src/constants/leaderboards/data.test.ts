import { afterEach, describe, expect, it, mock } from 'bun:test'

import { loadLeaderboard } from './data'

const fixture = {
  score: [{ rank: 1, user_id: 'degen', score: '100', stats: { kills: '3' } }],
}

const originalFetch = globalThis.fetch
afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('leaderboard data loader', () => {
  it.each(['crypto_winter', 'nftl_burner', 'nifty_smashers', 'wen_game'])(
    'fetches the %s dataset from the CDN',
    async (gameType) => {
      globalThis.fetch = mock(async () => new Response(JSON.stringify(fixture)))

      const leaderboard = await loadLeaderboard(gameType)

      expect(globalThis.fetch).toHaveBeenCalledWith(
        `https://cdn.niftyleague.com/cache/leaderboards/${gameType}.json`
      )
      expect(leaderboard).toEqual(fixture)
    }
  )

  it('does not fetch a dataset for an unknown game', async () => {
    globalThis.fetch = mock()

    await expect(loadLeaderboard('unknown')).resolves.toBeUndefined()
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('throws when the CDN cannot serve a dataset', async () => {
    globalThis.fetch = mock(async () => new Response('nope', { status: 404 }))

    await expect(loadLeaderboard('nifty_smashers')).rejects.toThrow('Failed to load leaderboard')
  })
})
