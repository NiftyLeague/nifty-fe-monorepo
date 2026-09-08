import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, mock } from 'bun:test'

import QueryErrorState from './QueryErrorState'

describe('QueryErrorState', () => {
  it('surfaces the request error and exposes a retry action', () => {
    const onRetry = mock()
    render(<QueryErrorState error={new Error('Catalogue unavailable')} onRetry={onRetry} />)

    expect(screen.getByRole('alert').textContent).toContain('Catalogue unavailable')
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
