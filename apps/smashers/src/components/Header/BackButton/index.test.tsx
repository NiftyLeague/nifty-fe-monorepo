import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

describe('Smashers back button', () => {
  it('renders an accessible native link to the home page', async () => {
    const BackButton = (await import('./index')).default
    render(<BackButton />)

    const link = screen.getByRole('link', { name: 'back' })

    expect(link.getAttribute('href')).toBe('/')
    expect(link.getAttribute('data-prefetch')).toBeNull()
  })
})
