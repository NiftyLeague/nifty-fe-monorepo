import { describe, expect, it } from 'bun:test'
import { filterBySearch, matchesSearchTerm } from './search'

describe('matchesSearchTerm', () => {
  it('matches case-insensitively across multiple fields', () => {
    const item = { id: '42', name: 'HydraHero', owner: '0xABC' }
    const getFields = (x: typeof item) => [x.id, x.name, x.owner]

    expect(matchesSearchTerm(item, 'hydra', getFields)).toBe(true)
    expect(matchesSearchTerm(item, '0xabc', getFields)).toBe(true)
    expect(matchesSearchTerm(item, '42', getFields)).toBe(true)
    expect(matchesSearchTerm(item, 'unknown', getFields)).toBe(false)
  })

  it('handles undefined and null fields gracefully', () => {
    const item = { id: '1', name: undefined as string | undefined, extra: null as string | null }
    const getFields = (x: typeof item) => [x.id, x.name, x.extra]

    expect(matchesSearchTerm(item, '1', getFields)).toBe(true)
    expect(matchesSearchTerm(item, 'missing', getFields)).toBe(false)
  })
})

describe('filterBySearch', () => {
  const items = [
    { id: '1', name: 'Alpha' },
    { id: '2', name: 'Beta' },
    { id: '10', name: 'AlphaBeta' },
  ]
  const getFields = (x: (typeof items)[number]) => [x.id, x.name]

  it('returns all items for empty or whitespace-only search', () => {
    expect(filterBySearch(items, '', getFields)).toEqual(items)
    expect(filterBySearch(items, '   ', getFields)).toEqual(items)
  })

  it('filters case-insensitively', () => {
    expect(filterBySearch(items, 'alpha', getFields)).toHaveLength(2)
    expect(filterBySearch(items, 'ALPHA', getFields)).toHaveLength(2)
    expect(filterBySearch(items, '1', getFields)).toHaveLength(2)
  })

  it('returns empty array when nothing matches', () => {
    expect(filterBySearch(items, 'zzz', getFields)).toHaveLength(0)
  })
})
