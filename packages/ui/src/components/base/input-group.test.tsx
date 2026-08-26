import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'
import { Mail } from 'lucide-react'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupPasswordToggle,
  InputGroupText,
} from '@nl/ui/base/input-group'

describe('InputGroup', () => {
  it('keeps the shared input accessible and focuses it from the icon addon', () => {
    render(
      <>
        <label htmlFor="email">Email</label>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>
              <Mail aria-hidden="true" />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput id="email" type="email" aria-invalid="true" />
        </InputGroup>
      </>
    )

    const input = screen.getByLabelText('Email')
    expect(input.getAttribute('data-slot')).toBe('input-group-control')
    expect(input.getAttribute('aria-invalid')).toBe('true')

    const inputGroup = document.querySelector('[data-slot="input-group"]')
    expect(inputGroup).not.toBeNull()

    fireEvent.click(inputGroup!.querySelector('[data-slot="input-group-addon"]')!)
    expect(document.activeElement).toBe(input)
  })

  it('uses non-submitting buttons for inline actions', () => {
    render(
      <InputGroup>
        <InputGroupInput aria-label="Wallet" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="sm">Connect</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    )

    expect(screen.getByRole('button', { name: 'Connect' }).getAttribute('type')).toBe('button')
  })

  it('provides an accessible password visibility toggle', () => {
    let visible = false
    const onVisibleChange = (nextVisible: boolean) => {
      visible = nextVisible
    }

    render(
      <InputGroup>
        <InputGroupInput
          type={visible ? 'text' : 'password'}
          aria-label="Password"
          value="secret"
          readOnly
        />
        <InputGroupAddon align="inline-end">
          <InputGroupPasswordToggle visible={visible} onVisibleChange={onVisibleChange} />
        </InputGroupAddon>
      </InputGroup>
    )

    const toggle = screen.getByRole('button', { name: 'Reveal' })
    expect(toggle.getAttribute('type')).toBe('button')
    fireEvent.click(toggle)
    expect(visible).toBe(true)
  })
})
