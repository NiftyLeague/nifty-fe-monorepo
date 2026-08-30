import { describe, expect, it } from 'bun:test'

import { getDegenTraitEntries } from './degen-traits'

const contractTraitValues = [
  1, 17, 73, 104, 110, 0, 263, 0, 0, 0, 0, 0, 685, 0, 717, 0, 0, 821, 824, 865, 894, 991,
]

describe('getDegenTraitEntries', () => {
  it('maps public catalog values without exposing numeric contract ids', () => {
    const entries = getDegenTraitEntries(contractTraitValues.join(','))

    expect(entries.map(({ name, value }) => [name, value])).toEqual([
      ['Tribe', 'Ape'],
      ['Skin Color', 'White'],
      ['Fur Color', 'Allegiance'],
      ['Eyes', 'Atmosphere'],
      ['Pupil', 'River Styx'],
      ['Mouth', 'Cigarette'],
      ['Footwear', 'Blue Winged Shoes'],
      ['Hat', 'Gray Beanie'],
      ['Wrist', 'Gold Watch'],
      ['Hands', 'Blue Boxing Gloves'],
      ['Neckwear', 'Titanium Dollar Sign Necklace'],
      ['Left Item', 'Banana'],
      ['Right Item', 'Controller'],
    ])
    expect(entries.some(({ value }) => /^\d+$/.test(value))).toBe(false)
  })

  it('accepts named dashboard trait maps and ignores empty or malformed slots', () => {
    const entries = getDegenTraitEntries({
      tribe: 1n,
      mouth: 263n,
      rightItem: 991n,
      empty: 0n,
      malformed: 'not-a-trait',
    })

    expect(entries.map(({ name, value }) => [name, value])).toEqual([
      ['Tribe', 'Ape'],
      ['Mouth', 'Cigarette'],
      ['Right Item', 'Controller'],
    ])
  })
})
