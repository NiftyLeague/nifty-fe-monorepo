import { fireEvent, render, screen } from '@nl/ui/test-utils'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@/runtime/Link', () => ({
  default: ({
    children,
    href,
    prefetch: _prefetch,
    ...props
  }: { href: string; prefetch?: boolean } & { children?: JSX.Element }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

mock.module('@/runtime/navigation', () => ({
  usePathname: () => () => '/',
}))

import PublicNavigation from './PublicNavigation'
import type { JSX } from 'solid-js'

describe('PublicNavigation', () => {
  it('does not render implementation notes as page content', () => {
    render(() => (
      <PublicNavigation>
        <p>Public content</p>
      </PublicNavigation>
    ))

    expect(document.querySelector('[data-public-navigation]')?.textContent).not.toContain(
      'Keyboard-scrollable'
    )
    expect(document.querySelector('[data-public-navigation]')?.textContent).not.toContain(
      'scrollable-region-focusable'
    )
  })

  it('keeps the desktop sidebar open with an accessible native disclosure control', () => {
    render(() => (
      <PublicNavigation>
        <p>Public content</p>
      </PublicNavigation>
    ))

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
    expect(mobilePanel?.className).toContain('top-[56px]')
    expect(screen.getByText('Nifty League')).not.toBeNull()

    const worldLink = mobilePanel?.querySelector('a[href="/world"]')
    expect(worldLink).not.toBeNull()
    fireEvent.click(worldLink as Element)
    expect(mobileDisclosure?.open).toBe(false)

    expect(screen.getByRole('link', { name: /^Website/ }).getAttribute('href')).toBe(
      'https://niftyleague.com/'
    )
    expect(screen.getByRole('link', { name: /^Mobile Smashers/ }).getAttribute('href')).toBe(
      'https://niftysmashers.com/'
    )
    expect(screen.getByRole('link', { name: /^Docs/ }).getAttribute('href')).toBe(
      'https://niftyleague.com/docs'
    )
    // Happy-dom does not propagate img alt into the anchor's accessible
    // name, so match the logo links structurally.
    const logos = [...document.querySelectorAll('img[alt="NiftyLogo"]')].map((img) =>
      img.closest('a')
    )
    expect(logos).toHaveLength(2)
    expect(logos.every((link) => link instanceof HTMLAnchorElement)).toBe(true)
    const profileSlots = [...document.querySelectorAll('[data-public-user-profile]')]
    expect(profileSlots).toHaveLength(2)
    expect(profileSlots.map((slot) => slot.getAttribute('data-placement'))).toEqual([
      'mobile',
      'desktop',
    ])
  })
})
