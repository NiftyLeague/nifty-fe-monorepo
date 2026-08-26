import { describe, expect, it } from 'bun:test'
import { readFileSync, statSync } from 'node:fs'

const roadmapCard = 'apps/web/src/components/RoadmapTimeline/roadmapCard.tsx'
const roadmapConstants = 'apps/web/src/components/RoadmapTimeline/constants.tsx'

const animatedRoadmapMedia = [
  {
    file: 'assets/img/games/crypto-winter-roadmap.webp',
    fallback: 'assets/img/games/crypto-winter.gif',
    source: '/img/games/crypto-winter-roadmap.webp',
  },
  {
    file: 'assets/img/games/mt-gawx-roadmap.webp',
    fallback: 'assets/img/games/mt-gawx.gif',
    source: '/img/games/mt-gawx-roadmap.webp',
  },
  {
    file: 'assets/img/games/smashers/nifty-smashers-roadmap.webp',
    fallback: 'assets/img/games/smashers/nifty-smashers.gif',
    source: '/img/games/smashers/nifty-smashers-roadmap.webp',
  },
  {
    file: 'assets/img/games/wen-roadmap.webp',
    fallback: 'assets/img/games/wen.gif',
    source: '/img/games/wen-roadmap.webp',
  },
] as const

describe('web roadmap animated media policy', () => {
  it('keeps the animated roadmap sources smaller than their GIF fallbacks', () => {
    for (const { file, fallback } of animatedRoadmapMedia) {
      expect(statSync(file).size).toBeLessThan(statSync(fallback).size)
    }
  })

  it('keeps the WebP sources animated instead of replacing them with static posters', () => {
    for (const { file } of animatedRoadmapMedia) {
      const webp = readFileSync(file)

      expect(webp.includes(Buffer.from('ANIM'))).toBe(true)
      expect(webp.includes(Buffer.from('ANMF'))).toBe(true)
    }
  })

  it('routes roadmap cards through the shared animated image primitive', () => {
    const source = readFileSync(roadmapCard, 'utf8')

    expect(source).toContain('@nl/ui/custom/animated-image')
    expect(source).toContain("from 'lucide-react'")
    expect(source).not.toContain("from '@nl/ui/base/icon'")
    const constants = readFileSync(roadmapConstants, 'utf8')
    for (const { source } of animatedRoadmapMedia) {
      expect(constants).toContain(source)
    }
  })
})
