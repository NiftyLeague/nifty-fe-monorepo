import { describe, expect, it } from 'bun:test'
import { readFileSync, statSync } from 'node:fs'

const headerSource = 'apps/smashers/src/components/Header/index.tsx'
const deferredAnimationSource = 'assets/scripts/smashers-hero-animation.js'
const gameSectionSource = 'apps/smashers/src/components/GameSection/index.tsx'
const rocketVideo = 'assets/video/rocket.mp4'
const heroVideo = 'assets/video/smashers-hero.mp4'
const partyModesVideo = 'assets/video/party-modes.mp4'
const rocketPoster = 'assets/img/games/smashers/rocket-poster.webp'
const heroPoster = 'assets/img/games/smashers/background-poster.webp'

describe('Smashers asset delivery contracts', () => {
  it('keeps both home-page animations on the video pipeline within budget', () => {
    expect(statSync(heroVideo).size).toBeLessThan(700_000)
    expect(statSync(partyModesVideo).size).toBeLessThan(1_500_000)
  })

  it('keeps the above-the-fold hero screenshot small and static', () => {
    expect(statSync(heroPoster).size).toBeLessThan(400_000)
  })

  it('keeps animated sources paired with static fallbacks in the consuming components', () => {
    const header = readFileSync(headerSource, 'utf8')
    const deferredAnimation = readFileSync(deferredAnimationSource, 'utf8')
    const gameSection = readFileSync(gameSectionSource, 'utf8')

    // The header takes the hero background as a slot so the page can attach a
    // client directive; asserting on the header alone would miss the wiring.
    const homePage = readFileSync('apps/smashers/src/pages/index.astro', 'utf8')
    expect(header).toContain('heroBackground')
    // The hero backdrop is static Astro markup: the poster is in the initial
    // HTML and the animation script is injected after interaction or idle
    // time — no React hydration above the fold.
    expect(homePage).toContain('background-poster.webp')
    expect(homePage).toContain('data-smashers-hero-background')
    expect(homePage).toContain('/scripts/smashers-hero-animation.js')
    expect(homePage).toContain('requestIdleCallback')
    expect(homePage).not.toMatch(/<picture[^>]*client:/)
    expect(deferredAnimation).toContain('/video/smashers-hero.mp4')
    expect(deferredAnimation).toContain('data-smashers-hero-background')
    expect(deferredAnimation).toContain('prefers-reduced-motion: reduce')
    expect(deferredAnimation).toContain('navigator.connection?.saveData')
    expect(deferredAnimation).toContain(
      'if (prefersReducedMotion || prefersDataSaving || slowConnection) return'
    )
    expect(deferredAnimation).toContain('navigator.connection?.effectiveType')
    expect(deferredAnimation).toContain("effectiveType === 'slow-2g' || effectiveType === '2g'")
    expect(deferredAnimation).not.toContain('navigator.connection?.downlink')
    expect(deferredAnimation).toContain("canPlayType('video/mp4')")
    // The video mounts underneath the poster picture and the picture stays the
    // visible layer until real frames play: the video's poster is the same
    // asset, so the swap is seamless, and a failed or blocked video leaves the
    // hero intact.
    expect(deferredAnimation).toContain('picture.parentElement.insertBefore(probe, picture)')
    expect(deferredAnimation).toContain("addEventListener('error'")
    // Once the video plays, the poster picture must be retired — it is painted
    // above the video (same stacking level, later in DOM order), so leaving it
    // visible would cover the animation forever.
    expect(deferredAnimation).toContain("addEventListener('playing'")
    expect(deferredAnimation).toContain("picture.style.visibility = 'hidden'")
    // A refused muted autoplay (hidden or unfocused tab) must retry on
    // visibility or interaction instead of stalling before the first frame.
    expect(deferredAnimation).toContain('attemptPlayback')
    expect(deferredAnimation).toContain("'visibilitychange'")
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
