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

import { DeferredDegenGallery, DeferredDegenSpecialsTable } from './DeferredDegenSections'

describe('DeferredDegenGallery', () => {
  it('keeps the DEGEN gallery behind a stable accessible boundary', () => {
    render(<DeferredDegenGallery />)

    expect(screen.getByRole('status').textContent).toBe('Loading DEGEN gallery')
    expect(screen.getByTestId('deferred-degen-specials').getAttribute('data-min-height')).toBe(
      'min-h-[52rem] md:min-h-[34rem]'
    )
    expect(screen.getByTestId('deferred-degen-specials').getAttribute('data-root-margin')).toBe(
      '0px 0px -160px 0px'
    )
  })
})

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
