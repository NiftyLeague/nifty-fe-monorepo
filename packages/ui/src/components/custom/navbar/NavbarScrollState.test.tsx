import { render } from '@nl/ui/test-utils'
import { describe, expect, it } from 'bun:test'

import NavbarScrollState, { NAVBAR_SCROLL_STATE_SCRIPT } from './NavbarScrollState'

describe('NavbarScrollState', () => {
  it('renders the compatibility fallback without a hydrated React boundary', () => {
    const { container } = render(() => <NavbarScrollState targetId="navbar-target" />)
    const script = container.querySelector('script[data-target="navbar-target"]')

    expect(script).not.toBeNull()
    expect(script?.textContent).toBe(NAVBAR_SCROLL_STATE_SCRIPT)
    expect(NAVBAR_SCROLL_STATE_SCRIPT).toContain('requestAnimationFrame')
    expect(NAVBAR_SCROLL_STATE_SCRIPT).toContain('window.scrollY > 80')
    expect(NAVBAR_SCROLL_STATE_SCRIPT).toContain("detail.addEventListener('toggle'")
    expect(NAVBAR_SCROLL_STATE_SCRIPT).toContain("event.key === 'Escape'")
    expect(NAVBAR_SCROLL_STATE_SCRIPT).toContain("document.addEventListener('click'")
  })
})
