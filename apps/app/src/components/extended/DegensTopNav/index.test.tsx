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
    const label = screen.getByText('Search degens by token # or name')
    const searchField = searchInput.parentElement
    const inputToolbar = searchField?.parentElement
    const toolbar = inputToolbar?.parentElement

    expect(searchInput).toBeTruthy()
    expect(searchInput.getAttribute('placeholder')).toBe('Search degens by token # or name')
    expect(label.tagName).toBe('LABEL')
    expect(toolbar?.getAttribute('data-slot')).toBe('degen-top-nav')
    expect(inputToolbar?.getAttribute('data-slot')).toBe('degen-search-toolbar')
    expect(searchField?.getAttribute('data-slot')).toBe('degen-search-field')
    expect(label.parentElement).toBe(searchField)

    const sortTrigger = await screen.findByRole(
      'combobox',
      { name: 'Sort degens' },
      { timeout: 5000 }
    )
    const controls = inputToolbar?.querySelector('[data-slot="degen-search-controls"]')

    expect(sortTrigger.getAttribute('data-size')).toBe('sm')
    expect(inputToolbar?.contains(sortTrigger)).toBe(true)
    expect(controls).toBeTruthy()
    expect(controls?.parentElement).toBe(inputToolbar)
    expect(sortTrigger.textContent).toContain('ID Low to High')

    fireEvent.click(sortTrigger)
    fireEvent.click(screen.getByRole('option', { name: 'ID High to Low' }))

    expect(handleSort).toHaveBeenCalledWith('idDown')
  })
})
