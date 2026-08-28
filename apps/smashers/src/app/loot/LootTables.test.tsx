import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'bun:test'

import LootTables from './LootTables'

describe('LootTables', () => {
  it('keeps the server-rendered loot content semantic and complete', () => {
    render(<LootTables />)

    expect(screen.getAllByRole('table').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('columnheader', { name: 'Item' }).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Drop Tables & Odds').length).toBeGreaterThan(0)
  })
})
