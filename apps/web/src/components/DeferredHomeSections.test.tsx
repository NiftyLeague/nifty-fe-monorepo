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
      data-testid="deferred-home-section"
      data-min-height={minHeightClassName}
      data-root-margin={rootMargin}
    >
      <span role="status">Loading {label}</span>
    </div>
  ),
}))

describe('DeferredHomeSections', () => {
  it('keeps the compete section deferred with a stable accessible boundary', async () => {
    const { DeferredHomeCompete } = await import('./DeferredHomeSections')

    render(<DeferredHomeCompete />)

    expect(screen.getByRole('status').textContent).toBe('Loading compete and earn section')
    expect(screen.getByTestId('deferred-home-section').getAttribute('data-min-height')).toBe(
      'min-h-[36rem]'
    )
  })
})
