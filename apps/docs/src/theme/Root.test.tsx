import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/gtm/deferred-manager', () => ({
  default: () => <div data-testid="deferred-gtm" />,
}))

const { default: Root } = await import('./Root')

afterEach(() => mock.restore())

describe('documentation root analytics', () => {
  it('defers analytics while retaining the no-script fallback', () => {
    render(
      <Root>
        <main>Documentation</main>
      </Root>
    )

    expect(screen.getByTestId('deferred-gtm')).not.toBeNull()
    expect(screen.getByRole('main')).not.toBeNull()
    expect(document.querySelector('noscript')).not.toBeNull()
  })
})
