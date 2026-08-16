import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const roadmapStyles = readFileSync(
  'apps/web/src/components/RoadmapTimeline/index.module.css',
  'utf8'
)
const lootStyles = readFileSync('apps/smashers/src/app/loot/page.module.css', 'utf8')

describe('long-content rendering performance', () => {
  it('defers offscreen Roadmap cards while reserving intrinsic space', () => {
    expect(roadmapStyles).toContain('content-visibility: auto')
    expect(roadmapStyles).toContain('contain-intrinsic-size: auto 32rem')
  })

  it('defers offscreen Loot crate tables while reserving intrinsic space', () => {
    expect(lootStyles).toContain('content-visibility: auto')
    expect(lootStyles).toContain('contain-intrinsic-size: auto 44rem')
  })
})
