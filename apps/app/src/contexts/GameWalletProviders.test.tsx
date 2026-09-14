import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, mock } from 'bun:test'

mock.module('@/runtime/env', () => ({ AUDIT_FIXTURE: true }))
mock.module('@/runtime/request-cookies', () => ({ getRequestCookieHeader: () => null }))
mock.module('@/runtime/dynamic', () => ({
  default:
    () =>
    ({ children }: React.PropsWithChildren) =>
      children,
}))
mock.module('@/contexts/AuditFixtureContextWrapper', () => ({
  default: ({ children }: React.PropsWithChildren) => (
    <div data-testid="audit-fixture-provider">{children}</div>
  ),
}))
mock.module('@/contexts/WalletAuthProviders', () => ({
  default: ({ children }: React.PropsWithChildren) => (
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
