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
  it('uses the shared deferred YouTube primitive for every marketing embed', () => {
    for (const file of marketingEmbedConsumers) {
      const source = readFileSync(file, 'utf8')

      expect(source).toContain('@nl/ui/custom/deferred-youtube-embed')
      expect(source).not.toMatch(/<iframe\b/)
      expect(source).not.toContain('YouTubeFacade')
    }
  })
})
