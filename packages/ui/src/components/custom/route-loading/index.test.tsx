import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import RouteLoading from './index'

describe('RouteLoading', () => {
  it('renders a themed, accessible loading boundary', () => {
    const { container } = render(<RouteLoading label="Loading Nifty League" />)
    const status = screen.getByRole('status')

    expect(status.getAttribute('aria-live')).toBe('polite')
    expect(status.getAttribute('aria-busy')).toBe('true')
    expect(screen.getByText('Loading Nifty League')).toBeTruthy()
    expect(container.querySelector('[data-slot="skeleton"]')).toBeTruthy()
  })
})
