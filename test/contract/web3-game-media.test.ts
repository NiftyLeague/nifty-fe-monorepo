import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const gameCatalog = 'apps/app/src/constants/niftyworld-games.ts'

const MINI_GAME_ARTWORK = [
  'degen-dodge',
  'wen-2d',
  'degen-dive',
  'brick-breaker',
  'tennis',
  'wen-3d',
] as const

describe('Nifty World mini game card media', () => {
  it('uses the canonical Nifty World map artwork for every card', () => {
    const source = readFileSync(gameCatalog, 'utf8')

    for (const game of MINI_GAME_ARTWORK) {
      expect(source).toContain(`/assets/maps/${game}.webp`)
    }
  })
})
