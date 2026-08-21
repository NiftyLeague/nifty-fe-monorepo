import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

describe('free-to-play game list', () => {
  beforeEach(() => {
    mock.module('next/image', () => ({
      default: ({ fill: _fill, sizes: _sizes, alt = '', ...props }: ComponentProps<'img'>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} {...props} />
      ),
    }))
    mock.module('@nl/ui/custom/optimized-image', () => ({
      default: ({ fill: _fill, sizes: _sizes, alt = '', ...props }: ComponentProps<'img'>) => (
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
    expect(secondCardImage.getAttribute('loading')).toBe('lazy')
    expect(secondCardImage.getAttribute('fetchpriority')).toBe('auto')
  })
})
