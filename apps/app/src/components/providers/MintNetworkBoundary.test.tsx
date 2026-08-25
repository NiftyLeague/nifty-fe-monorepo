import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/deferred-component', () => ({
  default: ({
    disabledFallback,
    enabled,
    label,
  }: {
    disabledFallback?: React.ReactNode
    enabled?: boolean
    label: string
  }) => (enabled ? <div role="status">{label}</div> : disabledFallback),
}))

describe('MintNetworkBoundary', () => {
  const previousAuditFixture = process.env.NEXT_PUBLIC_AUDIT_FIXTURE

  afterEach(() => {
    if (previousAuditFixture === undefined) {
      delete process.env.NEXT_PUBLIC_AUDIT_FIXTURE
    } else {
      process.env.NEXT_PUBLIC_AUDIT_FIXTURE = previousAuditFixture
    }
  })

  it('bypasses the network provider in audit fixtures without hiding the canvas', async () => {
    process.env.NEXT_PUBLIC_AUDIT_FIXTURE = 'true'
    const { default: MintNetworkBoundary } = await import('./MintNetworkBoundary')

    render(
      <MintNetworkBoundary>
        <div data-testid="mint-canvas">Mint canvas</div>
      </MintNetworkBoundary>
    )

    expect(screen.getByTestId('mint-canvas')).toBeTruthy()
    expect(screen.queryByRole('status')).toBeNull()
  })
})
