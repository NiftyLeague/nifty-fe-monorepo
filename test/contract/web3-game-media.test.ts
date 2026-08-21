import { describe, expect, it } from 'bun:test'
import { readFileSync, statSync } from 'node:fs'

const web3GameList = 'apps/app/src/app/(public-routes)/games/_Web3GameList/index.tsx'

const CARD_ARTWORK = [
  ['assets/img/games/wen-poster-640.webp', 15_000],
  ['assets/img/games/crypto-winter-640.webp', 50_000],
  ['assets/img/games/nifty-tennis-640.webp', 70_000],
] as const

describe('Web3 game card media', () => {
  it('keeps deferred game cards on the shared, card-sized artwork variants', () => {
    const source = readFileSync(web3GameList, 'utf8')

    for (const [asset, maxBytes] of CARD_ARTWORK) {
      expect(source).toContain(`/img/games/${asset.split('/').pop()}`)
      expect(statSync(asset).size).toBeLessThan(maxBytes)
    }
  })
})
