import type { PropsWithChildren } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, jest, mock } from 'bun:test'

import { NIFTY_WORLD_GAMES, getNiftyWorldGameUrl } from '@/constants/niftyworld-games'

mock.module('@/runtime/Link', () => ({
  default: ({
    children,
    href,
    prefetch: _prefetch,
    ...props
  }: PropsWithChildren<{ href: string; prefetch?: boolean }>) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

mock.module('@nl/ui/custom/external-icon', () => ({
  ExternalIcon: () => null,
}))

describe('NiftyWorldGame', () => {
  afterEach(() => {
    jest.useRealTimers()
    mock.restore()
  })

  it('embeds the selected Nifty World game with an explicit embed contract', async () => {
    const { default: NiftyWorldGame } = await import('./NiftyWorldGame')
    const game = NIFTY_WORLD_GAMES[0]
    render(<NiftyWorldGame game={game} />)
    const iframe = screen.getByTitle(`${game.title} mini game`)
    const iframeUrl = new URL(iframe.getAttribute('src') ?? '')

    expect(iframeUrl.pathname).toBe(new URL(getNiftyWorldGameUrl(game, true)).pathname)
    expect(iframeUrl.searchParams.get('embed')).toBe('1')
    expect(iframeUrl.searchParams.get('visit')).toBeTruthy()
    expect(iframeUrl.searchParams.get('attempt')).toBeNull()
    expect(iframe.getAttribute('title')).toBe(`${game.title} mini game`)
    expect(iframe.getAttribute('allow')).toBe('autoplay; fullscreen; gamepad')
    expect(iframe.getAttribute('loading')).toBe('eager')
    expect(iframe.getAttribute('referrerpolicy')).toBe('strict-origin-when-cross-origin')
    const backLink = screen.getByRole('link', { name: /Back to games/ })
    expect(backLink.querySelector('svg')).toBeTruthy()
    expect(backLink.textContent).toContain('Back to games')
    expect(screen.getByRole('heading', { name: game.title })).toBeTruthy()
    expect(screen.getByText('Nifty League mini game')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Enter fullscreen' })).toBeTruthy()
    expect(screen.getByRole('status', { name: `Loading ${game.title}` })).toBeTruthy()
  })

  it('shows loading feedback until the embedded game is ready', async () => {
    const { default: NiftyWorldGame } = await import('./NiftyWorldGame')
    const game = NIFTY_WORLD_GAMES[0]

    render(<NiftyWorldGame game={game} />)

    expect(screen.getByRole('status', { name: `Loading ${game.title}` })).toBeTruthy()

    fireEvent.load(screen.getByTitle(`${game.title} mini game`))

    expect(screen.queryByRole('status', { name: `Loading ${game.title}` })).toBeNull()
  })

  it('cache-busts a stalled iframe when retrying the game', async () => {
    jest.useFakeTimers()
    const { default: NiftyWorldGame } = await import('./NiftyWorldGame')
    const game = NIFTY_WORLD_GAMES[0]

    render(<NiftyWorldGame game={game} />)
    const initialUrl = new URL(
      screen.getByTitle(`${game.title} mini game`).getAttribute('src') ?? ''
    )

    act(() => jest.advanceTimersByTime(10_000))

    const retryUrl = new URL(screen.getByTitle(`${game.title} mini game`).getAttribute('src') ?? '')
    expect(retryUrl.searchParams.get('attempt')).toBe('1')
    expect(retryUrl.searchParams.get('visit')).toBe(initialUrl.searchParams.get('visit'))
    expect(screen.getByRole('status', { name: `Loading ${game.title}` })).toBeTruthy()
  })

  it('uses a fresh iframe URL for each visit to the game route', async () => {
    const { default: NiftyWorldGame } = await import('./NiftyWorldGame')
    const game = NIFTY_WORLD_GAMES[0]

    const firstRender = render(<NiftyWorldGame game={game} />)
    const firstUrl = screen.getByTitle(`${game.title} mini game`).getAttribute('src')
    firstRender.unmount()

    render(<NiftyWorldGame game={game} />)
    const secondUrl = screen.getByTitle(`${game.title} mini game`).getAttribute('src')

    expect(firstUrl).not.toBe(secondUrl)
    expect(new URL(secondUrl ?? '').searchParams.get('visit')).toBeTruthy()
  })
})
