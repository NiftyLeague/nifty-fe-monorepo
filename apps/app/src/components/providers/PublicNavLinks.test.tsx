
import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@/runtime/Link', () => ({
  default: ({
    children,
    href,
    prefetch,
    ...props
  }: { href: string; prefetch?: boolean } & { children?: JSX.Element }) => (
    <a href={href} data-prefetch={String(prefetch)} {...props}>
      {children}
    </a>
  ),
}))

mock.module('@/runtime/navigation', () => ({
  usePathname: () => '/world',
}))

import PublicNavLinks from './PublicNavLinks'

describe('public navigation links', () => {
  it('renders the static menu as server-compatible accessible links', () => {
    render(<PublicNavLinks />)

    const navLinks = screen.getAllByRole('link')
    expect(navLinks.map((link) => link.textContent)).toEqual([
      'Games',
      'World',
      'DEGENs',
      'Mint-O-Matic',
      'Leaderboards',
    ])

    const worldLink = screen.getByRole('link', { name: 'World' })
    expect(worldLink.getAttribute('href')).toBe('/world')
    expect(worldLink.getAttribute('aria-current')).toBe('page')
    expect(worldLink.getAttribute('data-prefetch')).toBe('false')

    const degensLink = screen.getByRole('link', { name: 'DEGENs' })
    expect(degensLink.getAttribute('href')).toBe('/degens')
    expect(degensLink.className).toContain('text-sidebar-foreground')
    expect(degensLink.getAttribute('aria-current')).toBeNull()
    expect(degensLink.getAttribute('data-prefetch')).toBe('false')
    expect(screen.getByRole('link', { name: 'Games' }).getAttribute('href')).toBe('/')
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@/runtime/Link', () => ({
  default: ({
    children,
    href,
    prefetch,
    ...props
  }: { href: string; prefetch?: boolean } & { children?: JSX.Element }) => (
    <a href={href} data-prefetch={String(prefetch)} {...props}>
      {children}
    </a>
  ),
}))

mock.module('@/runtime/navigation', () => ({
  usePathname: () => '/world',
}))

import PublicNavLinks from './PublicNavLinks'

describe('public navigation links', () => {
  it('renders the static menu as server-compatible accessible links', () => {
    render(<PublicNavLinks />)

    const navLinks = screen.getAllByRole('link')
    expect(navLinks.map((link) => link.textContent)).toEqual([
      'Games',
      'World',
      'DEGENs',
      'Mint-O-Matic',
      'Leaderboards',
    ])

    const worldLink = screen.getByRole('link', { name: 'World' })
    expect(worldLink.getAttribute('href')).toBe('/world')
    expect(worldLink.getAttribute('aria-current')).toBe('page')
    expect(worldLink.getAttribute('data-prefetch')).toBe('false')

    const degensLink = screen.getByRole('link', { name: 'DEGENs' })
    expect(degensLink.getAttribute('href')).toBe('/degens')
    expect(degensLink.className).toContain('text-sidebar-foreground')
    expect(degensLink.getAttribute('aria-current')).toBeNull()
    expect(degensLink.getAttribute('data-prefetch')).toBe('false')
    expect(screen.getByRole('link', { name: 'Games' }).getAttribute('href')).toBe('/')
  })
})
