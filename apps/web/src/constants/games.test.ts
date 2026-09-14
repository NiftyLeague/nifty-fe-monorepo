import { describe, expect, it } from 'bun:test'

import { NIFTY_APP_URL, NIFTY_WORLD_APP_URL } from './links'
import { NIFTY_GAMES } from './games'

describe('website game catalog', () => {
  it('keeps the flagship separate and the remaining lineup even for two-column rows', () => {
    expect(NIFTY_GAMES[0]?.name).toBe('NIFTY SMASHERS')
    expect((NIFTY_GAMES.length - 1) % 2).toBe(0)
  })

  it('uses the correct app route for each game', () => {
    const expectedLinks = {
      'NIFTY WORLD': NIFTY_WORLD_APP_URL,
      'NIFTY ROYALE': NIFTY_APP_URL,
      '2D SMASHERS': `${NIFTY_APP_URL}/games/smashers`,
      'DEGEN DODGE': `${NIFTY_APP_URL}/games/degen-dodge`,
      'WEN 2D': `${NIFTY_APP_URL}/games/wen-2d`,
      'WEN 3D': `${NIFTY_APP_URL}/games/wen-3d`,
      'MT. GAWX': `${NIFTY_APP_URL}/games/mt-gawx`,
      'DEGEN DIVE': `${NIFTY_APP_URL}/games/degen-dive`,
      'BRICK BREAKER': `${NIFTY_APP_URL}/games/brick-breaker`,
      'NIFTY TENNIS': `${NIFTY_APP_URL}/games/tennis`,
    } as const

    expect(NIFTY_GAMES[0]?.link).toBe('https://niftysmashers.com')
    for (const game of NIFTY_GAMES.slice(1)) {
      expect(game.link).toBe(expectedLinks[game.name as keyof typeof expectedLinks])
    }
  })

  it('keeps game labels concise and consistent', () => {
    expect(NIFTY_GAMES.map((game) => game.tag)).toEqual([
      'MOBILE / PC',
      'OPEN WORLD',
      'MOBILE / PC',
      'BROWSER',
      'MINI-GAME',
      'MINI-GAME',
      'MINI-GAME',
      'MINI-GAME',
      'MINI-GAME',
      'MINI-GAME',
      'MINI-GAME',
    ])
  })
})
