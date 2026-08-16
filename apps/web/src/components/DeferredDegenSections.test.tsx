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
      data-testid="deferred-degen-specials"
      data-min-height={minHeightClassName}
      data-root-margin={rootMargin}
    >
      <span role="status">Loading {label}</span>
    </div>
  ),
}))

import { DeferredDegenSpecialsTable } from './DeferredDegenSections'

describe('DeferredDegenSpecialsTable', () => {
  it('keeps the tribe table deferred with a stable accessible boundary', () => {
    render(<DeferredDegenSpecialsTable />)

    expect(screen.getByRole('status').textContent).toBe('Loading DEGEN tribe specials')
    expect(screen.getByTestId('deferred-degen-specials').getAttribute('data-min-height')).toBe(
      'min-h-[70rem]'
    )
    expect(screen.getByTestId('deferred-degen-specials').getAttribute('data-root-margin')).toBe(
      '480px'
    )
  })
})
