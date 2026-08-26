import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('next/link', () => ({
  default: ({
    children,
    href,
    prefetch,
  }: React.PropsWithChildren<{ href: string; prefetch?: boolean }>) => (
    <a href={href} data-prefetch={String(prefetch)}>
      {children}
    </a>
  ),
}))

let Logo: typeof import('./Logo').default

beforeEach(async () => {
  Logo = (await import('./Logo')).default
})

describe('Logo', () => {
  it('does not prefetch the home route from the persistent app shell', () => {
    render(<Logo />)

    const logoLink = screen.getByRole('link', { name: 'NiftyLogo' })
    expect(logoLink.getAttribute('href')).toBe('/')
    expect(logoLink.getAttribute('data-prefetch')).toBe('false')
  })
})
