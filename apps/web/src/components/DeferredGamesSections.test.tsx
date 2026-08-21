import { describe, expect, mock, test } from 'bun:test'
import { render, screen } from '@testing-library/react'

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
      aria-label={`Loading ${label}`}
      data-min-height={minHeightClassName}
      data-root-margin={rootMargin}
      role="status"
    />
  ),
}))

describe('DeferredGamesBelowFold', () => {
  test('uses the accessible deferred boundary for remaining game cards', async () => {
    const { DeferredGamesBelowFold } = await import('./DeferredGamesSections')

    render(<DeferredGamesBelowFold />)

    const loadingState = screen.getByRole('status', { name: 'Loading remaining games' })

    expect(loadingState.dataset.minHeight).toBe('min-h-[175rem] md:min-h-[125rem]')
    expect(loadingState.dataset.rootMargin).toBe('0px 0px -160px 0px')
  })
})
