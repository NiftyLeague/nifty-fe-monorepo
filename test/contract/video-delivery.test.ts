import { describe, expect, it } from 'bun:test'
import { mediaBytes } from './media-manifest'

const sharedMarketingVideos = [
  {
    path: 'assets/media/video/wen-ape.mp4',
    maxBytes: 6_000_000,
  },
  {
    path: 'assets/media/video/mansion_showcase.mp4',
    maxBytes: 8_000_000,
  },
  {
    path: 'assets/media/video/crypto-winter.mp4',
    maxBytes: 2_000_000,
  },
  {
    path: 'assets/media/video/companion.mp4',
    maxBytes: 4_000_000,
  },
  {
    path: 'assets/media/video/game-console.mp4',
    maxBytes: 4_500_000,
  },
  {
    path: 'assets/media/video/comics_archive.mp4',
    maxBytes: 4_000_000,
  },
  {
    path: 'assets/media/video/citadel_key.mp4',
    maxBytes: 4_000_000,
  },
  {
    path: 'assets/media/video/nakedbeachflyby.mp4',
    maxBytes: 4_250_000,
  },
  {
    path: 'assets/media/video/rugmans-peak.mp4',
    maxBytes: 2_000_000,
  },
  {
    path: 'assets/media/video/bank.mp4',
    maxBytes: 1_500_000,
  },
  {
    path: 'assets/media/video/lobby.mp4',
    maxBytes: 1_000_000,
  },
  {
    path: 'assets/media/video/arcade-token.mp4',
    maxBytes: 2_750_000,
  },
] as const

describe('shared video delivery budgets', () => {
  it('keeps shared marketing videos compact enough for viewport playback', () => {
    for (const video of sharedMarketingVideos) {
      expect(mediaBytes(video.path)!).toBeLessThan(video.maxBytes)
    }
  })
})
