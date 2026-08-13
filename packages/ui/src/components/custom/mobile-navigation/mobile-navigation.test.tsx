import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import MobileNavigationDisclosure from './index'

describe('MobileNavigationDisclosure', () => {
  it('renders a native, accessible disclosure', () => {
    render(
      <MobileNavigationDisclosure id="public-mobile-navigation" label="Toggle navigation">
        <nav aria-label="Primary navigation">
          <a href="/games">Games</a>
        </nav>
      </MobileNavigationDisclosure>
    )

    const label = screen.getByText('Toggle navigation')
    const summary = label.closest('summary')

    expect(summary?.getAttribute('aria-controls')).toBe('public-mobile-navigation')
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).not.toBeNull()

    fireEvent.click(label)

    expect(summary?.closest('details')?.hasAttribute('open')).toBe(true)
  })
})
