import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

import ExpandableListItem from './ExpandableListItem'

describe('ExpandableListItem', () => {
  it('uses an accessible accordion trigger and preserves row selection', () => {
    const onSelect = mock()

    render(
      <ExpandableListItem
        checkboxSelection
        details={<span>Expanded row details</span>}
        onSelect={onSelect}
        row={{ id: 'row-1' }}
        scrollToSelected={false}
        selected={false}
        summary="Player One"
      />
    )

    const trigger = screen.getByRole('button', { name: 'Player One' })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(screen.getByRole('checkbox', { name: 'Select row-1' })).not.toBeNull()

    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText('Expanded row details')).not.toBeNull()

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select row-1' }))
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
