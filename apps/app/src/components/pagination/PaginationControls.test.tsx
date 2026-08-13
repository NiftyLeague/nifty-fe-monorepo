import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

import { PaginationControls } from './PaginationControls'

describe('PaginationControls', () => {
  it('renders accessible navigation buttons and preserves their callbacks', () => {
    const onClickPrev = mock()
    const onClickNext = mock()
    const { getByRole } = render(
      <PaginationControls
        hasNext
        hasPrev={false}
        onClickNext={onClickNext}
        onClickPrev={onClickPrev}
        pageLabel={<span>Page 1 of 2</span>}
      />
    )

    const previous = getByRole('button', { name: 'Previous page' })
    const next = getByRole('button', { name: 'Next page' })
    expect(previous.hasAttribute('disabled')).toBe(true)
    expect(next.hasAttribute('disabled')).toBe(false)

    fireEvent.click(next)
    expect(onClickNext).toHaveBeenCalledTimes(1)
    fireEvent.click(previous)
    expect(onClickPrev).not.toHaveBeenCalled()
  })
})
