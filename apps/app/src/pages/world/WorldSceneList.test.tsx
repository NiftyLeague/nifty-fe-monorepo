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

describe('Nifty World scene list', () => {
  let WorldSceneList: typeof import('./WorldSceneList').default

  beforeEach(async () => {
    WorldSceneList = (await import('./WorldSceneList')).default
  })

  afterEach(() => {
    mock.restore()
  })

  it('renders every allowed scene as an in-app map card', () => {
    render(<WorldSceneList />)

    expect(screen.getAllByRole('heading').map((heading) => heading.textContent)).toEqual([
      'Isla Azul',
      'Dungeon',
      'Party Cove',
      'Little Tokyo',
      'Mansion',
      'Nifty Exchange',
      'Marina',
      "Rugman's Peak",
      'Nifty Arcade',
    ])
    expect(screen.queryByText('Gas Station')).toBeNull()
    expect(
      screen.getAllByRole('link', { name: /^Explore/ }).map((link) => link.getAttribute('href'))
    ).toEqual([
      '/world/niftyworld/isla-azul',
      '/world/niftyworld/dungeon',
      '/world/niftyworld/party-cove',
      '/world/niftyworld/little-tokyo',
      '/world/niftyworld/mansion',
      '/world/niftyworld/exchange',
      '/world/niftyworld/marina',
      '/world/niftyworld/rugmans-peak',
      '/world/niftyworld/arcade',
    ])
    expect(screen.queryByText('Enter World')).toBeNull()
    expect(screen.getAllByText('Explore map')).toHaveLength(9)
  })
})
