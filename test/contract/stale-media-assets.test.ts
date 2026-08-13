import { describe, expect, it } from 'bun:test'
import { existsSync } from 'node:fs'

const removedAssets = [
  'assets/img/comics/burner/burning-animations/burnanim_001.webp',
  'assets/img/niftyworld/niftyworld-snarfy.gif',
  'assets/video/naked-beach.mp4',
  'assets/video/smashers-og.mp4',
  'assets/video/wen-frog.mp4',
]

describe('shared stale media policy', () => {
  it('does not retain unreferenced legacy media', () => {
    for (const assetPath of removedAssets) {
      expect(existsSync(assetPath)).toBe(false)
    }
  })

  it('keeps the referenced Naked Beach flyby asset', () => {
    expect(existsSync('assets/video/nakedbeachflyby.mp4')).toBe(true)
  })

  it('keeps the burner animation on the optimized shared GIF', () => {
    expect(existsSync('assets/img/comics/burner/burnanim.gif')).toBe(true)
    expect(existsSync('assets/img/comics/burner/burning-animations')).toBe(false)
  })
})
