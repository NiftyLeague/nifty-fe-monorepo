import { fireEvent, render, screen } from '@nl/ui/test-utils'
import { describe, expect, it, mock } from 'bun:test'

import QueryErrorState from './QueryErrorState'

describe('QueryErrorState', () => {
  it('surfaces the request error and exposes a retry action', () => {
    const onRetry = mock()
    render(() => <QueryErrorState error={new Error('Catalogue unavailable')} onRetry={onRetry} />)

    expect(screen.getByRole('alert').textContent).toContain('Catalogue unavailable')
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders useful messages for non-Error failures', () => {
    const { unmount } = render(() => (
      <QueryErrorState error="Request timed out" onRetry={() => {}} />
    ))
    expect(screen.getByRole('alert').textContent).toContain('Request timed out')

    unmount()
    render(() => <QueryErrorState error={{ status: 503 }} onRetry={() => {}} />)
    expect(screen.getByRole('alert').textContent).toContain('An unexpected error occurred')
  })
})
