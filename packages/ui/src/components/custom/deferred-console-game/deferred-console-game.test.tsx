import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const observedRootMargins: string[] = []

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: (_ref: unknown, rootMargin: string) => {
    observedRootMargins.push(rootMargin)
    return false
  },
}))

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: ({ src, ...props }: ComponentProps<'img'>) => <img {...props} src={src} />,
}))

describe('DeferredConsoleGame', () => {
  let DeferredConsoleGame: typeof import('./index').DeferredConsoleGame

  beforeEach(async () => {
    DeferredConsoleGame = (await import('./index')).DeferredConsoleGame
  })

  it('renders the backdrop while keeping video media out of the initial viewport', () => {
    const { container } = render(
      <DeferredConsoleGame src="/video/example.mp4">
        <img alt="Game Console Backdrop" loading="eager" src="/img/backdrop.webp" />
      </DeferredConsoleGame>
    )
    const backdrop = screen.getByRole('img', { name: 'Game Console Backdrop' })

    expect(backdrop.getAttribute('loading')).toBe('eager')
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('source')).toBeNull()
    expect(screen.queryByRole('img', { name: 'Loading game preview' })).toBeNull()
    expect(container.firstElementChild?.className).toContain('overflow-hidden')
    expect(container.firstElementChild?.getAttribute('style')).toContain(
      'aspect-ratio: 4842 / 3371'
    )
    expect(observedRootMargins).toEqual(['0px 0px -25% 0px'])
  })
})
