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

    // Selected by the panel it controls: the summary keeps its implicit role so
    // the browser supplies aria-expanded, which means a role query cannot find it.
    const toggle = document.querySelector(
      '[aria-controls="public-desktop-navigation"]'
    ) as HTMLElement
    const disclosure = toggle.closest('details')
    const shell = document.querySelector('[data-public-navigation]')

    expect(disclosure?.open).toBe(true)
    expect(shell?.getAttribute('data-public-sidebar-state')).toBe('open')
    expect(toggle.getAttribute('aria-controls')).toBe('public-desktop-navigation')

    fireEvent.click(toggle)
    expect(disclosure?.open).toBe(false)
    expect(shell?.getAttribute('data-public-sidebar-state')).toBe('closed')

    fireEvent.click(toggle)
    expect(disclosure?.open).toBe(true)
    expect(shell?.getAttribute('data-public-sidebar-state')).toBe('open')

    // The disclosure keeps its implicit `summary` role so the browser supplies
    // aria-expanded, which means an explicit role query cannot find it here; the
    // shell renders a desktop disclosure too, so select by the panel it controls.
    const mobileToggle = document.querySelector(
      '[aria-controls="public-mobile-navigation"]'
    ) as HTMLElement
    const mobileDisclosure = mobileToggle.closest('details')

    expect(mobileToggle.getAttribute('aria-controls')).toBe('public-mobile-navigation')
    expect(mobileDisclosure?.open).toBe(false)

    fireEvent.click(mobileToggle)
    expect(mobileDisclosure?.open).toBe(true)

    const mobilePanel = document.getElementById('public-mobile-navigation')
    expect(mobilePanel?.className).toContain('top-[60px]')

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
