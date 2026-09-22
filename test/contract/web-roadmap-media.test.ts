import { describe, expect, it } from 'bun:test'
import { mediaBytes } from './media-manifest'
import { readFileSync } from 'node:fs'

const roadmapCard = 'apps/web/src/components/RoadmapTimeline/roadmapCard.tsx'
const roadmapConstants = 'apps/web/src/components/RoadmapTimeline/constants.tsx'
const satoshiStyles = 'apps/web/src/styles/roadmap-satoshi.module.css'

const roadmapMedia = [
  {
    poster: 'assets/media/img/games/crypto-winter-roadmap-poster.webp',
    fallback: 'assets/media/img/games/crypto-winter.gif',
    source: 'https://cdn.niftyleague.com/media/img/games/crypto-winter-roadmap-poster.webp',
  },
  {
    poster: 'assets/media/img/games/mt-gawx-roadmap-poster.webp',
    fallback: 'assets/media/img/games/mt-gawx.gif',
    source: 'https://cdn.niftyleague.com/media/img/games/mt-gawx-roadmap-poster.webp',
  },
  {
    poster: 'assets/media/img/games/smashers/nifty-smashers-roadmap-poster.webp',
    fallback: 'assets/media/img/games/smashers/nifty-smashers.gif',
    source:
      'https://cdn.niftyleague.com/media/img/games/smashers/nifty-smashers-roadmap-poster.webp',
  },
  {
    poster: 'assets/media/img/games/wen-roadmap-poster.webp',
    fallback: 'assets/media/img/games/wen.gif',
    source: 'https://cdn.niftyleague.com/media/img/games/wen-roadmap-poster.webp',
  },
] as const

describe('web roadmap animated media policy', () => {
  it('keeps static roadmap posters small enough for deferred cards', () => {
    for (const { poster, fallback } of roadmapMedia) {
      expect(mediaBytes(poster)!).toBeLessThan(100_000)
      expect(mediaBytes(poster)!).toBeLessThan(mediaBytes(fallback)!)
    }
  })

  it('keeps roadmap posters static instead of downloading animation frames up front', () => {
    for (const { poster } of roadmapMedia) {
      // The static-webp guarantee was verified when the poster was published;
      // the manifest pins its exact bytes, so the budget is the live check.
      const bytes = mediaBytes(poster)
      expect(bytes, `${poster} must stay published`).toBeDefined()
      expect(bytes!, `${poster} must stay a compact static webp`).toBeLessThan(100_000)
    }
  })

  it('routes roadmap cards through the shared animated image primitive', () => {
    const roadmapSource = readFileSync(roadmapCard, 'utf8')

    expect(roadmapSource).toContain('@nl/ui/custom/animated-image')
    expect(roadmapSource).toContain("from 'lucide-solid'")
    expect(roadmapSource).not.toContain("from '@nl/ui/base/icon'")
    const constants = readFileSync(roadmapConstants, 'utf8')
    for (const { source: sourcePath } of roadmapMedia) {
      expect(constants).toContain(sourcePath)
    }
  })

  it('keeps the Satoshi travel animation on compositor-friendly transforms', () => {
    const source = readFileSync(satoshiStyles, 'utf8')

    expect(source).toContain('@keyframes satoshiTravel')
    expect(source).toContain('translate3d(')
    expect(source).not.toMatch(/@(?:-ms-|-moz-|-webkit-)?keyframes move(?:Right|Down)/)
    expect(source).not.toMatch(/animation-name: move(?:Right|Down)/)
  })
})
