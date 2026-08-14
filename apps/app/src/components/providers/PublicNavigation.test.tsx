import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

import PublicNavigation from './PublicNavigation'

beforeEach(() => {
  mock.module('next/link', () => ({
    default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
      <a href={href} {...props}>
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

    const mobileToggle = screen.getByRole('button', { name: 'Toggle navigation' })
    const mobileDisclosure = mobileToggle.closest('details')

    expect(mobileToggle.getAttribute('aria-controls')).toBe('public-mobile-navigation')
    expect(mobileDisclosure?.open).toBe(false)

    fireEvent.click(mobileToggle)
    expect(mobileDisclosure?.open).toBe(true)

    const mobilePanel = document.getElementById('public-mobile-navigation')
    expect(mobilePanel?.className).toContain('top-14')
  })
})
