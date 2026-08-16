import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const marketingEmbedConsumers = [
  'apps/web/src/app/(main)/games/page.tsx',
  'apps/web/src/app/(main)/compete-and-earn/page.tsx',
  'apps/web/src/app/(main)/degens/page.tsx',
]

describe('marketing video embed policy', () => {
  it('uses shared YouTube primitives for every marketing embed', () => {
    for (const file of marketingEmbedConsumers) {
      const source = readFileSync(file, 'utf8')

      expect(source).toMatch(/@nl\/ui\/custom\/(lazy-youtube-embed|deferred-youtube-embed)/)
      expect(source).not.toMatch(/<iframe\b/)
    }
  })

  it('gates below-fold marketing embeds behind the shared viewport observer', () => {
    for (const file of marketingEmbedConsumers.slice(1)) {
      const source = readFileSync(file, 'utf8')

      expect(source).toContain('@nl/ui/custom/deferred-youtube-embed')
    }
  })
})
