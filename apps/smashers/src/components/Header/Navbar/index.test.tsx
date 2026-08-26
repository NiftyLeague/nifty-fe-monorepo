import type { ComponentProps, PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

beforeEach(() => {
  mock.module('next/link', () => ({
    default: ({
      children,
      href,
      prefetch,
      ...props
    }: PropsWithChildren<{
      href: string
      prefetch?: boolean
    }>) => (
      <a href={href} data-prefetch={String(prefetch)} {...props}>
        {children}
      </a>
    ),
  }))
  mock.module('@nl/ui/custom/optimized-image', () => ({
    default: ({ alt }: ComponentProps<'img'>) => <span role="img" aria-label={alt} />,
  }))
})

afterEach(() => {
  mock.restore()
})

describe('Smashers navbar', () => {
  it('does not prefetch the heavy profile route from the home page', async () => {
    const Navbar = (await import('./index')).default
    render(<Navbar />)

    const profileLinks = screen.getAllByRole('link', { name: 'Profile Icon' })

    expect(profileLinks).toHaveLength(2)
    expect(profileLinks.every((link) => link.getAttribute('data-prefetch') === 'false')).toBe(true)
  })
})
