import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync, statSync } from 'node:fs'

const docsPage = 'apps/docs/docs/overview/nfts/degens/about.md'
const docsMediaPages = [
  'apps/docs/docs/overview/games/mini-games/arcade-tokens.md',
  'apps/docs/docs/overview/games/mini-games/crypto-winter.md',
  'apps/docs/docs/overview/games/mini-games/wen-game.md',
  'apps/docs/docs/overview/games/niftyworld/niftyworld.mdx',
  'apps/docs/docs/overview/games/overview.md',
  'apps/docs/docs/overview/games/mobile-games/nifty-royale.md',
  'apps/docs/docs/overview/games/mobile-games/nifty-smashers.md',
  'apps/docs/docs/overview/nfts/nifty-marketplace/items.md',
  'apps/docs/docs/overview/nfts/nifty-marketplace/comics.md',
  docsPage,
]

const legacyAsset = 'assets/img/games/nifty-royale/nifty-royale.gif'
const mintWebp = 'assets/img/mint-o-matic/degen-mint.webp'
const mintPoster = 'assets/img/mint-o-matic/degen-mint-poster.webp'

describe('shared docs media policy', () => {
  it('uses shared lazy media primitives instead of react-player', () => {
    for (const page of docsMediaPages) {
      const source = readFileSync(page, 'utf8')
      expect(source).not.toContain('react-player')
      expect(source).toMatch(
        /@nl\/ui\/custom\/(deferred-youtube-embed|lazy-youtube-embed|viewport-video)/
      )
    }
  })

  it('gates the Mint-O-Matic animation behind motion preference with a static fallback', () => {
    const source = readFileSync(docsPage, 'utf8')

    expect(source).toContain('degen-mint.webp')
    expect(source).toContain('degen-mint-poster.webp')
    expect(source).toContain('prefers-reduced-motion: no-preference')
    expect(source).not.toContain('degen-mint.gif')
    expect(source).toContain('alt="Mint-O-Matic character creator"')
    expect(statSync(mintPoster).size).toBeLessThan(statSync(mintWebp).size)
  })

  it('does not retain the unreferenced 48 MB Nifty Royale GIF', () => {
    expect(existsSync(legacyAsset)).toBe(false)
  })
})
