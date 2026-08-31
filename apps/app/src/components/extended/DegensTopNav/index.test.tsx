import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

import DegensTopNav from './index'

describe('DegensTopNav', () => {
  it('uses the shared accessible select for sorting degens', async () => {
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

    const searchInput = screen.getByRole('textbox', { name: 'Search degens by token # or name' })
    expect(searchInput).toBeTruthy()
    expect(searchInput.parentElement?.parentElement?.className).toContain('sm:items-end')

    const sortTrigger = await screen.findByRole(
      'combobox',
      { name: 'Sort degens' },
      { timeout: 5000 }
    )
    expect(sortTrigger.textContent).toContain('ID Low to High')

    fireEvent.click(sortTrigger)
    fireEvent.click(screen.getByRole('option', { name: 'ID High to Low' }))

    expect(handleSort).toHaveBeenCalledWith('idDown')
  })
})
