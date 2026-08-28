import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

beforeEach(() => {
  mock.module('@nl/ui/custom/optimized-image', () => ({
    default: ({ alt }: ComponentProps<'img'>) => <span role="img" aria-label={alt} />,
  }))
})

afterEach(() => {
  mock.restore()
})

describe('Smashers navbar', () => {
  it('renders profile navigation as native accessible links', async () => {
    const Navbar = (await import('./index')).default
    render(<Navbar />)

    const profileLinks = screen.getAllByRole('link', { name: 'Profile Icon' })

    expect(profileLinks).toHaveLength(2)
    expect(profileLinks.every((link) => link.getAttribute('href') === '/profile')).toBe(true)
    expect(profileLinks.every((link) => link.getAttribute('data-prefetch') === null)).toBe(true)
  })
})
