import { describe, expect, it } from 'bun:test'
import { existsSync } from 'node:fs'

const removedAssets = [
  'assets/img/comics/burner/burning-animations/burnanim_001.webp',
  'assets/img/niftyworld/niftyworld-snarfy.gif',
  'assets/img/games/smashers/smashers.gif',
  'assets/video/naked-beach.mp4',
  'assets/video/smashers-og.mp4',
  'assets/video/wen-frog.mp4',
  'assets/img/comics/burner/burnanim_sm.gif',
  'assets/img/games/smashers/loading-screen.webp',
  'assets/img/games/smashers/3D-levels/jungle.webp',
  'assets/img/niftyworld/mansion_01.webp',
  'assets/img/games/smashers/splash-screen.webp',
  'assets/img/games/smashers/3D-levels/airship_angle.webp',
  'assets/img/games/smashers/3D-levels/airship.webp',
  'assets/img/misc/story.gif',
  'assets/img/games/smashers/3D-levels/sushi_angle.webp',
  'assets/img/logos/other/activision.svg',
  'assets/img/niftyworld/nakedbeach_pano.webp',
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
