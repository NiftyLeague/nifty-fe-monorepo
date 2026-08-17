import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

mock.module('@nl/ui/custom/deferred-component', () => ({
  default: ({ enabled, label }: { enabled: boolean; label: string }) => {
    if (!enabled) return null
    return <div role="status">{label}</div>
  },
}))

describe('DeferredDegenDialog', () => {
  it('does not render the dialog boundary while it is closed', async () => {
    const { default: DeferredDegenDialog } = await import('./DeferredDegenDialog')

    render(<DeferredDegenDialog open={false} />)

    expect(screen.queryByRole('status')).toBeNull()
  })

  it('enables the shared boundary only when the dialog opens', async () => {
    const { default: DeferredDegenDialog } = await import('./DeferredDegenDialog')
    const rendered = render(<DeferredDegenDialog open={false} />)

    await act(async () => {
      rendered.rerender(<DeferredDegenDialog open />)
    })

    expect(screen.getByRole('status').textContent).toBe('DEGEN details')
  })
})
