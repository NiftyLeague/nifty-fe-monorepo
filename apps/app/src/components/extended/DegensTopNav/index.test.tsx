import { fireEvent, render, screen } from '@nl/ui/test-utils'
import { describe, expect, it, mock } from 'bun:test'

import DegensTopNav from './index'

describe('DegensTopNav', () => {
  it('uses the shared accessible select for sorting degens', async () => {
    const handleSort = mock()

    render(() => <DegensTopNav
        searchTerm=""
        handleChangeSearchTerm={() => {}}
        handleSort={handleSort}
        sortValue="idUp"
        layoutMode="gridView"
        handleChangeLayoutMode={() => {}}
      />
    )

    const searchInput = screen.getByRole('textbox', { name: 'Search degens by token # or name' })
    const searchField = searchInput.parentElement
    const inputToolbar = searchField?.parentElement
    const toolbar = inputToolbar?.parentElement

    expect(searchInput).toBeTruthy()
    expect(searchInput.getAttribute('placeholder')).toBe('Search degens by token # or name')
    expect(screen.queryByText('Search degens by token # or name')).toBeNull()
    expect(toolbar?.getAttribute('data-slot')).toBe('degen-top-nav')
    expect(inputToolbar?.getAttribute('data-slot')).toBe('degen-search-toolbar')
    expect(searchField?.getAttribute('data-slot')).toBe('degen-search-field')
    expect(searchInput.parentElement).toBe(searchField)

    // Kobalte's trigger is a <button aria-haspopup="listbox"> whose accessible
    // name comes from the selected value via aria-labelledby, so target it by
    // its wrapper slot + aria-label instead of a combobox role query.
    const sortTrigger = await screen.findByLabelText('Sort degens', undefined, {
      timeout: 5000,
    })
    const controls = inputToolbar?.querySelector('[data-slot="degen-search-controls"]')

    expect(sortTrigger.getAttribute('data-size')).toBe('sm')
    expect(inputToolbar?.contains(sortTrigger)).toBe(true)
    expect(controls).toBeTruthy()
    expect(controls?.parentElement).toBe(inputToolbar)
    expect(sortTrigger.textContent).toContain('ID Low to High')

    // Kobalte opens the listbox on pointerdown, not click.
    fireEvent.pointerDown(sortTrigger)
    fireEvent.click(sortTrigger)
    const option = await screen.findByRole('option', { name: 'ID High to Low' }, { timeout: 2000 })
    fireEvent.click(option)

    expect(handleSort).toHaveBeenCalledWith('idDown')
  })
})
