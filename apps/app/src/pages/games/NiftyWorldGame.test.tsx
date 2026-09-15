import { act, fireEvent, render, screen } from '@nl/ui/test-utils'
import { afterEach, describe, expect, it, jest, mock } from 'bun:test'

import { NIFTY_WORLD_GAMES, getNiftyWorldGameUrl } from '@/constants/niftyworld-games'
import type { JSX } from 'solid-js'

mock.module('@/runtime/Link', () => ({
  default: ({
    children,
    href,
    prefetch: _prefetch,
    ...props
  }: { href: string; prefetch?: boolean } & { children?: JSX.Element }) => (
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
    render(() => <NiftyWorldGame game={game} />)
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

    render(() => <NiftyWorldGame game={game} />)

    expect(screen.getByRole('status', { name: `Loading ${game.title}` })).toBeTruthy()

    fireEvent.load(screen.getByTitle(`${game.title} mini game`))

    expect(screen.queryByRole('status', { name: `Loading ${game.title}` })).toBeNull()
  })

  it('focuses the embedded game when it finishes loading', async () => {
    const { default: NiftyWorldGame } = await import('./NiftyWorldGame')
    const game = NIFTY_WORLD_GAMES[0]
    const originalClassName = document.documentElement.className
    document.documentElement.classList.add('dark')

    render(() => <NiftyWorldGame game={game} />)

    const iframe = screen.getByTitle(`${game.title} mini game`)
    const focusSpy = jest.spyOn(iframe, 'focus')
    const postMessage = jest.fn()
    Object.defineProperty(iframe, 'contentWindow', {
      configurable: true,
      value: { postMessage },
    })

    fireEvent.load(iframe)

    expect(focusSpy).toHaveBeenCalledTimes(1)
    expect(postMessage).toHaveBeenCalledWith(
      { type: 'niftyworld:theme', theme: 'dark' },
      'https://niftyworld.gg'
    )

    document.documentElement.className = originalClassName
  })

  it('re-sends the theme when the embedded world confirms its listener is ready', async () => {
    const { default: NiftyWorldGame } = await import('./NiftyWorldGame')
    const game = NIFTY_WORLD_GAMES[0]
    const originalClassName = document.documentElement.className
    document.documentElement.classList.add('dark')

    render(() => <NiftyWorldGame game={game} />)

    const iframe = screen.getByTitle(`${game.title} mini game`)
    const postMessage = jest.fn()
    Object.defineProperty(iframe, 'contentWindow', {
      configurable: true,
      value: { postMessage },
    })

    fireEvent.load(iframe)
    postMessage.mockClear()
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { type: 'niftyworld:theme-ready' },
        origin: 'https://niftyworld.gg',
        source: iframe.contentWindow,
      })
    )

    expect(postMessage).toHaveBeenCalledWith(
      { type: 'niftyworld:theme', theme: 'dark' },
      'https://niftyworld.gg'
    )

    document.documentElement.className = originalClassName
  })

  it('cache-busts a stalled iframe when retrying the game', async () => {
    jest.useFakeTimers()
    const { default: NiftyWorldGame } = await import('./NiftyWorldGame')
    const game = NIFTY_WORLD_GAMES[0]

    render(() => <NiftyWorldGame game={game} />)
    const initialUrl = new URL(
      screen.getByTitle(`${game.title} mini game`).getAttribute('src') ?? ''
    )

    act(() => jest.advanceTimersByTime(30_000))

    const retryUrl = new URL(screen.getByTitle(`${game.title} mini game`).getAttribute('src') ?? '')
    expect(retryUrl.searchParams.get('attempt')).toBe('1')
    expect(retryUrl.searchParams.get('visit')).toBe(initialUrl.searchParams.get('visit'))
    expect(screen.getByRole('status', { name: `Loading ${game.title}` })).toBeTruthy()
  })

  it('does not retry a still-loading external game during the initial grace period', async () => {
    jest.useFakeTimers()
    const { default: NiftyWorldGame } = await import('./NiftyWorldGame')
    const game = NIFTY_WORLD_GAMES[0]

    render(() => <NiftyWorldGame game={game} />)
    const iframe = screen.getByTitle(`${game.title} mini game`)

    act(() => jest.advanceTimersByTime(10_000))

    expect(new URL(iframe.getAttribute('src') ?? '').searchParams.get('attempt')).toBeNull()
    expect(screen.getByRole('status', { name: `Loading ${game.title}` })).toBeTruthy()
  })

  it('uses a fresh iframe URL for each visit to the game route', async () => {
    const { default: NiftyWorldGame } = await import('./NiftyWorldGame')
    const game = NIFTY_WORLD_GAMES[0]

    const firstRender = render(() => <NiftyWorldGame game={game} />)
    const firstUrl = screen.getByTitle(`${game.title} mini game`).getAttribute('src')
    firstRender.unmount()

    render(() => <NiftyWorldGame game={game} />)
    const secondUrl = screen.getByTitle(`${game.title} mini game`).getAttribute('src')

    expect(firstUrl).not.toBe(secondUrl)
    expect(new URL(secondUrl ?? '').searchParams.get('visit')).toBeTruthy()
  })
})

mock.module('@/runtime/Link', () => ({
  default: ({
    children,
    href,
    prefetch: _prefetch,
    ...props
  }: { href: string; prefetch?: boolean } & { children?: JSX.Element }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

mock.module('@nl/ui/custom/external-icon', () => ({
  ExternalIcon: () => null,
}))
