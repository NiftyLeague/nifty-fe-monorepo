import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

import DegensTopNav from './index'

describe('DegensTopNav', () => {
  it('uses the shared accessible select for sorting degens', () => {
    const handleSort = mock()

    render(
      <DegensTopNav
        searchTerm=""
        handleChangeSearchTerm={() => {}}
        handleSort={handleSort}
        sortValue="idUp"
        layoutMode="gridView"
        handleChangeLayoutMode={() => {}}
      />
    )

    expect(screen.getByRole('textbox', { name: 'Search degens by token # or name' })).toBeTruthy()

    const sortTrigger = screen.getByRole('combobox', { name: 'Sort degens' })
    expect(sortTrigger.textContent).toContain('ID Low to High')

    fireEvent.click(sortTrigger)
    fireEvent.click(screen.getByRole('option', { name: 'ID High to Low' }))

    expect(handleSort).toHaveBeenCalledWith('idDown')
  })
})
