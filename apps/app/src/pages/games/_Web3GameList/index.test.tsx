import { render, screen } from '@nl/ui/test-utils'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('@/components/cards/NiftyWorldCard', () => ({
  default: ({
    title,
    href,
    image,
    hoverActionLabel,
  }: {
    title: string
    href: string
    image: string
    hoverActionLabel?: string
  }) => (
    <article>
      <h2>{title}</h2>
      <img src={image} alt={title} />
      <a href={href} aria-label={`Explore ${title}`}>
        {hoverActionLabel}
      </a>
    </article>
  ),
}))

describe('mini game list navigation', () => {
  let Web3GameList: typeof import('./index').default

  beforeEach(async () => {
    Web3GameList = (await import('./index')).default
  })

  afterEach(() => {
    mock.restore()
  })

  it('links every Nifty World mini game into the app', () => {
    render(() => <Web3GameList />)

    expect(
      screen.getAllByRole('link', { name: /^Explore/ }).map((link) => link.getAttribute('href'))
    ).toEqual([
      '/games/degen-dodge',
      '/games/brick-breaker',
      '/games/wen-2d',
      '/games/wen-3d',
      '/games/degen-dive',
      '/games/tennis',
      '/games/mt-gawx',
    ])
    expect(screen.getByRole('img', { name: 'Degen Dive' }).getAttribute('src')).toBe(
      'https://niftyworld.gg/assets/maps/degen-dive.webp'
    )
    expect(screen.queryByText('Play in App')).toBeNull()
    expect(screen.queryByText(/required/i)).toBeNull()
    expect(screen.getAllByText('Play game')).toHaveLength(7)
  })
})
