import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('@/components/cards/NiftyWorldCard', () => ({
  default: ({
    title,
    href,
    hoverActionLabel,
  }: {
    title: string
    href: string
    hoverActionLabel?: string
  }) => (
    <article>
      <h2>{title}</h2>
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
    render(<Web3GameList />)

    expect(
      screen.getAllByRole('link', { name: /^Explore/ }).map((link) => link.getAttribute('href'))
    ).toEqual([
      '/games/niftyworld/degen-dodge',
      '/games/niftyworld/wen-2d',
      '/games/niftyworld/degen-dive',
      '/games/niftyworld/brick-breaker',
      '/games/niftyworld/tennis',
      '/games/niftyworld/wen-3d',
    ])
    expect(screen.queryByText('Play in App')).toBeNull()
    expect(screen.queryByText(/required/i)).toBeNull()
    expect(screen.getAllByText('Play game')).toHaveLength(6)
  })
})
