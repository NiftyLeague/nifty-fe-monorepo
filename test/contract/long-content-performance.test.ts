import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'

const roadmapStyles = readFileSync(
  'apps/web/src/components/RoadmapTimeline/index.module.css',
  'utf8'
)
const lootStyles = readFileSync('apps/smashers/src/app/loot/page.module.css', 'utf8')
const sharedUiStyles = readFileSync('packages/ui/src/styles/04_tailwind.utilities.css', 'utf8')
const sharedVisibilityHook = readFileSync('packages/ui/src/hooks/useOnScreen.ts', 'utf8')

describe('long-content rendering performance', () => {
  it('defers shared DeferredSection rendering while reserving intrinsic space', () => {
    expect(sharedUiStyles).toContain('.deferred-section')
    expect(sharedUiStyles).toContain('content-visibility: auto')
    expect(sharedUiStyles).toContain('contain-intrinsic-size: auto 16rem')
  })

  it('keeps viewport-triggered mounts interruptible during scrolling', () => {
    expect(sharedVisibilityHook).toContain('startTransition')
    expect(sharedVisibilityHook).toContain('startTransition(() => setIntersecting(visible))')
  })

  it('defers offscreen Roadmap cards while reserving intrinsic space', () => {
    expect(roadmapStyles).toContain('content-visibility: auto')
    expect(roadmapStyles).toContain('contain-intrinsic-size: auto 32rem')
  })

  it('defers offscreen Loot crate tables while reserving intrinsic space', () => {
    expect(lootStyles).toContain('content-visibility: auto')
    expect(lootStyles).toContain('contain-intrinsic-size: auto 44rem')
  })
})
