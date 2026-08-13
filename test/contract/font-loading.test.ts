import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const fontLayoutContracts = [
  {
    app: 'web',
    layout: 'apps/web/src/app/layout.tsx',
    required: ['default', 'header', 'special'],
    omitted: ['subheader'],
  },
  {
    app: 'app',
    layout: 'apps/app/src/app/layout.tsx',
    required: ['default', 'header', 'subheader'],
    omitted: ['special'],
  },
  {
    app: 'smashers',
    layout: 'apps/smashers/src/app/layout.tsx',
    required: ['default', 'header', 'subheader', 'special'],
    omitted: [],
  },
] as const

describe('shared font loading contract', () => {
  for (const contract of fontLayoutContracts) {
    it(`${contract.app} loads only the font families required by its theme`, () => {
      const source = readFileSync(join(process.cwd(), contract.layout), 'utf8')

      expect(source).not.toContain("from '@nl/ui/fonts'")
      for (const font of contract.required) {
        expect(source).toContain(`from '@nl/ui/fonts/${font}'`)
      }
      for (const font of contract.omitted) {
        expect(source).not.toContain(`from '@nl/ui/fonts/${font}'`)
      }
    })
  }

  it('keeps only the browser-ready Nexa Rust font asset', () => {
    const fontDirectory = join(process.cwd(), 'packages/ui/src/lib/fonts/NexaRustSans_Black')

    expect(existsSync(join(fontDirectory, 'NexaRustSans-Black.woff2'))).toBe(true)
    for (const legacyAsset of [
      'NexaRustSans-Black.eot',
      'NexaRustSans-Black.otf',
      'NexaRustSans-Black.ttf',
      'NexaRustSans-Black.woff',
      'style.css',
    ]) {
      expect(existsSync(join(fontDirectory, legacyAsset))).toBe(false)
    }
  })
})
