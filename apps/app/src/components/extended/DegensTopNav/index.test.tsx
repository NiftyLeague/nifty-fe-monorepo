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
    const inputRow = searchInput.parentElement
    const toolbar = label.parentElement

    expect(searchInput).toBeTruthy()
    expect(searchInput.getAttribute('placeholder')).toBe('Search degens by token # or name')
    expect(label.tagName).toBe('LABEL')
    expect(toolbar?.className).toContain('pt-6')
    expect(label.parentElement).not.toBe(inputRow)
    expect(inputRow?.className).toContain('sm:flex-row')
    expect(inputRow?.className).toContain('sm:items-center')

    const sortTrigger = await screen.findByRole(
      'combobox',
      { name: 'Sort degens' },
      { timeout: 5000 }
    )
    expect(sortTrigger.getAttribute('data-size')).toBe('sm')
    expect(inputRow?.contains(sortTrigger)).toBe(true)
    expect(sortTrigger.textContent).toContain('ID Low to High')

    fireEvent.click(sortTrigger)
    fireEvent.click(screen.getByRole('option', { name: 'ID High to Low' }))

    expect(handleSort).toHaveBeenCalledWith('idDown')
  })
})
