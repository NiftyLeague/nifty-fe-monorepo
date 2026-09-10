import { describe, expect, it } from 'bun:test'
import { filterBySearch, matchesSearchTerm } from './search'

type SearchItem = { id: string; name: string; owner: string }
const getSearchFields = (x: SearchItem) => [x.id, x.name, x.owner]

type NullableSearchItem = { id: string; name: string | undefined; extra: string | null }
const getNullableSearchFields = (x: NullableSearchItem) => [x.id, x.name, x.extra]

type FilterSearchItem = { id: string; name: string }
const getFilterSearchFields = (x: FilterSearchItem) => [x.id, x.name]

describe('matchesSearchTerm', () => {
  it('matches case-insensitively across multiple fields', () => {
    const item = { id: '42', name: 'HydraHero', owner: '0xABC' }
    expect(matchesSearchTerm(item, 'hydra', getSearchFields)).toBe(true)
    expect(matchesSearchTerm(item, '0xabc', getSearchFields)).toBe(true)
    expect(matchesSearchTerm(item, '42', getSearchFields)).toBe(true)
    expect(matchesSearchTerm(item, 'unknown', getSearchFields)).toBe(false)
  })

  it('handles undefined and null fields gracefully', () => {
    const item = { id: '1', name: undefined as string | undefined, extra: null as string | null }
    expect(matchesSearchTerm(item, '1', getNullableSearchFields)).toBe(true)
    expect(matchesSearchTerm(item, 'missing', getNullableSearchFields)).toBe(false)
  })
})

describe('filterBySearch', () => {
  const items = [
    { id: '1', name: 'Alpha' },
    { id: '2', name: 'Beta' },
    { id: '10', name: 'AlphaBeta' },
  ]
  it('returns all items for empty or whitespace-only search', () => {
    expect(filterBySearch(items, '', getFilterSearchFields)).toEqual(items)
    expect(filterBySearch(items, '   ', getFilterSearchFields)).toEqual(items)
  })

  it('filters case-insensitively', () => {
    expect(filterBySearch(items, 'alpha', getFilterSearchFields)).toHaveLength(2)
    expect(filterBySearch(items, 'ALPHA', getFilterSearchFields)).toHaveLength(2)
    expect(filterBySearch(items, '1', getFilterSearchFields)).toHaveLength(2)
  })

  it('returns empty array when nothing matches', () => {
    expect(filterBySearch(items, 'zzz', getFilterSearchFields)).toHaveLength(0)
  })
})
