import { existsSync, statSync } from 'node:fs'

import { describe, expect, it } from 'bun:test'

import { NIFTY_GAMES } from './games'

const ASSETS_ROOT = new URL('../../../../assets/', import.meta.url)

describe('website game media', () => {
  it('provides a compact poster for every local game video', () => {
    const localGames = NIFTY_GAMES.filter((game) => !game.video.includes('youtube'))

    expect(localGames.every((game) => game.poster)).toBe(true)

    for (const game of localGames) {
      if (!game.poster) throw new Error(`Missing poster for ${game.name}`)

      const posterPath = new URL(game.poster.slice(1), ASSETS_ROOT)

      expect(existsSync(posterPath)).toBe(true)
      expect(statSync(posterPath).size).toBeLessThan(300_000)
    }
  })
})
