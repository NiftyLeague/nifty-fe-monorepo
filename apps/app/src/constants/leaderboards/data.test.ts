import { describe, expect, it } from 'bun:test'

import { loadLeaderboard } from './data'

describe('leaderboard data loader', () => {
  it.each([
    ['crypto_winter', 'score'],
    ['nftl_burner', 'burnings'],
    ['nifty_smashers', 'kills'],
    ['wen_game', 'score'],
  ])('loads the %s dataset on demand', async (gameType, scoreType) => {
    const leaderboard = await loadLeaderboard(gameType)

    expect(leaderboard?.[scoreType]).toBeArray()
    expect(leaderboard?.[scoreType]?.length).toBeGreaterThan(0)
  })

  it('does not load a dataset for an unknown game', async () => {
    await expect(loadLeaderboard('unknown')).resolves.toBeUndefined()
  })
})
