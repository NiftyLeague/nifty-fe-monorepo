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

  it('unwraps contract result wrappers and numeric-keyed tuple objects', () => {
    const tuple = Object.fromEntries(
      [1, 17, 0, 0, 0, 0, 263, 0, 0, 0, 0, 0, 685, 0, 717, 0, 0, 821, 824, 865, 894, 991].map(
        (value, index) => [String(index), value]
      )
    )

    expect(normalizeCharacterTraits({ _characterTraits: tuple })).toEqual([
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
      685n,
      0n,
      717n,
      0n,
      0n,
      821n,
      824n,
      865n,
      894n,
      991n,
    ])

    expect(normalizeCharacterTraits([tuple])).toEqual([
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
      685n,
      0n,
      717n,
      0n,
      0n,
      821n,
      824n,
      865n,
      894n,
      991n,
    ])
  })
})
