import { describe, expect, it, mock } from 'bun:test'
import { render } from '@solidjs/testing-library'

mock.module('@/runtime/env', () => ({ AUDIT_FIXTURE: true }))

const { Web3ModalProvider } = await import('@/contexts/Web3ModalContext')

describe('Web3ModalProvider audit fixture', () => {
  it('mounts children with the connector-free wagmi config instead of the wallet error boundary', async () => {
    const { container, findByText } = render(() => (
      <Web3ModalProvider>
        <span>fixture content</span>
      </Web3ModalProvider>
    ))

    await findByText('fixture content')
    expect(container.textContent).not.toContain('Wallet provider could not be loaded')
  })
})
