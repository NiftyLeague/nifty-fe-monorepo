import type { ComponentProps } from 'solid-js'

import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

describe('flagship game list', () => {
  beforeEach(() => {
    mock.module('@/runtime/Link', () => ({
      default: ({
        children,
        href,
        prefetch,
        ...props
      }: { href: string; prefetch?: boolean } & { children?: JSX.Element }) => (
        <a href={href} data-prefetch={String(prefetch)} {...props}>
          {children}
        </a>
      ),
    }))
    mock.module('@nl/ui/custom/optimized-image', () => ({
      default: ({ fill: _fill, alt = '', ...props }: ComponentProps<'img'>) => (
        <img alt={alt} {...props} />
      ),
    }))
  })

  afterEach(() => {
    mock.restore()
  })

  it('prioritizes the first game artwork while deferring later cards', async () => {
    const { default: GameList } = await import('./index')

    render(<GameList />)

    const firstCardImage = screen.getByAltText('Nifty Smashers (Beta)')
    const secondCardImage = screen.getByAltText('Party Royale (Early-Alpha)')
    const thirdCardImage = screen.getByAltText('Smashers Origins (Beta)')

    expect(firstCardImage.getAttribute('loading')).toBe('eager')
    expect(firstCardImage.getAttribute('fetchpriority')).toBe('high')
    expect(firstCardImage.getAttribute('quality')).toBe('60')
    expect(firstCardImage.getAttribute('sizes')).toBe('(min-width: 768px) 410px, 100vw')
    expect(secondCardImage.getAttribute('loading')).toBe('lazy')
    expect(secondCardImage.getAttribute('fetchpriority')).toBeNull()
    expect(secondCardImage.getAttribute('quality')).toBe('60')
    expect(thirdCardImage.getAttribute('loading')).toBe('lazy')
  })

  it('keeps game cards in the page heading hierarchy', async () => {
    const { default: GameList } = await import('./index')

    render(<GameList />)

    const heading = screen.getByRole('heading', { level: 3, name: 'Nifty Smashers (Beta)' })

    expect(heading).not.toBeNull()
    expect(heading.className).toContain('text-xl')
    expect(heading.className).toContain('font-subheader')
    expect(
      screen.getByRole('heading', { level: 3, name: 'Smashers Origins (Beta)' })
    ).not.toBeNull()
  })

  it('links flagship cards to their primary destinations while preserving store actions', async () => {
    const { default: GameList } = await import('./index')

    render(<GameList />)

    expect(screen.getByRole('link', { name: 'Open Nifty Smashers' }).getAttribute('href')).toBe(
      'https://niftysmashers.com/'
    )
    expect(screen.getByRole('link', { name: 'Open Party Royale' }).getAttribute('href')).toBe(
      'https://testflight.apple.com/join/VXxbaZrw'
    )
    expect(screen.getByRole('link', { name: 'Open Smashers Origins' }).getAttribute('href')).toBe(
      'https://store.steampowered.com/app/4297830/Nifty_Smashers_Origins/'
    )
    expect(screen.getAllByRole('link', { name: 'Apple Store Badge' })).toHaveLength(2)
    expect(
      screen
        .getAllByRole('link', { name: 'Steam Store Badge' })
        .map((link) => link.getAttribute('href'))
    ).toEqual([
      'https://niftysmashers.com/steam',
      'https://store.steampowered.com/app/4297830/Nifty_Smashers_Origins/',
    ])
    expect(screen.queryByRole('link', { name: 'Mobile' })).toBeNull()
  })
})

import type { ComponentProps } from 'solid-js'

import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

describe('flagship game list', () => {
  beforeEach(() => {
    mock.module('@/runtime/Link', () => ({
      default: ({
        children,
        href,
        prefetch,
        ...props
      }: { href: string; prefetch?: boolean } & { children?: JSX.Element }) => (
        <a href={href} data-prefetch={String(prefetch)} {...props}>
          {children}
        </a>
      ),
    }))
    mock.module('@nl/ui/custom/optimized-image', () => ({
      default: ({ fill: _fill, alt = '', ...props }: ComponentProps<'img'>) => (
        <img alt={alt} {...props} />
      ),
    }))
  })

  afterEach(() => {
    mock.restore()
  })

  it('prioritizes the first game artwork while deferring later cards', async () => {
    const { default: GameList } = await import('./index')

    render(<GameList />)

    const firstCardImage = screen.getByAltText('Nifty Smashers (Beta)')
    const secondCardImage = screen.getByAltText('Party Royale (Early-Alpha)')
    const thirdCardImage = screen.getByAltText('Smashers Origins (Beta)')

    expect(firstCardImage.getAttribute('loading')).toBe('eager')
    expect(firstCardImage.getAttribute('fetchpriority')).toBe('high')
    expect(firstCardImage.getAttribute('quality')).toBe('60')
    expect(firstCardImage.getAttribute('sizes')).toBe('(min-width: 768px) 410px, 100vw')
    expect(secondCardImage.getAttribute('loading')).toBe('lazy')
    expect(secondCardImage.getAttribute('fetchpriority')).toBeNull()
    expect(secondCardImage.getAttribute('quality')).toBe('60')
    expect(thirdCardImage.getAttribute('loading')).toBe('lazy')
  })

  it('keeps game cards in the page heading hierarchy', async () => {
    const { default: GameList } = await import('./index')

    render(<GameList />)

    const heading = screen.getByRole('heading', { level: 3, name: 'Nifty Smashers (Beta)' })

    expect(heading).not.toBeNull()
    expect(heading.className).toContain('text-xl')
    expect(heading.className).toContain('font-subheader')
    expect(
      screen.getByRole('heading', { level: 3, name: 'Smashers Origins (Beta)' })
    ).not.toBeNull()
  })

  it('links flagship cards to their primary destinations while preserving store actions', async () => {
    const { default: GameList } = await import('./index')

    render(<GameList />)

    expect(screen.getByRole('link', { name: 'Open Nifty Smashers' }).getAttribute('href')).toBe(
      'https://niftysmashers.com/'
    )
    expect(screen.getByRole('link', { name: 'Open Party Royale' }).getAttribute('href')).toBe(
      'https://testflight.apple.com/join/VXxbaZrw'
    )
    expect(screen.getByRole('link', { name: 'Open Smashers Origins' }).getAttribute('href')).toBe(
      'https://store.steampowered.com/app/4297830/Nifty_Smashers_Origins/'
    )
    expect(screen.getAllByRole('link', { name: 'Apple Store Badge' })).toHaveLength(2)
    expect(
      screen
        .getAllByRole('link', { name: 'Steam Store Badge' })
        .map((link) => link.getAttribute('href'))
    ).toEqual([
      'https://niftysmashers.com/steam',
      'https://store.steampowered.com/app/4297830/Nifty_Smashers_Origins/',
    ])
    expect(screen.queryByRole('link', { name: 'Mobile' })).toBeNull()
  })
})

import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'

describe('flagship game list', () => {
  beforeEach(() => {
    mock.module('@/runtime/Link', () => ({
      default: ({
        children,
        href,
        prefetch,
        ...props
      }: { href: string; prefetch?: boolean } & { children?: JSX.Element }) => (
        <a href={href} data-prefetch={String(prefetch)} {...props}>
          {children}
        </a>
      ),
    }))
    mock.module('@nl/ui/custom/optimized-image', () => ({
      default: ({ fill: _fill, alt = '', ...props }: ComponentProps<'img'>) => (
        <img alt={alt} {...props} />
      ),
    }))
  })

  afterEach(() => {
    mock.restore()
  })

  it('prioritizes the first game artwork while deferring later cards', async () => {
    const { default: GameList } = await import('./index')

    render(<GameList />)

    const firstCardImage = screen.getByAltText('Nifty Smashers (Beta)')
    const secondCardImage = screen.getByAltText('Party Royale (Early-Alpha)')
    const thirdCardImage = screen.getByAltText('Smashers Origins (Beta)')

    expect(firstCardImage.getAttribute('loading')).toBe('eager')
    expect(firstCardImage.getAttribute('fetchpriority')).toBe('high')
    expect(firstCardImage.getAttribute('quality')).toBe('60')
    expect(firstCardImage.getAttribute('sizes')).toBe('(min-width: 768px) 410px, 100vw')
    expect(secondCardImage.getAttribute('loading')).toBe('lazy')
    expect(secondCardImage.getAttribute('fetchpriority')).toBeNull()
    expect(secondCardImage.getAttribute('quality')).toBe('60')
    expect(thirdCardImage.getAttribute('loading')).toBe('lazy')
  })

  it('keeps game cards in the page heading hierarchy', async () => {
    const { default: GameList } = await import('./index')

    render(<GameList />)

    const heading = screen.getByRole('heading', { level: 3, name: 'Nifty Smashers (Beta)' })

    expect(heading).not.toBeNull()
    expect(heading.className).toContain('text-xl')
    expect(heading.className).toContain('font-subheader')
    expect(
      screen.getByRole('heading', { level: 3, name: 'Smashers Origins (Beta)' })
    ).not.toBeNull()
  })

  it('links flagship cards to their primary destinations while preserving store actions', async () => {
    const { default: GameList } = await import('./index')

    render(<GameList />)

    expect(screen.getByRole('link', { name: 'Open Nifty Smashers' }).getAttribute('href')).toBe(
      'https://niftysmashers.com/'
    )
    expect(screen.getByRole('link', { name: 'Open Party Royale' }).getAttribute('href')).toBe(
      'https://testflight.apple.com/join/VXxbaZrw'
    )
    expect(screen.getByRole('link', { name: 'Open Smashers Origins' }).getAttribute('href')).toBe(
      'https://store.steampowered.com/app/4297830/Nifty_Smashers_Origins/'
    )
    expect(screen.getAllByRole('link', { name: 'Apple Store Badge' })).toHaveLength(2)
    expect(
      screen
        .getAllByRole('link', { name: 'Steam Store Badge' })
        .map((link) => link.getAttribute('href'))
    ).toEqual([
      'https://niftysmashers.com/steam',
      'https://store.steampowered.com/app/4297830/Nifty_Smashers_Origins/',
    ])
    expect(screen.queryByRole('link', { name: 'Mobile' })).toBeNull()
  })
})
