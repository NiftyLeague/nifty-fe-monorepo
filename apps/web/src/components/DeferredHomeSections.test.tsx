import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/deferred-section', () => ({
  DeferredSection: ({
    label,
    minHeightClassName,
    rootMargin,
  }: {
    label: string
    minHeightClassName?: string
    rootMargin?: string
  }) => (
    <div
      data-min-height={minHeightClassName}
      data-root-margin={rootMargin}
      role="status"
      aria-label={`Loading ${label}`}
    />
  ),
}))

import { DeferredHomeSections } from './DeferredHomeSections'

describe('DeferredHomeSections', () => {
  it('keeps every homepage section close to the viewport without preloading it on mobile', () => {
    render(<DeferredHomeSections />)

    const boundaries = screen.getAllByRole('status')
    expect(boundaries).toHaveLength(5)
    expect(boundaries.every((boundary) => boundary.dataset.rootMargin === '240px 0px')).toBe(true)
    expect(boundaries.map((boundary) => boundary.dataset.minHeight)).toEqual([
      'min-h-[48rem] md:min-h-[60rem]',
      'min-h-[70rem] md:min-h-[95rem]',
      'min-h-[44rem] md:min-h-[56rem]',
      'min-h-[36rem] md:min-h-[48rem]',
      'min-h-[32rem]',
    ])
  })
})
