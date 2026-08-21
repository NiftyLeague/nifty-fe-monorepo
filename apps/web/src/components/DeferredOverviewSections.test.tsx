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
      aria-label={`Loading ${label}`}
      data-min-height={minHeightClassName}
      data-root-margin={rootMargin}
      data-testid={`deferred-${label}`}
      role="status"
    >
      Loading {label}
    </div>
  ),
}))

import { DeferredOverviewCommunity, DeferredOverviewFAQ } from './DeferredOverviewSections'

describe('DeferredOverviewCommunity', () => {
  it('keeps the lower community section behind a stable accessible boundary', () => {
    render(<DeferredOverviewCommunity />)

    const loadingState = screen.getByRole('status', { name: 'Loading overview community section' })

    expect(loadingState.dataset.minHeight).toBe('min-h-[52rem] md:min-h-[48rem]')
    expect(loadingState.dataset.rootMargin).toBe('0px 0px -160px 0px')
  })
})

describe('DeferredOverviewFAQ', () => {
  it('keeps the FAQ section deferred with its existing preload window', () => {
    render(<DeferredOverviewFAQ />)

    const loadingState = screen.getByRole('status', {
      name: 'Loading frequently asked questions',
    })

    expect(loadingState.dataset.minHeight).toBe('min-h-[24rem]')
    expect(loadingState.dataset.rootMargin).toBe('480px')
  })
})
