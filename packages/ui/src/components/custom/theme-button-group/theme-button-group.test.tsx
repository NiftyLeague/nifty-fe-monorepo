import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import ThemeButtonGroup from './index'

describe('ThemeButtonGroup', () => {
  it('renders linked CTAs through the shared shadcn button recipe', () => {
    render(
      <ThemeButtonGroup
        primary={{ href: '/games', title: 'Play now' }}
        secondary={{ href: 'https://niftysmashers.com', title: 'Smashers', external: true }}
      />
    )

    expect(screen.getByRole('link', { name: 'Play now' }).getAttribute('href')).toBe('/games')
    expect(screen.getByRole('link', { name: /Smashers/ }).getAttribute('target')).toBe('_blank')
    expect(screen.getByRole('link', { name: /Smashers/ }).getAttribute('rel')).toBe('noreferrer')
  })

  it('renders unavailable CTAs as disabled buttons instead of empty links', () => {
    render(<ThemeButtonGroup primary={{ title: 'Coming soon', disabled: true }} />)

    const button = screen.getByRole('button', { name: 'Coming soon' })
    expect(button.hasAttribute('disabled')).toBe(true)
    expect(button.getAttribute('href')).toBeNull()
  })
})
