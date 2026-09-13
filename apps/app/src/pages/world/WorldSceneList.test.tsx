import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('@/runtime/Link', () => ({
  default: ({
    children,
    href,
    prefetch,
    ...props
  }: PropsWithChildren<{ href: string; prefetch?: boolean }>) => (
    <a href={href} data-prefetch={String(prefetch)} {...props}>
      {children}
    </a>
  ),
}))

mock.module('@/components/cards/GameCard', () => ({
  default: ({
    title,
    href,
    overlayContent,
    prefetch,
  }: {
    title: string
    href?: string
    overlayContent?: boolean
    prefetch?: boolean
  }) => (
    <article>
      <h2>{title}</h2>
      {href && (
        <a
          href={href}
          data-overlay-content={String(overlayContent)}
          data-prefetch={String(prefetch)}
          aria-label={`Explore ${title}`}
        >
          Explore scene
        </a>
      )}
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
    expect(
      screen
        .getAllByRole('link', { name: /^Explore/ })
        .map((link) => link.getAttribute('data-overlay-content'))
    ).toEqual(Array(9).fill('true'))
  })

  it('does not prefetch scene routes until a player chooses one', () => {
    render(<WorldSceneList />)

    expect(
      screen
        .getAllByRole('link', { name: /^Explore/ })
        .map((link) => link.getAttribute('data-prefetch'))
    ).toEqual(Array(9).fill('false'))
  })
})
