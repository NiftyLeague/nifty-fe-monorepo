import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'
import type { ComponentProps } from 'react'

import { NIFTY_WORLD_APP_URL } from '@/constants/links'

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: (props: ComponentProps<'img'>) => <img {...props} />,
}))

mock.module('@nl/ui/custom/theme-button-group', () => ({
  ThemeButtonGroup: ({
    primary,
    secondary,
  }: {
    primary: { title: string; href?: string; external?: boolean }
    secondary?: { title: string }
  }) => (
    <div>
      <a href={primary.href ?? '#primary'} target={primary.external ? '_blank' : undefined}>
        {primary.title}
      </a>
      {secondary ? <a href="#secondary">{secondary.title}</a> : null}
    </div>
  ),
}))

describe('HomeV3Games', () => {
  it('keeps the Smashers and Nifty World destinations accessible', async () => {
    const { default: HomeV3Games } = await import('./HomeV3Games')

    render(<HomeV3Games />)

    expect(screen.getByRole('heading', { name: 'OUR GAMES' })).toBeTruthy()
    expect(screen.getByRole('link', { name: /Explore Nifty Smashers/ }).getAttribute('href')).toBe(
      'https://niftysmashers.com'
    )
    const worldLink = screen.getByRole('link', { name: /Explore Nifty World/ })
    expect(worldLink.getAttribute('href')).toBe(NIFTY_WORLD_APP_URL)
    expect(worldLink.getAttribute('target')).toBe('_blank')
    const worldAction = screen.getByRole('link', { name: 'EXPLORE NIFTY WORLD' })
    expect(worldAction.getAttribute('href')).toBe(NIFTY_WORLD_APP_URL)
    expect(worldAction.getAttribute('target')).toBe('_blank')
    expect(screen.getByRole('link', { name: 'MORE ABOUT THE WORLD' }).getAttribute('href')).toBe(
      '/niftyworld'
    )
  })
})
