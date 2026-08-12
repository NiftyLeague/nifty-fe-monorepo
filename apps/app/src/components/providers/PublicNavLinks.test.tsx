import type { ComponentProps, PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

describe('public navigation links', () => {
  let PublicNavLinks: typeof import('./PublicNavLinks').default

  beforeEach(async () => {
    mock.module('next/navigation', () => ({
      usePathname: () => '/degens',
    }))
    mock.module('next/link', () => ({
      default: ({ children, href, ...props }: PropsWithChildren<{ href: string }>) => (
        <a href={href} {...(props as ComponentProps<'a'>)}>
          {children}
        </a>
      ),
    }))

    const navLinksModule = await import('./PublicNavLinks')
    PublicNavLinks = navLinksModule.default
  })

  it('renders the static menu with an accessible active-page state', () => {
    render(<PublicNavLinks />)

    const degensLink = screen.getByRole('link', { name: 'DEGENs' })
    expect(degensLink.getAttribute('href')).toBe('/degens')
    expect(degensLink.getAttribute('aria-current')).toBe('page')
    expect(degensLink.className).toContain('font-bold')
    expect(screen.getByRole('link', { name: 'Games' }).getAttribute('aria-current')).toBeNull()
  })
})
