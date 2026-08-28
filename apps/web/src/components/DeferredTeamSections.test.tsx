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
      data-testid="deferred-team-section"
      data-min-height={minHeightClassName}
      data-root-margin={rootMargin}
    >
      <span role="status">Loading {label}</span>
    </div>
  ),
}))

describe('DeferredTeamSections', () => {
  it('defers the mobile carousel with a stable accessible boundary', async () => {
    const { DeferredTeamCarousel } = await import('./DeferredTeamSections')

    render(<DeferredTeamCarousel />)

    expect(screen.getByRole('status').textContent).toBe('Loading mobile team carousel')
    expect(screen.getByTestId('deferred-team-section').getAttribute('data-min-height')).toBe(
      'min-h-[300px]'
    )
    expect(screen.getByTestId('deferred-team-section').getAttribute('data-root-margin')).toBeNull()
  })
})
