import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import MobileNavigationDisclosure from './index'

describe('MobileNavigationDisclosure', () => {
  it('renders a native, accessible disclosure', () => {
    const { container } = render(
      <MobileNavigationDisclosure id="public-mobile-navigation" label="Toggle navigation">
        <nav aria-label="Primary navigation">
          <a href="/games">Games</a>
        </nav>
      </MobileNavigationDisclosure>
    )

    // Queried by element rather than by role: the disclosure keeps its implicit
    // `summary` role so the browser supplies aria-expanded, and this DOM maps
    // `summary` to no role at all.
    const summary = container.querySelector('summary') as HTMLElement

    expect(summary.getAttribute('role')).toBeNull()
    expect(summary.getAttribute('aria-controls')).toBe('public-mobile-navigation')
    expect(screen.getByRole('navigation', { name: 'Primary navigation' })).not.toBeNull()

    fireEvent.click(summary)

    expect(summary.closest('details')?.hasAttribute('open')).toBe(true)
  })
})
