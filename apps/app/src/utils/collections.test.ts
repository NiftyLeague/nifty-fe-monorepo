import { describe, expect, it } from 'bun:test'

import { hasEntries, toggleValue } from './collections'

describe('collection helpers', () => {
  it('detects non-empty records without treating nullish values as entries', () => {
    expect(hasEntries(undefined)).toBe(false)
    expect(hasEntries(null)).toBe(false)
    expect(hasEntries({})).toBe(false)
    expect(hasEntries({ filter: '' })).toBe(true)
  })

  it('toggles primitive and reference values while preserving order', () => {
    expect(toggleValue(['one', 'two'], 'one')).toEqual(['two'])
    expect(toggleValue(['one'], 'two')).toEqual(['one', 'two'])

    const item = { id: 1 }
    expect(toggleValue([item], item)).toEqual([])
    expect(toggleValue([], item)).toEqual([item])
  })
})
