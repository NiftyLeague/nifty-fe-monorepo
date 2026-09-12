import { describe, expect, it } from 'bun:test'
import { readFileSync, statSync } from 'node:fs'

const headerSource = 'apps/smashers/src/components/Header/index.tsx'
const deferredBackgroundSource = 'apps/smashers/src/components/Header/DeferredHeroBackground.tsx'
const deferredAnimationSource = 'assets/scripts/smashers-hero-animation.js'
const gameSectionSource = 'apps/smashers/src/components/GameSection/index.tsx'
const rocketVideo = 'assets/video/rocket.mp4'
const heroVideo = 'assets/video/smashers-hero.mp4'
const partyModesVideo = 'assets/video/party-modes.mp4'
const rocketPoster = 'assets/img/games/smashers/rocket-poster.webp'
const heroPoster = 'assets/img/games/smashers/background-poster.webp'

describe('Smashers asset delivery contracts', () => {
  it('keeps both home-page animations on the video pipeline within budget', () => {
    // Animated WebP carried 3.4 MB (hero) and 8.3 MB (party modes) for the same
    // frames; the video encodes are 464 KB and 1.2 MB. These budgets are the
    // regression guard that the previous 3.6 MB and 9.25 MB limits were not.
    expect(statSync(heroVideo).size).toBeLessThan(700_000)
    expect(statSync(partyModesVideo).size).toBeLessThan(1_500_000)
  })

  it('keeps the above-the-fold hero screenshot small and static', () => {
    expect(statSync(heroPoster).size).toBeLessThan(400_000)
  })

  it('keeps animated sources paired with static fallbacks in the consuming components', () => {
    const header = readFileSync(headerSource, 'utf8')
    const deferredBackground = readFileSync(deferredBackgroundSource, 'utf8')
    const deferredAnimation = readFileSync(deferredAnimationSource, 'utf8')
    const gameSection = readFileSync(gameSectionSource, 'utf8')

    // The header takes the hero background as a slot so the page can attach a
    // client directive; asserting on the header alone would miss the wiring.
    const homePage = readFileSync('apps/smashers/src/pages/index.astro', 'utf8')
    expect(header).toContain('heroBackground')
    expect(homePage).toContain('DeferredHeroBackground')
    expect(homePage).toMatch(/<DeferredHeroBackground\b[^>]*client:/)
    expect(deferredBackground).toContain("from '@nl/ui/custom/deferred-external-script'")
    expect(deferredBackground).toContain('<DeferredExternalScript')
    expect(deferredBackground).toContain('smashers-hero-animation.js')
    expect(deferredBackground).not.toContain("'use client'")
    expect(deferredBackground).toContain('background-poster.webp')
    expect(deferredBackground).toContain('data-smashers-hero-background')
    expect(deferredAnimation).toContain('/video/smashers-hero.mp4')
    expect(deferredAnimation).toContain('data-smashers-hero-background')
    expect(deferredAnimation).toContain('prefers-reduced-motion: reduce')
    expect(deferredAnimation).toContain('navigator.connection?.saveData')
    expect(deferredAnimation).toContain(
      'if (prefersReducedMotion || prefersDataSaving || slowConnection) return'
    )
    expect(deferredAnimation).toContain('navigator.connection?.downlink')
    expect(deferredAnimation).toContain("canPlayType('video/mp4')")
    // The poster stays in the document: the video is an overlay that is only
    // revealed once a frame is decodable, so a failed or blocked video leaves the
    // hero intact.
    expect(deferredAnimation).toContain('picture.parentElement.insertBefore(probe, picture)')
    expect(deferredAnimation).toContain("addEventListener('error'")
    expect(gameSection).toContain('/video/party-modes.mp4')
    expect(gameSection).toContain('party_modes-poster.webp')
    expect(gameSection).toContain('deferLoad')
    expect(gameSection).toContain('height={566}')
    expect(gameSection).not.toContain('unoptimized')
    // No animated WebP or GIF path remains for the montage.
    expect(gameSection).not.toContain('party_modes.webp')
    expect(gameSection).not.toContain('party_modes.gif')
    expect(gameSection).not.toContain('DeferredAnimatedImage')
  })

  it('keeps the muted Smashers viewport video on the compact delivery asset', () => {
    const gameSection = readFileSync(gameSectionSource, 'utf8')

    expect(gameSection).toContain('src="/video/rocket.mp4"')
    expect(gameSection).toContain('deferLoad')
    expect(gameSection).toContain('rocket-poster.webp')
    expect(statSync(rocketVideo).size).toBeLessThan(2_000_000)
    expect(statSync(rocketPoster).size).toBeLessThan(statSync(rocketVideo).size / 10)
  })
})
