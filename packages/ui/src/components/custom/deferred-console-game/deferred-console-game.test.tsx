import type { ComponentProps } from 'react'
import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const observedRootMargins: string[] = []
let isNearViewport = false
const activationCallbacks: Array<() => void> = []

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: (_ref: unknown, rootMargin: string) => {
    observedRootMargins.push(rootMargin)
    return isNearViewport
  },
}))

mock.module('@nl/ui/hooks/useDeferredComponent', () => ({
  default: (_load: unknown, enabled: boolean) => ({
    Component: enabled
      ? ({
          children,
          isNearViewport: active,
        }: ComponentProps<'div'> & { isNearViewport?: boolean }) => (
          <div data-testid="console-game" data-video-active={String(active)}>
            {children}
            <video>{active ? <source src="/video/example.mp4" /> : null}</video>
          </div>
        )
      : null,
  }),
}))

mock.module('@nl/ui/lib/deferred-activation', () => ({
  scheduleDeferredActivation: ({ onActivate }: { onActivate: () => void }) => {
    activationCallbacks.push(onActivate)
    return () => undefined
  },
}))

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: ({ src, ...props }: ComponentProps<'img'>) => <img {...props} src={src} />,
}))

describe('DeferredConsoleGame', () => {
  let DeferredConsoleGame: typeof import('./index').DeferredConsoleGame

  beforeEach(async () => {
    isNearViewport = false
    activationCallbacks.length = 0
    observedRootMargins.length = 0
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
    expect(container.querySelector('.dark-gradient-overlay')).not.toBeNull()
    expect(screen.queryByRole('img', { name: 'Loading game preview' })).toBeNull()
    expect(container.firstElementChild?.className).toContain('overflow-hidden')
    expect(container.firstElementChild?.getAttribute('style')).toContain(
      'aspect-ratio: 4842 / 3371'
    )
    expect(observedRootMargins).toEqual(['0px 0px -25% 0px'])
  })

  it('keeps the backdrop visible while an opt-in video waits for activation', () => {
    isNearViewport = true
    render(
      <DeferredConsoleGame deferVideo src="/video/example.mp4">
        <img alt="Game Console Backdrop" loading="eager" src="/img/backdrop.webp" />
      </DeferredConsoleGame>
    )

    expect(screen.getByTestId('console-game').getAttribute('data-video-active')).toBe('false')
    expect(screen.getByTestId('console-game').querySelector('source')).toBeNull()
    expect(
      screen.getByTestId('console-game').parentElement?.querySelector('.dark-gradient-overlay')
    ).not.toBeNull()
    expect(activationCallbacks).toHaveLength(1)

    act(() => activationCallbacks[0]?.())

    expect(screen.getByTestId('console-game').getAttribute('data-video-active')).toBe('true')
    expect(screen.getByTestId('console-game').querySelector('source')?.getAttribute('src')).toBe(
      '/video/example.mp4'
    )
  })
})
