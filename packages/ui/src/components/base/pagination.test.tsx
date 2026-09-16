import { createSignal } from 'solid-js'
import { fireEvent, render, screen } from '@nl/ui/test-utils'
import { describe, expect, it, mock } from 'bun:test'

import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
} from './pagination'

function setup(props: {
  count: number
  defaultPage?: number
  onPageChange?: (page: number) => void
}) {
  return (
    <Pagination
      count={props.count}
      defaultPage={props.defaultPage ?? 1}
      onPageChange={props.onPageChange}
      itemComponent={(itemProps) => (
        <PaginationItem page={itemProps.page}>{itemProps.page}</PaginationItem>
      )}
      ellipsisComponent={() => (
        <PaginationEllipsis>
          <span aria-hidden>…</span>
          <span class="sr-only">More pages</span>
        </PaginationEllipsis>
      )}
    >
      <PaginationPrevious aria-label="Go to previous page" />
      <PaginationItems />
      <PaginationNext aria-label="Go to next page" />
    </Pagination>
  )
}

describe('Pagination (Kobalte)', () => {
  it('renders a navigation landmark with page items', () => {
    render(() => setup({ count: 5 }))

    expect(screen.getByRole('navigation')).toBeTruthy()
    expect(screen.getByRole('button', { name: '2' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeTruthy()
  })

  it('marks the current page with aria-current and changes pages on click', () => {
    const onPageChange = mock()
    render(() => setup({ count: 5, onPageChange }))

    expect(screen.getByRole('button', { name: '1' }).getAttribute('aria-current')).toBe('page')

    fireEvent.click(screen.getByRole('button', { name: '3' }))

    expect(onPageChange).toHaveBeenCalledWith(3)
    expect(screen.getByRole('button', { name: '3' }).getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('button', { name: '1' }).getAttribute('aria-current')).toBeNull()
  })

  it('respects a controlled page and disables Previous on the first page', () => {
    render(() => setup({ count: 5, defaultPage: 1 }))

    const previous = screen.getByRole('button', { name: 'Go to previous page' })
    expect(previous.hasAttribute('disabled') || previous.getAttribute('aria-disabled')).toBeTruthy()
  })

  it('collapses long ranges into ellipsis items', () => {
    render(() => setup({ count: 12, defaultPage: 6 }))

    expect(screen.getAllByText('More pages').length).toBeGreaterThan(0)
  })

  it('keeps the rendered page list in sync when the count signal changes', async () => {
    const [count, setCount] = createSignal(5)
    const view = render(() => (
      <Pagination
        count={count()}
        defaultPage={1}
        itemComponent={(itemProps) => (
          <PaginationItem page={itemProps.page}>{itemProps.page}</PaginationItem>
        )}
        ellipsisComponent={() => <PaginationEllipsis />}
      >
        <PaginationItems />
      </Pagination>
    ))

    expect(screen.queryByRole('button', { name: '5' })).toBeTruthy()
    setCount(3)
    await Promise.resolve()
    expect(screen.queryByRole('button', { name: '5' })).toBeNull()
    expect(screen.queryByRole('button', { name: '3' })).toBeTruthy()
    view.unmount()
  })
})
