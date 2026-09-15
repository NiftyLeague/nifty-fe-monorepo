import { createSignal } from 'solid-js'
import { render, screen, waitFor } from '@nl/ui/test-utils'
import { describe, expect, it } from 'bun:test'

import PlayDialog from './index'

describe('PlayDialog', () => {
  it('closes when the controlled open prop flips back to false', async () => {
    const [open, setOpen] = createSignal(true)
    render(() => <PlayDialog open={open()} onOpenChange={setOpen} />)

    expect(screen.getByRole('dialog')).toBeTruthy()

    setOpen(false)

    await waitFor(() => {
      const dialog = screen.queryByRole('dialog')
      expect(
        dialog == null ||
          dialog.hasAttribute('hidden') ||
          dialog.getAttribute('data-expanded') == null
      ).toBe(true)
    })
  })
})
