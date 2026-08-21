import { render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/base/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div role="dialog">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

mock.module('@nl/ui/hooks/useMediaQuery', () => ({
  useMediaQuery: () => false,
}))

mock.module('@nl/ui/custom/deferred-component', () => ({
  default: ({ enabled, label }: { enabled: boolean; label: string }) =>
    enabled ? <div role="status">{label}</div> : null,
}))

describe('TermsOfServiceDialog', () => {
  it('does not enable the terms content while closed', async () => {
    const { default: TermsOfServiceDialog } = await import('./index')

    render(<TermsOfServiceDialog open={false} onClose={mock()} />)

    expect(screen.queryByRole('status')).toBeNull()
  })

  it('enables the terms content when opened', async () => {
    const { default: TermsOfServiceDialog } = await import('./index')

    render(<TermsOfServiceDialog open onClose={mock()} />)

    expect(screen.getByRole('status').textContent).toBe('Terms and conditions')
  })
})
