import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const marketingVideoConsumers = [
  'apps/web/src/app/(main)/compete-and-earn/page.tsx',
  'apps/web/src/app/(main)/degens/page.tsx',
  'apps/web/src/pages/compete-and-earn.astro',
  'apps/web/src/pages/degens.astro',
]

describe('marketing video embed policy', () => {
  it('uses the shared deferred YouTube primitive for every marketing video consumer', () => {
    for (const file of marketingVideoConsumers) {
      const source = readFileSync(file, 'utf8')

      expect(source).toContain('@nl/ui/custom/deferred-youtube-embed')
      expect(source).not.toMatch(/<iframe\b/)
      expect(source).not.toContain('YouTubeFacade')
    }
  })
})
