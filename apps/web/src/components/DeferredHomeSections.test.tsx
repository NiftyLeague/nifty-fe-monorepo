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
  it('keeps compete artwork deferred with a stable accessible boundary', async () => {
    const { DeferredCompeteArtwork } = await import('./DeferredHomeSections')

    render(<DeferredCompeteArtwork />)

    expect(screen.getByRole('status').textContent).toBe('Loading compete artwork')
    expect(screen.getByTestId('deferred-home-section').getAttribute('data-min-height')).toBe(
      'min-h-[24rem] md:min-h-[30rem]'
    )
    expect(screen.getByTestId('deferred-home-section').getAttribute('data-root-margin')).toBe(
      '160px'
    )
  })
})
