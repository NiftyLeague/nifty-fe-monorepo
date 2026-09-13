import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'
import type { ComponentProps } from 'react'

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: (props: ComponentProps<'img'>) => <img {...props} />,
}))

mock.module('@nl/ui/custom/theme-button-group', () => ({
  ThemeButtonGroup: ({
    primary,
    secondary,
  }: {
    primary: { href: string; title: string }
    secondary: { href: string; title: string }
  }) => (
    <div>
      <a href={primary.href}>{primary.title}</a>
      <a href={secondary.href}>{secondary.title}</a>
    </div>
  ),
}))

describe('HomeV3Community', () => {
  it('points the replacement community section to Discord and the community page', async () => {
    const { default: HomeV3Community } = await import('./HomeV3Community')

    render(<HomeV3Community />)

    expect(screen.getByRole('heading', { name: 'COMMUNITY' })).toBeTruthy()
    expect(screen.getByRole('img', { name: 'Community DEGENs' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'JOIN DISCORD' }).getAttribute('href')).toBe(
      'https://discord.gg/niftyleague'
    )
    expect(screen.getByRole('link', { name: 'MORE LINKS' }).getAttribute('href')).toBe('/community')
  })
})
