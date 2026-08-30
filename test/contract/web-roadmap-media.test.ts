import { describe, expect, it } from 'bun:test'
import { readFileSync, statSync } from 'node:fs'

const roadmapCard = 'apps/web/src/components/RoadmapTimeline/roadmapCard.tsx'
const roadmapConstants = 'apps/web/src/components/RoadmapTimeline/constants.tsx'

const roadmapMedia = [
  {
    poster: 'assets/img/games/crypto-winter-roadmap-poster.webp',
    fallback: 'assets/img/games/crypto-winter.gif',
    source: '/img/games/crypto-winter-roadmap-poster.webp',
  },
  {
    poster: 'assets/img/games/mt-gawx-roadmap-poster.webp',
    fallback: 'assets/img/games/mt-gawx.gif',
    source: '/img/games/mt-gawx-roadmap-poster.webp',
  },
  {
    poster: 'assets/img/games/smashers/nifty-smashers-roadmap-poster.webp',
    fallback: 'assets/img/games/smashers/nifty-smashers.gif',
    source: '/img/games/smashers/nifty-smashers-roadmap-poster.webp',
  },
  {
    poster: 'assets/img/games/wen-roadmap-poster.webp',
    fallback: 'assets/img/games/wen.gif',
    source: '/img/games/wen-roadmap-poster.webp',
  },
] as const

describe('web roadmap animated media policy', () => {
  it('keeps static roadmap posters small enough for deferred cards', () => {
    for (const { poster, fallback } of roadmapMedia) {
      expect(statSync(poster).size).toBeLessThan(100_000)
      expect(statSync(poster).size).toBeLessThan(statSync(fallback).size)
    }
  })

  it('keeps roadmap posters static instead of downloading animation frames up front', () => {
    for (const { poster } of roadmapMedia) {
      const webp = readFileSync(poster)

      expect(webp.includes(Buffer.from('RIFF'))).toBe(true)
      expect(webp.includes(Buffer.from('WEBP'))).toBe(true)
      expect(webp.includes(Buffer.from('ANIM'))).toBe(false)
      expect(webp.includes(Buffer.from('ANMF'))).toBe(false)
    }
  })

  it('routes roadmap cards through the shared animated image primitive', () => {
    const source = readFileSync(roadmapCard, 'utf8')

    expect(source).toContain('@nl/ui/custom/animated-image')
    expect(source).toContain("from 'lucide-react'")
    expect(source).not.toContain("from '@nl/ui/base/icon'")
    const constants = readFileSync(roadmapConstants, 'utf8')
    for (const { source } of roadmapMedia) {
      expect(constants).toContain(source)
    }
  })
})
