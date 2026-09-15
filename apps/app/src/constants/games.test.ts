import { describe, expect, it } from 'bun:test'

import { getGameViewedAnalyticsContentId } from './games'

describe('getGameViewedAnalyticsContentId', () => {
  it('maps smashers pathnames to nifty_smashers', () => {
    expect(getGameViewedAnalyticsContentId('/games/smashers')).toBe('nifty_smashers')
    expect(getGameViewedAnalyticsContentId('/smashers/leaderboard')).toBe('nifty_smashers')
    expect(getGameViewedAnalyticsContentId('/play/smashers')).toBe('nifty_smashers')
  })

  it('maps mt-gawx pathnames to mt_gawx', () => {
    expect(getGameViewedAnalyticsContentId('/games/mt-gawx')).toBe('mt_gawx')
    expect(getGameViewedAnalyticsContentId('/mt-gawx/beta')).toBe('mt_gawx')
  })

  it('returns null for unknown or generic pathnames', () => {
    expect(getGameViewedAnalyticsContentId('/games/unknown')).toBeNull()
    expect(getGameViewedAnalyticsContentId('/')).toBeNull()
    expect(getGameViewedAnalyticsContentId('')).toBeNull()
    expect(getGameViewedAnalyticsContentId('/degens')).toBeNull()
    expect(getGameViewedAnalyticsContentId('/rentals')).toBeNull()
    expect(getGameViewedAnalyticsContentId('/games/wen-game')).toBeNull()
    expect(getGameViewedAnalyticsContentId('/games/crypto-winter')).toBeNull()
  })

  it('lets the smashers match win when a pathname contains both slugs', () => {
    // smashers check is first, so it wins in either order
    expect(getGameViewedAnalyticsContentId('/smashers/mt-gawx')).toBe('nifty_smashers')
    expect(getGameViewedAnalyticsContentId('/mt-gawx/smashers')).toBe('nifty_smashers')
  })

  it('is case-sensitive and requires exact substring match', () => {
    expect(getGameViewedAnalyticsContentId('/SMASHERS')).toBeNull()
    expect(getGameViewedAnalyticsContentId('/Smashers')).toBeNull()
  })
})
