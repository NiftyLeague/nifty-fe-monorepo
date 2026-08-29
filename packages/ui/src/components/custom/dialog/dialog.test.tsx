import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import Dialog from './index'

describe('Dialog', () => {
  it('uses the shared eager logo without changing dialog semantics', () => {
    render(
      <Dialog
        defaultOpen
        description="Dialog details"
        title="Dialog title"
        triggerElement={<button type="button">Open dialog</button>}
      >
        <p>Dialog content</p>
      </Dialog>
    )

    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(screen.getByRole('heading', { name: /Dialog title/ })).toBeTruthy()
    const logo = screen.getByRole('img', { name: 'Company Logo' })
    expect(logo.getAttribute('loading')).toBe('eager')
    expect(logo.getAttribute('width')).toBe('45')
    expect(logo.getAttribute('height')).toBe('42')
  })
})
