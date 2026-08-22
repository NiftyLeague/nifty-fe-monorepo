import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

describe('free-to-play game list', () => {
  beforeEach(() => {
    mock.module('next/image', () => ({
      default: ({ fill: _fill, alt = '', ...props }: ComponentProps<'img'>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} {...props} />
      ),
    }))
    mock.module('@nl/ui/custom/optimized-image', () => ({
      default: ({ fill: _fill, alt = '', ...props }: ComponentProps<'img'>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} {...props} />
      ),
    }))
  })

  it('prioritizes the first game artwork while deferring later cards', async () => {
    const { default: GameList } = await import('./index')

    render(<GameList />)

    const firstCardImage = screen.getByAltText('Nifty Smashers (Beta)')
    const secondCardImage = screen.getByAltText('Party Royale (Early-Alpha)')

    expect(firstCardImage.getAttribute('loading')).toBe('eager')
    expect(firstCardImage.getAttribute('fetchpriority')).toBe('high')
    expect(firstCardImage.getAttribute('quality')).toBe('60')
    expect(firstCardImage.getAttribute('sizes')).toBe('(min-width: 768px) 410px, 100vw')
    expect(secondCardImage.getAttribute('loading')).toBe('lazy')
    expect(secondCardImage.getAttribute('fetchpriority')).toBe('auto')
    expect(secondCardImage.getAttribute('quality')).toBe('60')
  })

  it('keeps game cards in the page heading hierarchy', async () => {
    const { default: GameList } = await import('./index')

    render(<GameList />)

    const heading = screen.getByRole('heading', { level: 3, name: 'Nifty Smashers (Beta)' })

    expect(heading).not.toBeNull()
    expect(heading.className).toContain('text-xl')
    expect(heading.className).toContain('font-subheader')
  })
})
