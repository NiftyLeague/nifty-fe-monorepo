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

describe('DeferredNiftyWorldProperties', () => {
  test('uses the accessible deferred boundary for the property grid', async () => {
    const { DeferredNiftyWorldProperties } = await import('./DeferredNiftyWorldSections')

    render(<DeferredNiftyWorldProperties />)

    const loadingState = screen.getByRole('status', {
      name: 'Loading NiftyWorld property types',
    })

    expect(loadingState.dataset.minHeight).toBe('min-h-[240rem] md:min-h-[120rem]')
    expect(loadingState.dataset.rootMargin).toBe('240px')
  })
})
