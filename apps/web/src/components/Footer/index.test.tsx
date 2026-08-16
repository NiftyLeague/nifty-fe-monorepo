import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

describe('website footer links', () => {
  let Footer: typeof import('./index').default

  beforeEach(async () => {
    mock.module('next/link', () => ({
      default: ({
        children,
        href,
        prefetch,
        ...props
      }: PropsWithChildren<{ href: string; prefetch?: boolean }>) => (
        <a href={href} data-prefetch={String(prefetch)} {...props}>
          {children}
        </a>
      ),
    }))
    mock.module('@nl/ui/custom/socials-footer', () => ({
      SocialsFooter: ({ children }: PropsWithChildren) => <footer>{children}</footer>,
      animateClass: '',
      linkClass: '',
    }))
    mock.module('@nl/ui/custom/external-icon', () => ({ ExternalIcon: () => null }))

    Footer = (await import('./index')).default
  })

  it('keeps footer navigation from prefetching routes before activation', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('data-prefetch')).toBe('false')
    expect(screen.getByRole('link', { name: 'Games' }).getAttribute('data-prefetch')).toBe('false')
    expect(screen.getByRole('link', { name: 'NiftyDAO' }).getAttribute('data-prefetch')).toBe(
      'false'
    )
  })
})
