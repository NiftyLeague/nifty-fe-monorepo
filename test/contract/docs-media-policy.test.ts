import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync, statSync } from 'node:fs'

const docsPage = 'apps/docs/docs/overview/nfts/degens/about.md'
const legacyAsset = 'assets/img/games/nifty-royale/nifty-royale.gif'
const mintGif = 'assets/img/mint-o-matic/degen-mint.gif'
const mintWebp = 'assets/img/mint-o-matic/degen-mint.webp'

describe('shared docs media policy', () => {
  it('pairs the Mint-O-Matic animation with a smaller WebP source and GIF fallback', () => {
    const source = readFileSync(docsPage, 'utf8')

    expect(source).toContain('degen-mint.webp')
    expect(source).toContain('degen-mint.gif')
    expect(source).toContain('alt="Mint-O-Matic character creator"')
    expect(statSync(mintWebp).size).toBeLessThan(statSync(mintGif).size)
  })

  it('does not retain the unreferenced 48 MB Nifty Royale GIF', () => {
    expect(existsSync(legacyAsset)).toBe(false)
  })
})
