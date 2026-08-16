import { describe, expect, it } from 'bun:test'
import { statSync } from 'node:fs'

const sharedMarketingVideos = [
  {
    path: 'assets/video/wen-ape.mp4',
    maxBytes: 6_000_000,
  },
  {
    path: 'assets/video/mansion_showcase.mp4',
    maxBytes: 8_000_000,
  },
  {
    path: 'assets/video/crypto-winter.mp4',
    maxBytes: 2_000_000,
  },
  {
    path: 'assets/video/companion.mp4',
    maxBytes: 4_000_000,
  },
  {
    path: 'assets/video/game-console.mp4',
    maxBytes: 3_500_000,
  },
  {
    path: 'assets/video/lobby.mp4',
    maxBytes: 1_000_000,
  },
  {
    path: 'assets/video/comics_archive.mp4',
    maxBytes: 4_000_000,
  },
  {
    path: 'assets/video/citadel_key.mp4',
    maxBytes: 4_000_000,
  },
  {
    path: 'assets/video/nakedbeachflyby.mp4',
    maxBytes: 4_250_000,
  },
  {
    path: 'assets/video/rugmans-peak.mp4',
    maxBytes: 2_000_000,
  },
  {
    path: 'assets/video/bank.mp4',
    maxBytes: 1_500_000,
  },
  {
    path: 'assets/video/arcade-token.mp4',
    maxBytes: 2_750_000,
  },
] as const

describe('shared video delivery budgets', () => {
  it('keeps shared marketing videos compact enough for viewport playback', () => {
    for (const video of sharedMarketingVideos) {
      expect(statSync(video.path).size).toBeLessThan(video.maxBytes)
    }
  })
})
