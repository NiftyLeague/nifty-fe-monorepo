import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, mock } from 'bun:test'

let isDesktopViewport = false

mock.module('next/dynamic', () => ({
  default: () =>
    function LoadedUserProfile() {
      return <div data-testid="loaded-user-profile" />
    },
}))

mock.module('@nl/ui/hooks/useMediaQuery', () => ({
  useMediaQuery: () => isDesktopViewport,
}))

mock.module('@/contexts/WalletAuthProvidersBoundary', () => ({
  default: ({ children, enabled }: React.PropsWithChildren<{ enabled?: boolean }>) =>
    enabled ? <div data-testid="wallet-auth-boundary">{children}</div> : null,
}))

describe('PublicUserProfile', () => {
  beforeEach(() => {
    isDesktopViewport = false
  })

  it('activates only the mobile profile slot on compact screens', async () => {
    const { default: PublicUserProfile } = await import('./PublicUserProfile')

    render(
      <>
        <PublicUserProfile placement="mobile" />
        <PublicUserProfile placement="desktop" />
      </>
    )

    expect(screen.getAllByTestId('wallet-auth-boundary')).toHaveLength(1)
    expect(screen.getAllByTestId('loaded-user-profile')).toHaveLength(1)
  })

  it('activates only the desktop profile slot on wide screens', async () => {
    isDesktopViewport = true
    const { default: PublicUserProfile } = await import('./PublicUserProfile')

    render(
      <>
        <PublicUserProfile placement="mobile" />
        <PublicUserProfile placement="desktop" />
      </>
    )

    expect(screen.getAllByTestId('wallet-auth-boundary')).toHaveLength(1)
    expect(screen.getAllByTestId('loaded-user-profile')).toHaveLength(1)
  })
})
