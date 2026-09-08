import { describe, expect, it } from 'bun:test'

import { getPageItems } from './pagination'

describe('getPageItems', () => {
  it('returns all pages when total is small', () => {
    expect(getPageItems(1, 5)).toEqual([1, 2, 3, 4, 5])
    expect(getPageItems(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('returns a compact window with ellipses for large totals', () => {
    expect(getPageItems(1, 50)).toEqual([1, 2, 'ellipsis-end', 50])
    expect(getPageItems(5, 50)).toEqual([1, 'ellipsis-start', 4, 5, 6, 'ellipsis-end', 50])
    expect(getPageItems(25, 50)).toEqual([1, 'ellipsis-start', 24, 25, 26, 'ellipsis-end', 50])
    expect(getPageItems(50, 50)).toEqual([1, 'ellipsis-start', 49, 50])
  })

  it('bounds the rendered controls and handles empty data', () => {
    for (let page = 1; page <= 769; page += 1) {
      expect(getPageItems(page, 769).length).toBeLessThanOrEqual(7)
    }
    expect(getPageItems(1, 0)).toEqual([])
    expect(getPageItems(1, 1)).toEqual([1])
  })
})
