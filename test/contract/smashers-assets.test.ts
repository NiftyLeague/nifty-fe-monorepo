import { describe, expect, it } from 'bun:test'
import { readFileSync, statSync } from 'node:fs'

const headerSource = 'apps/smashers/src/components/Header/index.tsx'
const deferredBackgroundSource = 'apps/smashers/src/components/Header/DeferredHeroBackground.tsx'
const deferredAnimationSource = 'assets/scripts/smashers-hero-animation.js'
const gameSectionSource = 'apps/smashers/src/components/GameSection/index.tsx'
const rocketVideo = 'assets/video/rocket.mp4'

const assets = [
  ['assets/img/games/smashers/background.gif', 'assets/img/games/smashers/background.webp'],
] as const

describe('Smashers asset delivery contracts', () => {
  it('keeps optimized animated WebP sources smaller than GIF fallbacks', () => {
    for (const [gif, webp] of assets) {
      expect(statSync(webp).size).toBeLessThan(statSync(gif).size)
    }
  })

  it('keeps animated sources paired with static fallbacks in the consuming components', () => {
    const header = readFileSync(headerSource, 'utf8')
    const deferredBackground = readFileSync(deferredBackgroundSource, 'utf8')
    const deferredAnimation = readFileSync(deferredAnimationSource, 'utf8')
    const gameSection = readFileSync(gameSectionSource, 'utf8')

    expect(header).toContain('DeferredHeroBackground')
    expect(deferredBackground).toContain("from '@nl/ui/custom/deferred-external-script'")
    expect(deferredBackground).toContain('<DeferredExternalScript')
    expect(deferredBackground).toContain('smashers-hero-animation.js')
    expect(deferredBackground).not.toContain("'use client'")
    expect(deferredBackground).toContain('smashers-poster.jpg')
    expect(deferredBackground).toContain('data-smashers-hero-background')
    expect(deferredAnimation).toContain('background.webp')
    expect(deferredAnimation).toContain('background.gif')
    expect(deferredAnimation).toContain('data-smashers-hero-background')
    expect(deferredAnimation).toContain('prefers-reduced-motion: reduce')
    expect(deferredAnimation).toContain('navigator.connection?.saveData')
    expect(deferredAnimation).toContain('if (prefersReducedMotion || prefersDataSaving) return')
    expect(deferredAnimation).toContain("removeAttribute('srcset')")
    expect(statSync('assets/img/games/smashers/party_modes-poster.webp').size).toBeLessThan(
      statSync('assets/img/games/smashers/party_modes.webp').size,
    )
    expect(gameSection).toContain('party_modes.webp')
    expect(gameSection).toContain('party_modes-poster.webp')
    expect(gameSection).toContain('prefers-reduced-motion: no-preference')
    expect(gameSection).toContain('height={566}')
    expect(gameSection).not.toContain('party_modes.gif')
  })

  it('keeps the muted Smashers viewport video on the compact delivery asset', () => {
    const gameSection = readFileSync(gameSectionSource, 'utf8')

    expect(gameSection).toContain('src="/video/rocket.mp4"')
    expect(statSync(rocketVideo).size).toBeLessThan(2_000_000)
  })
})
