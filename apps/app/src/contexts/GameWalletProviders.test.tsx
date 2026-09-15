import { render, screen } from '@nl/ui/test-utils'
import { afterEach, describe, expect, it, mock } from 'bun:test'
import type { JSX } from 'solid-js'

mock.module('@/runtime/env', () => ({ AUDIT_FIXTURE: true }))
mock.module('@/runtime/request-cookies', () => ({ getRequestCookieHeader: () => null }))
mock.module('@/runtime/dynamic', () => ({
  default:
    () =>
    ({ children }: { children?: JSX.Element }) =>
      children,
}))
mock.module('@/contexts/AuditFixtureContextWrapper', () => ({
  default: ({ children }: { children?: JSX.Element }) => (
    <div data-testid="audit-fixture-provider">{children}</div>
  ),
}))
mock.module('@/contexts/WalletAuthProviders', () => ({
  default: ({ children }: { children?: JSX.Element }) => (
    <div data-testid="live-wallet-provider">{children}</div>
  ),
}))

describe('GameWalletProviders', () => {
  afterEach(() => mock.restore())

  it('does not mount live wallet auth providers for audit fixtures', async () => {
    const GameWalletProviders = (await import('./GameWalletProviders')).default

    render(
      <GameWalletProviders>
        <span data-testid="game-content">Game content</span>
      </GameWalletProviders>
    )

    expect(screen.getByTestId('audit-fixture-provider')).toBeTruthy()
    expect(screen.getByTestId('game-content')).toBeTruthy()
    expect(screen.queryByTestId('live-wallet-provider')).toBeNull()
  })
})
