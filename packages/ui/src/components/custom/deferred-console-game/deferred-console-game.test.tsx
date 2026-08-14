import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: () => false,
}))

describe('DeferredConsoleGame', () => {
  let DeferredConsoleGame: typeof import('./index').DeferredConsoleGame

  beforeEach(async () => {
    DeferredConsoleGame = (await import('./index')).DeferredConsoleGame
  })

  it('keeps an accessible, layout-preserving loading state before the preview is near the viewport', () => {
    const { container } = render(<DeferredConsoleGame src="/video/example.mp4" />)
    const loadingState = screen.getByRole('img', { name: 'Loading game preview' })

    expect(loadingState).toBeTruthy()
    expect(container.firstElementChild?.className).toContain('overflow-hidden')
    expect(container.firstElementChild?.getAttribute('style')).toContain(
      'aspect-ratio: 4842 / 3371'
    )
  })
})
