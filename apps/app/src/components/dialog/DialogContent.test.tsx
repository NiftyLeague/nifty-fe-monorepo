import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { Dialog, DialogContent, DialogTrigger } from './index'

describe('application DialogContent wrapper', () => {
  it('forwards shared layout and accessibility props to the dialog surface', () => {
    render(
      <Dialog>
        <DialogTrigger>
          <button type="button">Open dialog</button>
        </DialogTrigger>
        <DialogContent
          aria-label="Audit dialog"
          className="max-w-[900px]"
          dialogTitle="Dialog title"
          sx={{ minHeight: '300px' }}
        >
          Dialog body
        </DialogContent>
      </Dialog>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }))
    const dialog = screen.getByRole('dialog', { name: 'Dialog title' })
    expect(dialog.getAttribute('aria-label')).toBe('Audit dialog')
    expect(dialog.className).toContain('max-w-[900px]')
    expect(dialog.style.minHeight).toBe('300px')
    expect(dialog.textContent).toContain('Dialog body')
  })
})
