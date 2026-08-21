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
  it('defers the desktop grid with a stable accessible boundary', async () => {
    const { DeferredTeamDesktop } = await import('./DeferredTeamSections')

    render(<DeferredTeamDesktop />)

    expect(screen.getByRole('status').textContent).toBe('Loading desktop team members')
    expect(screen.getByTestId('deferred-team-section').getAttribute('data-min-height')).toBe(
      'min-h-[110rem]'
    )
    expect(screen.getByTestId('deferred-team-section').getAttribute('data-root-margin')).toBe(
      '0px 0px -160px 0px'
    )
  })
})
