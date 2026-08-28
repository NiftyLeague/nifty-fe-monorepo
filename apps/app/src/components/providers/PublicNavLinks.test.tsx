import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import PublicNavLinks from './PublicNavLinks'

describe('public navigation links', () => {
  it('renders the static menu as server-compatible accessible links', () => {
    render(<PublicNavLinks />)

    const degensLink = screen.getByRole('link', { name: 'DEGENs' })
    expect(degensLink.getAttribute('href')).toBe('/degens')
    expect(degensLink.className).toContain('text-sidebar-foreground')
    expect(degensLink.getAttribute('aria-current')).toBeNull()
    expect(degensLink.getAttribute('data-prefetch')).toBeNull()
    expect(screen.getByRole('link', { name: 'Games' }).getAttribute('href')).toBe('/')
  })
})
