import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const marketingEmbedConsumers = [
  'apps/web/src/app/(main)/compete-and-earn/page.tsx',
  'apps/web/src/app/(main)/degens/page.tsx',
  'apps/web/src/pages/compete-and-earn.astro',
  'apps/web/src/pages/degens.astro',
  'apps/web/src/components/GameCard.tsx',
]

describe('marketing video embed policy', () => {
  it('routes every marketing embed through the click-to-play facade', () => {
    for (const file of marketingEmbedConsumers) {
      const source = readFileSync(file, 'utf8')

      expect(source).toContain('YouTubeFacade')
      expect(source).not.toMatch(/<iframe\b/)
    }
  })

  it('keeps the facade on the shared lazy embed primitive with autoplay-on-click', () => {
    const facade = readFileSync('apps/web/src/components/YouTubeFacade.tsx', 'utf8')

    expect(facade).toContain('@nl/ui/custom/lazy-youtube-embed')
    expect(facade).toContain('autoplay=1')
  })
})
