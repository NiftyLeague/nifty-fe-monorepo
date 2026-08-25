import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import PublicNavigation from './PublicNavigation'

beforeEach(() => {
  mock.module('next/link', () => ({
    default: ({
      children,
      href,
      prefetch,
      ...props
    }: React.PropsWithChildren<{ href: string; prefetch?: boolean }>) => (
      <a href={href} data-prefetch={String(prefetch)} {...props}>
        {children}
      </a>
    ),
  }))
  mock.module('next/image', () => ({
    default: ({ alt }: { alt?: string }) => <span data-image-alt={alt ?? ''} />,
  }))
})

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
    expect(document.querySelectorAll('[data-public-user-profile]')).toHaveLength(2)
  })
})
