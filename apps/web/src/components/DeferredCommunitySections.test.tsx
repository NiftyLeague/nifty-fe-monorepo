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
      role="status"
    />
  ),
}))

import { DeferredCommunityConversation } from './DeferredCommunitySections'

describe('DeferredCommunityConversation', () => {
  it('keeps social cards behind a stable accessible boundary', () => {
    render(<DeferredCommunityConversation />)

    const loadingState = screen.getByRole('status', { name: 'Loading community conversation' })

    expect(loadingState.dataset.minHeight).toBe('min-h-[48rem]')
    expect(loadingState.dataset.rootMargin).toBe('0px 0px -160px 0px')
  })
})
