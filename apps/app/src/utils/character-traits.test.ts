import { describe, expect, it } from 'bun:test'

import { normalizeCharacterTraits } from './character-traits'

describe('normalizeCharacterTraits', () => {
  it('keeps array-like contract results ordered', () => {
    expect(normalizeCharacterTraits([1n, 17n, 0n])).toEqual([1n, 17n, 0n])
  })

  it('converts named CharacterTraits results into trait-index order', () => {
    expect(
      normalizeCharacterTraits({ mouth: 263n, tribe: 1n, skinColor: 17n, rightItem: '991' })
    ).toEqual([
      1n,
      17n,
      0n,
      0n,
      0n,
      0n,
      263n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      0n,
      991n,
      0n,
    ])
  })
})
