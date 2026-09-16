import { render, screen } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it, mock } from 'bun:test'
import type { JSX } from 'solid-js'

mock.module('@/runtime/Link', () => ({
  default: ({
    children,
    href,
    prefetch,
  }: {
    href: string
    prefetch?: boolean
    children?: JSX.Element
  }) => (
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
  it('defers home-route preloading to the router intent default', () => {
    render(() => <Logo />)

    const logoLink = screen.getByRole('link', { name: 'NiftyLogo' })
    expect(logoLink.getAttribute('href')).toBe('/')
    expect(logoLink.getAttribute('data-prefetch')).toBe('undefined')
  })
})
