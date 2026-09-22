import { describe, expect, it } from 'bun:test'
import { existsSync } from 'node:fs'

import { mediaBytes } from './media-manifest'

const removedAssets = [
  'assets/media/img/comics/burner/burning-animations/burnanim_001.webp',
  'assets/media/img/niftyworld/niftyworld-snarfy.gif',
  'assets/media/img/games/smashers/smashers.gif',
  'assets/media/video/naked-beach.mp4',
  'assets/media/video/smashers-og.mp4',
  'assets/media/video/wen-frog.mp4',
  'assets/media/img/comics/burner/burnanim_sm.gif',
  'assets/media/img/games/smashers/loading-screen.webp',
  'assets/media/img/games/smashers/3D-levels/jungle.webp',
  'assets/media/img/niftyworld/mansion_01.webp',
  'assets/media/img/games/smashers/splash-screen.webp',
  'assets/media/img/games/smashers/3D-levels/airship_angle.webp',
  'assets/media/img/games/smashers/3D-levels/airship.webp',
  'assets/media/img/misc/story.gif',
  'assets/media/img/games/smashers/3D-levels/sushi_angle.webp',
  'assets/media/img/logos/other/activision.svg',
  'assets/media/img/niftyworld/nakedbeach_pano.webp',
]

describe('shared stale media policy', () => {
  it('does not retain unreferenced legacy media', () => {
    for (const assetPath of removedAssets) {
      expect(existsSync(assetPath)).toBe(false)
    }
  })

  it('keeps the referenced Naked Beach flyby asset published', () => {
    expect(mediaBytes('assets/media/video/nakedbeachflyby.mp4')).toBeDefined()
  })

  it('keeps the burner animation on the optimized shared GIF published', () => {
    expect(mediaBytes('assets/media/img/comics/burner/burnanim.gif')).toBeDefined()
    expect(existsSync('assets/media/img/comics/burner/burning-animations')).toBe(false)
  })
})
