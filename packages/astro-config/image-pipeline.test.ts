import { describe, expect, it } from 'bun:test'
import { isProductionImageSource, runWithConcurrency } from './image-pipeline.mjs'

describe('image pipeline helpers', () => {
  it('filters generated and test-only sources', () => {
    expect(isProductionImageSource('src/components/Hero.tsx', ['.ts', '.tsx'])).toBe(true)
    expect(isProductionImageSource('src/components/Hero.test.tsx', ['.ts', '.tsx'])).toBe(false)
    expect(isProductionImageSource('src/types/typechain/Hero.ts', ['.ts', '.tsx'])).toBe(false)
  })

  it('keeps concurrent work within the configured bound', async () => {
    let active = 0
    let maximumActive = 0
    const seen: number[] = []

    await runWithConcurrency(
      [1, 2, 3, 4],
      async (item) => {
        active += 1
        maximumActive = Math.max(maximumActive, active)
        await new Promise((resolve) => setTimeout(resolve, 1))
        seen.push(item)
        active -= 1
      },
      2
    )

    expect(maximumActive).toBe(2)
    expect(seen.toSorted()).toEqual([1, 2, 3, 4])
  })
})
