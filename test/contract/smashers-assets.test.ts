import { describe, expect, it } from 'bun:test'
import { readFileSync, statSync } from 'node:fs'

const headerSource = 'apps/smashers/src/components/Header/index.tsx'
const gameSectionSource = 'apps/smashers/src/components/GameSection/index.tsx'

const assets = [
  ['assets/img/games/smashers/background.gif', 'assets/img/games/smashers/background.webp'],
  ['assets/img/games/smashers/party_modes.gif', 'assets/img/games/smashers/party_modes.webp'],
] as const

describe('Smashers asset delivery contracts', () => {
  it('keeps optimized animated WebP sources smaller than GIF fallbacks', () => {
    for (const [gif, webp] of assets) {
      expect(statSync(webp).size).toBeLessThan(statSync(gif).size)
    }
  })

  it('keeps WebP sources paired with GIF fallbacks in the consuming components', () => {
    const header = readFileSync(headerSource, 'utf8')
    const gameSection = readFileSync(gameSectionSource, 'utf8')

    expect(header).toContain('background.webp')
    expect(header).toContain('background.gif')
    expect(gameSection).toContain('party_modes.webp')
    expect(gameSection).toContain('party_modes.gif')
  })
})
