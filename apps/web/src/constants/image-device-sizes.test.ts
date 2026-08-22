import { describe, expect, it } from 'bun:test'

import { IMAGE_DEVICE_SIZES } from '../../../../config/image-device-sizes'

describe('shared Next image candidates', () => {
  it('includes small-card and high-density candidates', () => {
    expect(IMAGE_DEVICE_SIZES).toEqual([
      384, 480, 640, 750, 828, 1080, 1200, 1440, 1920, 2560, 3840,
    ])
  })
})
