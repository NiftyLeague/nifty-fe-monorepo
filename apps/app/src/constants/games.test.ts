import { describe, expect, it } from 'bun:test'

import { getGameViewedAnalyticsContentId } from './games'

describe('getGameViewedAnalyticsContentId', () => {
  it('maps smashers pathnames to nifty_smashers', () => {
    expect(getGameViewedAnalyticsContentId('/games/smashers')).toBe('nifty_smashers')
    expect(getGameViewedAnalyticsContentId('/smashers/leaderboard')).toBe('nifty_smashers')
    expect(getGameViewedAnalyticsContentId('/play/smashers')).toBe('nifty_smashers')
  })

  it('maps wen-game pathnames to wen_game', () => {
    expect(getGameViewedAnalyticsContentId('/games/wen-game')).toBe('wen_game')
    expect(getGameViewedAnalyticsContentId('/wen-game/play')).toBe('wen_game')
  })

  it('maps mt-gawx pathnames to mt_gawx', () => {
    expect(getGameViewedAnalyticsContentId('/games/mt-gawx')).toBe('mt_gawx')
    expect(getGameViewedAnalyticsContentId('/mt-gawx/beta')).toBe('mt_gawx')
  })

  it('maps crypto-winter pathnames to crypto_winter', () => {
    expect(getGameViewedAnalyticsContentId('/games/crypto-winter')).toBe('crypto_winter')
    expect(getGameViewedAnalyticsContentId('/crypto-winter/play')).toBe('crypto_winter')
  })

  it('returns null for unknown or generic pathnames', () => {
    expect(getGameViewedAnalyticsContentId('/games/unknown')).toBeNull()
    expect(getGameViewedAnalyticsContentId('/')).toBeNull()
    expect(getGameViewedAnalyticsContentId('')).toBeNull()
    expect(getGameViewedAnalyticsContentId('/degens')).toBeNull()
    expect(getGameViewedAnalyticsContentId('/rentals')).toBeNull()
  })

  it('respects priority order when pathname contains multiple game slugs', () => {
    // smashers check is first, so it wins
    expect(getGameViewedAnalyticsContentId('/smashers/wen-game')).toBe('nifty_smashers')
    expect(getGameViewedAnalyticsContentId('/wen-game/crypto-winter')).toBe('wen_game')
    expect(getGameViewedAnalyticsContentId('/mt-gawx/crypto-winter')).toBe('mt_gawx')
  })

  it('is case-sensitive and requires exact substring match', () => {
    expect(getGameViewedAnalyticsContentId('/SMASHERS')).toBeNull()
    expect(getGameViewedAnalyticsContentId('/Smashers')).toBeNull()
  })
})
