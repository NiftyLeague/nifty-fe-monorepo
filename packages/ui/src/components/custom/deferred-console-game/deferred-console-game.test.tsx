import type { ComponentProps } from 'solid-js'
import { act, render, screen, waitFor } from '@nl/ui/test-utils'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const observedRootMargins: string[] = []
let isNearViewport = false
const activationCallbacks: Array<() => void> = []

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: (_ref: unknown, rootMargin: string) => {
    observedRootMargins.push(rootMargin)
    return () => isNearViewport
  },
}))

mock.module('@nl/ui/hooks/useDeferredComponent', () => ({
  default: (_load: unknown, enabled: boolean | (() => boolean)) => ({
    Component: () =>
      (typeof enabled === 'function' ? enabled() : enabled)
        ? (props: ComponentProps<'div'> & { isNearViewport?: boolean }) => (
            <div data-testid="console-game" data-video-active={String(props.isNearViewport)}>
              {props.children}
              <video>
                {props.isNearViewport ? (
                  <source src="https://cdn.niftyleague.com/media/video/game-console.mp4" />
                ) : null}
              </video>
            </div>
          )
        : null,
    hasError: () => false,
    retry: () => undefined,
  }),
}))

mock.module('@nl/ui/lib/deferred-activation', () => ({
  scheduleDeferredActivation: ({ onActivate }: { onActivate: () => void }) => {
    activationCallbacks.push(onActivate)
    return () => undefined
  },
}))

mock.module('@nl/ui/custom/optimized-image', () => ({
  default: (props: ComponentProps<'img'>) => <img {...props} src={props.src} />,
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
    const { container } = render(() => (
      <DeferredConsoleGame src="https://cdn.niftyleague.com/media/video/game-console.mp4">
        <img alt="Game Console Backdrop" loading="eager" src="/img/backdrop.webp" />
      </DeferredConsoleGame>
    ))
    const backdrop = screen.getByRole('img', { name: 'Game Console Backdrop' })

    expect(backdrop.getAttribute('loading')).toBe('eager')
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('source')).toBeNull()
    expect(container.querySelector('.dark-gradient-overlay')).not.toBeNull()
    expect(screen.queryByRole('img', { name: 'Loading game preview' })).toBeNull()
    expect(container.firstElementChild?.className).toContain('overflow-hidden')
    expect(container.firstElementChild?.getAttribute('style')).toMatch(
      /aspect-ratio:\s*4842 \/ 3371/
    )
    expect(observedRootMargins).toEqual(['0px 0px -25% 0px'])
  })

  it('keeps the backdrop visible while an opt-in video waits for activation', async () => {
    isNearViewport = true
    const { container } = render(() => (
      <DeferredConsoleGame
        deferVideo
        src="https://cdn.niftyleague.com/media/video/game-console.mp4"
      >
        <img alt="Game Console Backdrop" loading="eager" src="/img/backdrop.webp" />
      </DeferredConsoleGame>
    ))

    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('source')).toBeNull()
    expect(screen.getByRole('img', { name: 'Game Console Backdrop' })).not.toBeNull()
    expect(container.querySelector('.dark-gradient-overlay')).not.toBeNull()
    expect(activationCallbacks).toHaveLength(1)

    await act(async () => activationCallbacks[0]?.())

    await waitFor(() => {
      expect(container.querySelector('video')).not.toBeNull()
      expect(container.querySelector('source')?.getAttribute('src')).toBe(
        'https://cdn.niftyleague.com/media/video/game-console.mp4'
      )
    })
    // The SSR backdrop stays mounted outside the deferred boundary so hydration
    // never moves the island's astro-slot element across a swapped branch.
    expect(screen.getByRole('img', { name: 'Game Console Backdrop' })).not.toBeNull()
  })
})
