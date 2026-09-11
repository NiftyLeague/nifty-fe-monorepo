import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync, statSync } from 'node:fs'

const docsPage = 'apps/docs/src/content/docs/overview/nfts/degens/about.mdx'
const docsMediaPages = [
  'apps/docs/src/content/docs/overview/games/mini-games/arcade-tokens.mdx',
  'apps/docs/src/content/docs/overview/games/mini-games/crypto-winter.mdx',
  'apps/docs/src/content/docs/overview/games/mini-games/wen-game.mdx',
  'apps/docs/src/content/docs/overview/games/niftyworld/index.mdx',
  'apps/docs/src/content/docs/overview/games/games-overview.mdx',
  'apps/docs/src/content/docs/overview/games/mobile-games/nifty-royale.mdx',
  'apps/docs/src/content/docs/overview/games/mobile-games/nifty-smashers.mdx',
  'apps/docs/src/content/docs/overview/nfts/nifty-marketplace/items.mdx',
  'apps/docs/src/content/docs/overview/nfts/nifty-marketplace/comics.mdx',
  docsPage,
]

const legacyAsset = 'assets/img/games/nifty-royale/nifty-royale.gif'
const mintWebp = 'assets/img/mint-o-matic/degen-mint.webp'
const mintPoster = 'assets/img/mint-o-matic/degen-mint-poster.webp'
const roadmapPage = 'apps/docs/src/content/docs/overview/roadmap.md'
const roadmapPoster = 'assets/img/roadmap/nifty_roadmap.webp'

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

  it('defers every documentation video until after viewport activation settles', () => {
    for (const page of docsMediaPages) {
      const source = readFileSync(page, 'utf8')
      const videoBlocks = [...source.matchAll(/<ViewportVideo\b[\s\S]*?\/>/g)].map(
        ([block]) => block
      )

      for (const videoBlock of videoBlocks) {
        expect(videoBlock).toContain('deferLoad')
      }
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

  it('keeps the docs roadmap poster accessible, dimensioned, and deferred', () => {
    const source = readFileSync(roadmapPage, 'utf8')

    expect(source).toContain('<img')
    expect(source).toContain('alt="Nifty League product roadmap"')
    expect(source).toContain('width="1800"')
    expect(source).toContain('height="3791"')
    expect(source).toContain('loading="lazy"')
    expect(source).toContain('decoding="async"')
    expect(statSync(roadmapPoster).size).toBeLessThan(1_100_000)
  })
})
