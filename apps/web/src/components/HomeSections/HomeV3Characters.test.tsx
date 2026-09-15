import { render, screen } from '@nl/ui/test-utils'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}))

describe('HomeV3Characters', () => {
  it('renders the comparison content without an extra motion control', async () => {
    const { default: HomeV3Characters } = await import('./HomeV3Characters')

    render(() => <HomeV3Characters />)

    expect(screen.getByRole('heading', { name: /PIXEL ROOTS.*A NEW DIMENSION/i })).toBeTruthy()
    expect(screen.getByRole('article', { name: 'DOGE: from 2D to 3D' })).toBeTruthy()
    const studioLink = screen.getByRole('link', { name: 'RetroStyle Games' })
    expect(studioLink.className).toContain('home-v3-inline-link')
    expect(studioLink.getAttribute('href')).toBe(
      'https://retrostylegames.com/portfolio/nifty-league-pixel-nft-characters-and-animations/'
    )
    expect(studioLink.getAttribute('target')).toBe('_blank')
    expect(screen.queryByRole('button', { name: /motion/i })).toBeNull()
  })
})
