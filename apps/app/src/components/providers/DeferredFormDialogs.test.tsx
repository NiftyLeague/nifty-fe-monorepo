import { act, render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

import type { RentalDataGrid } from '@/types/rentalDataGrid'

mock.module('@nl/ui/custom/deferred-component', () => ({
  default: ({ enabled, label }: { enabled: boolean; label: string }) => {
    if (!enabled) return null
    return <div role="status">{label}</div>
  },
}))

describe('deferred dashboard form dialogs', () => {
  it('keeps the rental nickname form unloaded until its dialog opens', async () => {
    const { default: DeferredChangeNicknameDialog } = await import('./DeferredChangeNicknameDialog')
    const rendered = render(
      <DeferredChangeNicknameDialog
        open={false}
        rental={{} as RentalDataGrid}
        updateNickname={() => {}}
      />
    )

    expect(screen.queryByRole('status')).toBeNull()

    await act(async () => {
      rendered.rerender(
        <DeferredChangeNicknameDialog
          open
          rental={{} as RentalDataGrid}
          updateNickname={() => {}}
        />
      )
    })

    expect(screen.getByRole('status').textContent).toBe('Rental nickname form')
  })

  it('keeps the DEGEN rename form unloaded until its dialog opens', async () => {
    const { default: DeferredRenameDegenDialog } = await import('./DeferredRenameDegenDialog')
    const rendered = render(<DeferredRenameDegenDialog open={false} />)

    expect(screen.queryByRole('status')).toBeNull()

    await act(async () => {
      rendered.rerender(<DeferredRenameDegenDialog open />)
    })

    expect(screen.getByRole('status').textContent).toBe('DEGEN rename form')
  })
})
