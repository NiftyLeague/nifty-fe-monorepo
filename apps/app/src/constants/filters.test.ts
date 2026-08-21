import { describe, expect, it } from 'bun:test'

import { tribes } from './filters'

describe('degen filter artwork', () => {
  it('uses compact shared thumbnails for the legacy full-size tribe artwork', () => {
    const iconByTribe = new Map(tribes.map(({ name, icon }) => [name, icon]))

    expect(iconByTribe.get('Hydra')).toBe('/icons/tribes/filters/hydra.webp')
    expect(iconByTribe.get('Rugman')).toBe('/icons/tribes/filters/rugman.webp')
    expect(iconByTribe.get('Satoshi')).toBe('/icons/tribes/filters/satoshi.webp')
  })
})
