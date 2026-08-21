import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/deferred-section', () => ({
  DeferredSection: ({
    label,
    minHeightClassName,
  }: {
    label: string
    minHeightClassName?: string
  }) => (
    <div data-testid="deferred-roadmap" data-min-height={minHeightClassName}>
      <span role="status">Loading {label}</span>
    </div>
  ),
}))

describe('DeferredRoadmapCards', () => {
  it('keeps remaining milestones behind a stable accessible boundary', async () => {
    const DeferredRoadmapCards = (await import('./DeferredRoadmapCards')).default

    render(<DeferredRoadmapCards />)

    expect(screen.getByRole('status').textContent).toBe('Loading remaining roadmap milestones')
    expect(screen.getByTestId('deferred-roadmap').getAttribute('data-min-height')).toBe(
      'min-h-[1200rem]'
    )
  })
})
