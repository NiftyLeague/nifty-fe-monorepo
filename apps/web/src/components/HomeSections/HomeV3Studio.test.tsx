import { render, screen } from '@nl/ui/test-utils'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}))

mock.module('@nl/ui/custom/theme-button-group', () => ({
  ThemeButtonGroup: ({ children }) => <div>{children}</div>,
}))

describe('HomeV3Studio', () => {
  it('renders the replacement studio story with all three principles', async () => {
    const { default: HomeV3Studio } = await import('./HomeV3Studio')

    render(() => <HomeV3Studio />)

    expect(screen.getByRole('heading', { name: /BY GAMERS.*FOR GAMERS/i })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'GAMEPLAY FIRST.' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'OPEN TO BUILDERS.' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'SHAPED TOGETHER.' })).toBeTruthy()
    expect(
      screen.getByText('We make games with personality, shaped by the people who play them.')
    ).toBeTruthy()
  })
})
