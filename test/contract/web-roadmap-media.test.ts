import { describe, expect, it } from 'bun:test'
import { readFileSync, statSync } from 'node:fs'

const roadmapCard = 'apps/web/src/components/RoadmapTimeline/roadmapCard.tsx'
const roadmapConstants = 'apps/web/src/components/RoadmapTimeline/constants.tsx'

describe('web roadmap animated media policy', () => {
  it('keeps the animated roadmap sources smaller than their GIF fallbacks', () => {
    expect(statSync('assets/img/games/crypto-winter-roadmap.webp').size).toBeLessThan(
      statSync('assets/img/games/crypto-winter.gif').size
    )
    expect(statSync('assets/img/games/smashers/nifty-smashers-roadmap.webp').size).toBeLessThan(
      statSync('assets/img/games/smashers/nifty-smashers.gif').size
    )
  })

  it('routes roadmap cards through the shared animated image primitive', () => {
    const source = readFileSync(roadmapCard, 'utf8')

    expect(source).toContain('@nl/ui/custom/animated-image')
    expect(source).toContain("from '@nl/ui/custom/nav-icon'")
    expect(source).toContain('name="check"')
    expect(source).not.toContain("from '@nl/ui/base/icon'")
    expect(readFileSync(roadmapConstants, 'utf8')).toContain('crypto-winter-roadmap.webp')
    expect(readFileSync(roadmapConstants, 'utf8')).toContain('nifty-smashers-roadmap.webp')
  })
})
