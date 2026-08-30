import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, mock } from 'bun:test'

mock.module('./GoogleTagManager', () => ({
  default: () => <div data-testid="gtm-loaded" />,
}))

const { default: DeferredGoogleTagManager } = await import('./DeferredGoogleTagManager')

describe('DeferredGoogleTagManager', () => {
  afterEach(() => mock.restore())

  it('keeps the GTM chunk out of the initial render until activation', async () => {
    const rendered = render(<DeferredGoogleTagManager />)

    expect(screen.queryByTestId('gtm-loaded')).toBeNull()

    await act(async () => {
      window.dispatchEvent(new Event('pointerdown'))
      await new Promise<void>((resolve) => setTimeout(resolve, 0))
    })

    expect(screen.getByTestId('gtm-loaded')).not.toBeNull()
    rendered.unmount()
  })
})
