import { describe, expect, it } from 'bun:test'

import { DEGEN_SPECIALS } from './constants'

describe('DEGEN specials metadata', () => {
  it('combines shared tribe artwork with special-move content', () => {
    expect(DEGEN_SPECIALS).toHaveLength(7)
    expect(DEGEN_SPECIALS.map(({ name }) => name)).toEqual([
      'APE',
      'HUMAN',
      'DOGE',
      'FROG',
      'CAT',
      'ALIEN',
      'HYDRA',
    ])
    expect(
      DEGEN_SPECIALS.every(
        ({ image, gif, description, specialName }) =>
          image.link.startsWith('/icons/tribes/') &&
          gif.link.startsWith('/img/degens/specials/') &&
          description.length > 0 &&
          specialName.length > 0
      )
    ).toBe(true)
  })
})
