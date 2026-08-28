import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import PublicNavigation from './PublicNavigation'

describe('PublicNavigation', () => {
  it('keeps the desktop sidebar open with an accessible native disclosure control', () => {
    render(
      <PublicNavigation>
        <p>Public content</p>
      </PublicNavigation>
    )

    const toggle = screen.getByRole('button', { name: 'Toggle sidebar' })
    const disclosure = toggle.closest('details')

    expect(disclosure?.open).toBe(true)
    expect(toggle.getAttribute('aria-controls')).toBe('public-desktop-navigation')

    fireEvent.click(toggle)
    expect(disclosure?.open).toBe(false)

    fireEvent.click(toggle)
    expect(disclosure?.open).toBe(true)

    const mobileToggle = screen.getByRole('button', { name: 'Toggle navigation' })
    const mobileDisclosure = mobileToggle.closest('details')

    expect(mobileToggle.getAttribute('aria-controls')).toBe('public-mobile-navigation')
    expect(mobileDisclosure?.open).toBe(false)

    fireEvent.click(mobileToggle)
    expect(mobileDisclosure?.open).toBe(true)

    const mobilePanel = document.getElementById('public-mobile-navigation')
    expect(mobilePanel?.className).toContain('top-14')

    expect(screen.getByRole('link', { name: 'Website' }).getAttribute('href')).toBe(
      'https://niftyleague.com/'
    )
    expect(screen.getByRole('link', { name: 'Mobile Smashers' }).getAttribute('href')).toBe(
      'https://niftysmashers.com/'
    )
    expect(screen.getByRole('link', { name: 'Docs' }).getAttribute('href')).toBe(
      'https://niftyleague.com/docs'
    )
    const logos = screen.getAllByRole('link', { name: 'NiftyLogo' })
    expect(logos).toHaveLength(2)
    expect(logos.every((logo) => logo.getAttribute('href') === '/')).toBe(true)
    const profileSlots = [...document.querySelectorAll('[data-public-user-profile]')]
    expect(profileSlots).toHaveLength(2)
    expect(profileSlots.map((slot) => slot.getAttribute('data-placement'))).toEqual([
      'mobile',
      'desktop',
    ])
  })
})
