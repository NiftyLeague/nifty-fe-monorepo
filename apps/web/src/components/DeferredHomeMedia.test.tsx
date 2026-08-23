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
      data-testid="deferred-home-media"
      data-min-height={minHeightClassName}
      data-root-margin={rootMargin}
    >
      <span role="status">Loading {label}</span>
    </div>
  ),
}))

describe('DeferredHomeMedia', () => {
  it('keeps the community DEGEN carousel deferred with a stable accessible boundary', async () => {
    const { DeferredHomeDegenCarousel } = await import('./DeferredHomeMedia')

    render(<DeferredHomeDegenCarousel />)

    expect(screen.getByRole('status').textContent).toBe('Loading community DEGEN carousel')
    expect(screen.getByTestId('deferred-home-media').getAttribute('data-min-height')).toBe(
      'min-h-[22rem]'
    )
    expect(screen.getByTestId('deferred-home-media').getAttribute('data-root-margin')).toBeNull()
  })
})
