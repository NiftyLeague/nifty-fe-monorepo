import { fireEvent, render, screen } from '@nl/ui/test-utils'
import { describe, expect, it } from 'bun:test'

import { Dialog, DialogContent, DialogTrigger } from './index'

describe('application DialogContent wrapper', () => {
  it('forwards shared layout and accessibility props to the dialog surface', () => {
    render(() => (
      <Dialog>
        <DialogTrigger>
          <button type="button">Open dialog</button>
        </DialogTrigger>
        <DialogContent
          aria-label="Audit dialog"
          class="max-w-225 min-h-75"
          dialogTitle="Dialog title"
        >
          Dialog body
        </DialogContent>
      </Dialog>
    ))

    fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }))
    const dialog = screen.getByRole('dialog', { name: 'Dialog title' })
    expect(dialog.getAttribute('aria-label')).toBe('Audit dialog')
    expect(dialog.className).toContain('max-w-225')
    expect(dialog.className).toContain('min-h-75')
    expect(dialog.textContent).toContain('Dialog body')
  })
})
