import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import type { RentalDataGrid } from '@/types/rentalDataGrid'
import RentalsTableSimple from './RentalsTableSimple'

const rental: RentalDataGrid = {
  id: 'rental-1',
  rentalId: 'rental-1',
  degenId: '42',
  multiplier: 1,
  roi: 12.5,
  earningCap: 100,
  category: 'direct-rental',
  totalEarnings: 40,
}

describe('RentalsTableSimple', () => {
  it('renders shared table semantics and formatted rental values', () => {
    render(
      <RentalsTableSimple
        rentals={[rental]}
        columns={[
          { id: 'degenId', label: 'Degen ID' },
          { id: 'winRate', label: 'Win Rate' },
        ]}
      />
    )

    expect(screen.getByRole('table', { name: 'simple table' })).not.toBeNull()
    expect(screen.getByRole('columnheader', { name: 'Degen ID' })).not.toBeNull()
    expect(screen.getByRole('cell', { name: '42' })).not.toBeNull()
    expect(screen.getByRole('cell', { name: '0%' })).not.toBeNull()
  })

  it('uses the visible column count for the empty state', () => {
    render(
      <RentalsTableSimple
        rentals={[]}
        columns={[
          { id: 'degenId', label: 'Degen ID' },
          { id: 'earningCapProgress', label: 'Earnings Cap' },
        ]}
      />
    )

    const emptyState = screen.getByRole('cell', { name: /don't have any rentals yet/i })
    expect(emptyState.getAttribute('colspan')).toBe('2')
  })
})
