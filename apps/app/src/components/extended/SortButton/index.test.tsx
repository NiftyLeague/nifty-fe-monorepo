import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import { Button } from '@nl/ui/base/button'

import SortButton from './index'

describe('SortButton', () => {
  it('dismisses its menu on outside pointer and Escape while preserving focus', () => {
    const handleSort = () => {}
    render(
      <SortButton handleSort={handleSort}>
        <Button>Sort</Button>
      </SortButton>
    )

    const trigger = screen.getByRole('button', { name: /sort/i })
    fireEvent.click(trigger)
    expect(screen.getByRole('menu')).not.toBeNull()
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    fireEvent.pointerDown(document.body)
    expect(screen.queryByRole('menu')).toBeNull()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(trigger)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })
})
