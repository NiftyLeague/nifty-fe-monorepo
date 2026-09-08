import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing'

mock.module('@/hooks/useAuth', () => ({
  default: () => ({
    handleConnectWallet: mock(),
    isConnected: false,
    isLoggedIn: false,
  }),
}))

mock.module('@/contexts/DegenOwnershipContext', () => ({
  useDegenOwnershipContext: () => ({ isDegenOwner: false }),
}))

const { default: MintPageContent } = await import('./MintPageContent')

describe('MintPageContent', () => {
  it('centers the signed-out wallet prompt in the available page area', () => {
    render(<MintPageContent />, {
      wrapper: withNuqsTestingAdapter({ searchParams: '?nifty_artists=false' }),
    })

    const heading = screen.getByRole('heading', { name: 'Please connect your wallet' })
    const prompt = heading.parentElement

    expect(prompt?.className).toContain('min-h-[calc(100dvh-56px)]')
    expect(prompt?.className).toContain('lg:min-h-[calc(100dvh-60px)]')
    expect(screen.getByRole('button', { name: 'Connect Wallet' })).not.toBeNull()
  })

  it('only enables the artist route override for an explicit true value', () => {
    render(<MintPageContent />, {
      wrapper: withNuqsTestingAdapter({ searchParams: '?nifty_artists=true' }),
    })

    expect(screen.queryByRole('heading', { name: 'Please connect your wallet' })).toBeNull()
  })
})
