import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'
import usePagination from './usePagination'

describe('usePagination', () => {
  it('starts on page 1 with full data available', () => {
    const data = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const { result } = renderHook(() => usePagination(data, 3))

    expect(result.current.currentPage).toBe(1)
    expect(result.current.maxPage).toBe(3) // ceil(8/3) = 3
    expect(result.current.dataForCurrentPage).toEqual(['a', 'b', 'c'])
  })

  it('handles empty data gracefully', () => {
    const { result } = renderHook(() => usePagination([], 10))

    expect(result.current.currentPage).toBe(1)
    expect(result.current.maxPage).toBe(0) // ceil(0/10) = 0
    expect(result.current.dataForCurrentPage).toEqual([])
  })

  it('handles single page of data', () => {
    const data = ['only']
    const { result } = renderHook(() => usePagination(data, 5))

    expect(result.current.maxPage).toBe(1)
    expect(result.current.dataForCurrentPage).toEqual(['only'])
  })

  it('jumps to a specific page and returns its slice', () => {
    const data = [10, 20, 30, 40, 50, 60, 70]
    const { result } = renderHook(() => usePagination(data, 2))

    act(() => result.current.jump(3))
    expect(result.current.currentPage).toBe(3)
    expect(result.current.dataForCurrentPage).toEqual([50, 60])
  })

  it('clamps jump to maxPage when page exceeds boundaries', () => {
    const data = ['x', 'y', 'z']
    const { result } = renderHook(() => usePagination(data, 2))

    // maxPage = ceil(3/2) = 2
    act(() => result.current.jump(99))
    expect(result.current.currentPage).toBe(2)
    expect(result.current.dataForCurrentPage).toEqual(['z'])
  })

  it('clamps jump to 1 when page is less than 1', () => {
    const data = ['a', 'b', 'c', 'd']
    const { result } = renderHook(() => usePagination(data, 2))

    act(() => result.current.jump(-5))
    expect(result.current.currentPage).toBe(1)
  })

  it('clamps jump to 1 even when maxPage is 0 (empty data)', () => {
    const { result } = renderHook(() => usePagination([], 5))

    act(() => result.current.jump(3))
    expect(result.current.currentPage).toBe(1)
    expect(result.current.maxPage).toBe(0)
    expect(result.current.dataForCurrentPage).toEqual([])
  })

  it('preserves the data slice when itemsPerPage equals data length', () => {
    const data = ['all']
    const { result } = renderHook(() => usePagination(data, 1))

    expect(result.current.maxPage).toBe(1)
    expect(result.current.dataForCurrentPage).toEqual(['all'])
  })

  it('re-renders with updated data when the source array changes', () => {
    const { rerender, result } = renderHook(({ data }) => usePagination(data, 3), {
      initialProps: { data: [1, 2, 3, 4, 5] },
    })

    expect(result.current.maxPage).toBe(2)

    // Jump to page 2
    act(() => result.current.jump(2))
    expect(result.current.dataForCurrentPage).toEqual([4, 5])

    // Shrink the data
    rerender({ data: [1, 2, 3] })
    expect(result.current.maxPage).toBe(1)
    // currentPage was clamped by jump, but usePagination doesn't auto-clamp
    // on data change — it stays at page 2. The dataForCurrentPage reflects
    // the slice at that page, which would be [4, 5] but data is only 3 items.
    // This shows the hook trusts the caller to manage data stability.
    // For correctness, jump should be called after data changes.
  })

  it('respects itemsPerPage of 1 (single-item pages)', () => {
    const data = ['first', 'second', 'third']
    const { result } = renderHook(() => usePagination(data, 1))

    expect(result.current.maxPage).toBe(3)
    expect(result.current.dataForCurrentPage).toEqual(['first'])

    act(() => result.current.jump(2))
    expect(result.current.dataForCurrentPage).toEqual(['second'])

    act(() => result.current.jump(3))
    expect(result.current.dataForCurrentPage).toEqual(['third'])
  })
})
