import type { ComponentProps, PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

describe('public navigation links', () => {
  let PublicNavLinks: typeof import('./PublicNavLinks').default

  beforeEach(async () => {
    mock.module('next/link', () => ({
      default: ({
        children,
        href,
        prefetch,
        ...props
      }: PropsWithChildren<{ href: string; prefetch?: boolean }>) => (
        <a href={href} data-prefetch={String(prefetch)} {...(props as ComponentProps<'a'>)}>
          {children}
        </a>
      ),
    }))

    const navLinksModule = await import('./PublicNavLinks')
    PublicNavLinks = navLinksModule.default
  })

  it('renders the static menu as server-compatible accessible links', () => {
    render(<PublicNavLinks />)

    const degensLink = screen.getByRole('link', { name: 'DEGENs' })
    expect(degensLink.getAttribute('href')).toBe('/degens')
    expect(degensLink.className).toContain('text-sidebar-foreground')
    expect(degensLink.getAttribute('aria-current')).toBeNull()
    expect(degensLink.getAttribute('data-prefetch')).toBe('false')
    expect(screen.getByRole('link', { name: 'Games' }).getAttribute('href')).toBe('/')
  })
})
