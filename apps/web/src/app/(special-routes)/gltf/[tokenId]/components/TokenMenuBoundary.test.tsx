import type { PropsWithChildren } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { TokenMenuErrorBoundary } from './TokenMenuBoundary'

function ThrowingTokenMenu(): never {
  throw new Error('token menu failed')
}

describe('TokenMenuErrorBoundary', () => {
  it('keeps a token-menu failure inside the viewer surface', () => {
    const originalConsoleError = console.error
    console.error = () => undefined

    try {
      render(
        <TokenMenuErrorBoundary>
          <ThrowingTokenMenu />
        </TokenMenuErrorBoundary>
      )
    } finally {
      console.error = originalConsoleError
    }

    expect(screen.getByText('Oops!')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Reload Page' })).toBeTruthy()
  })
})
