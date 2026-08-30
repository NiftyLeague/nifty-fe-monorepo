import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

let mockedLoadError = false

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: () => false,
}))

mock.module('@nl/ui/hooks/useDeferredComponent', () => ({
  default: () => ({ Component: null, hasError: mockedLoadError, retry: () => undefined }),
}))

import { DeferredHomeSectionsBoundary } from './DeferredHomeSectionsBoundary'

describe('DeferredHomeSectionsBoundary', () => {
  it('keeps the seven accessible layout placeholders before the loader enters the viewport', () => {
    render(<DeferredHomeSectionsBoundary />)

    const boundaries = screen.getAllByRole('status')
    expect(boundaries).toHaveLength(7)
    expect(boundaries.map((boundary) => boundary.getAttribute('aria-label'))).toEqual([
      'Loading community DEGEN section',
      'Loading compete and earn section',
      'Loading NiftyWorld section',
      'Loading dashboard section',
      'Loading NFTL token section',
      'Loading community section',
      'Loading sponsors section',
    ])
    expect(
      boundaries.every((boundary) => boundary.className.includes('deferred-section-minimal'))
    ).toBe(true)
  })

  it('keeps a failed deferred load recoverable', () => {
    mockedLoadError = true

    render(<DeferredHomeSectionsBoundary />)

    expect(screen.getByRole('alert').textContent).toContain(
      'Homepage sections could not be loaded.'
    )
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy()

    mockedLoadError = false
  })
})
