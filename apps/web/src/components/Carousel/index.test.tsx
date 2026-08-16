import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

const observedRootMargins: string[] = []

mock.module('@nl/ui/hooks/useOnScreen', () => ({
  useOnScreen: (_ref: unknown, rootMargin: string) => {
    observedRootMargins.push(rootMargin)
    return false
  },
}))

mock.module('@nl/ui/hooks/useDeferredComponent', () => ({
  default: () => ({ Component: null }),
}))

describe('NiftyCarousel', () => {
  beforeEach(() => {
    observedRootMargins.length = 0
  })

  it('keeps the interactive bundle deferred until the measured preload window', async () => {
    const { default: NiftyCarousel, CAROUSEL_ROOT_MARGIN } = await import('./index')

    render(
      <NiftyCarousel>
        <div>Card</div>
      </NiftyCarousel>
    )

    expect(CAROUSEL_ROOT_MARGIN).toBe('160px 0px')
    expect(observedRootMargins).toEqual(['160px 0px'])
  })
})
