import { render } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import NavbarScrollState, { NAVBAR_SCROLL_STATE_SCRIPT } from './NavbarScrollState'

describe('NavbarScrollState', () => {
  it('renders the compatibility fallback without a hydrated React boundary', () => {
    const { container } = render(<NavbarScrollState targetId="navbar-target" />)
    const script = container.querySelector('script[data-target="navbar-target"]')

    expect(script).not.toBeNull()
    expect(script?.textContent).toBe(NAVBAR_SCROLL_STATE_SCRIPT)
    expect(NAVBAR_SCROLL_STATE_SCRIPT).toContain('requestAnimationFrame')
    expect(NAVBAR_SCROLL_STATE_SCRIPT).toContain('window.scrollY > 80')
    expect(NAVBAR_SCROLL_STATE_SCRIPT).toContain('prefers-reduced-motion')
  })
})
