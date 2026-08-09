import { describe, expect, it, mock } from 'bun:test'

const mockAlchemyProvider = mock(() => ({}) as never)
const mockWallet = mock(() => ({}) as never)

mock.module('node-config-ts', () => ({
  config: {
    eth: {
      network: 'mainnet',
      alchemy: { mainnet: 'mainnet-key', sepolia: 'sepolia-key' },
      account: { pk: '0xPRIVATEKEY' },
    },
  },
}))

mock.module('ethers', () => ({
  AlchemyProvider: mockAlchemyProvider,
  Wallet: mockWallet,
}))

const { getProvider, getWallet } = await import('./wallet')

describe('wallet.getProvider', () => {
  it('constructs an AlchemyProvider from config for the default network', () => {
    getProvider()
    expect(mockAlchemyProvider).toHaveBeenCalledWith('mainnet', 'mainnet-key')
  })

  it('honours an explicit target network and its alchemy key', () => {
    getProvider('sepolia')
    expect(mockAlchemyProvider).toHaveBeenCalledWith('sepolia', 'sepolia-key')
  })
})

describe('wallet.getWallet', () => {
  it('builds a Wallet from the provider and configured private key', () => {
    getWallet()
    // First the provider is constructed...
    expect(mockAlchemyProvider).toHaveBeenCalledWith('mainnet', 'mainnet-key')
    // ...then the Wallet is constructed with the pk + provider.
    expect(mockWallet).toHaveBeenCalledWith('0xPRIVATEKEY', expect.anything())
  })

  it('passes the explicit network through to the provider', () => {
    getWallet('sepolia')
    expect(mockWallet).toHaveBeenCalledWith('0xPRIVATEKEY', expect.any(Object))
    expect(mockAlchemyProvider).toHaveBeenCalledWith('sepolia', 'sepolia-key')
  })
})
