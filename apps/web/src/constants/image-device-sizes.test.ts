import { describe, expect, it } from 'bun:test'

import { IMAGE_DEVICE_SIZES, IMAGE_SMALL_SIZES } from '../../../../config/image-device-sizes'

describe('shared Next image candidates', () => {
  it('includes small-card and high-density candidates', () => {
    expect(IMAGE_DEVICE_SIZES).toEqual([
      384, 480, 640, 750, 828, 1080, 1200, 1440, 1920, 2560, 3840,
    ])
  })

  it('keeps small-image sizes separate from the shared device ladder', () => {
    expect(IMAGE_SMALL_SIZES).toEqual([32, 48, 64, 96, 128, 256])
    const deviceSizes = new Set<number>(IMAGE_DEVICE_SIZES)
    expect(IMAGE_SMALL_SIZES.some((size) => deviceSizes.has(size))).toBe(false)
  })
})
