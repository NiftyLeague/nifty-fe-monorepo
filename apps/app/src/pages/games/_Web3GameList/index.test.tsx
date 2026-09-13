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
    actions,
    externalLink,
  }: {
    title: string
    actions?: React.ReactNode
    externalLink?: { title: string; src: string }
  }) => (
    <article>
      <h2>{title}</h2>
      {externalLink && <a href={externalLink.src}>{externalLink.title}</a>}
      {actions}
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

  it('does not prefetch game routes until a player chooses one', () => {
    render(<Web3GameList />)

    expect(
      screen
        .getAllByRole('link')
        .filter((link) => link.hasAttribute('data-prefetch'))
        .map((link) => link.getAttribute('data-prefetch'))
    ).toEqual(['false', 'false', 'false', 'false', 'false', 'false'])
  })

  it('links every Nifty World mini game into the app', () => {
    render(<Web3GameList />)

    expect(
      screen.getAllByRole('link', { name: 'Play in App' }).map((link) => link.getAttribute('href'))
    ).toEqual([
      '/games/niftyworld/degen-dodge',
      '/games/niftyworld/wen-2d',
      '/games/niftyworld/degen-dive',
      '/games/niftyworld/brick-breaker',
      '/games/niftyworld/tennis',
      '/games/niftyworld/wen-3d',
    ])
    expect(screen.queryByText(/required/i)).toBeNull()
  })
})
